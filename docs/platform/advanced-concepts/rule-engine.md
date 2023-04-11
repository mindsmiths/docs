---
sidebar_position: 6
---

# Rule Engine

The rule engine service is the core of the Forge platform. It is responsible for evaluating the rules and signals sent to agents.
It is what actually simulates agents on a higher level of abstraction.

You can learn more about how to create agents and write rules in [Creating Agents](/docs/platform/main-concepts/creating-agents)
and [Writing rules](/docs/platform/main-concepts/writing-rules).

## How it works
When running `forge run`, one of the services that is started is the rule engine service. Its "main" function can be found in the `Runner.java` file.

During initialization, a few things happen:
- All rules are loaded and a Drools session pool initialized
- The whole classpath is scanned for:
  - All subclasses of `Signal` - a mapping is created from the signal name to the class itself. This is how the service knows what class to deserialize the raw JSON message received from the topic. That's also why the signal names must be unique across the whole project.
  - Event mapping strategies (eg. `GetOrCreateAgent`), which can be used in `signals.yaml` to map events to agents.
  - Agent types (subclasses of `Agent`) - a mapping is created from the agent type to the class itself
  - All classes annotated with `@DataModel` - similarly to signals, creates a mapping from the data model name to the actual class
- `Runner.initialize` function is called where you can do any additional initialization (typically registering for events)

After initialization, the `start` method is called, which performs the following steps:
- The service loads all registered events and figures out which topics it should listen on
- If it's running locally, it unlocks all agents (to help with development)
- It starts a message consumer listening indefinitely on the appropriate topics

In addition to the event topics, two other topics are used:
- `rule_engine-input` - used for API calls to the rule engine itself
- `agents-input` - where messages to agents are sent

When a message on the `rule_engine-input` topic is received, the service will run the specified Rule Engine's API, just like any other service. You can use `RuleEngineAPI` to send such messages.

When a message on the `agents-input` topic is received, the service will deserialize it into the appropriate class and evaluate the agent specified in the `to` field with the signal added to the `signals` entry point.
If the message is of type `MESSAGE`, `REPLY` or `ERROR`, the field `messageType` is used to find the signal class.
If the message is of type `EVENT`, the field `eventType` is used. If it's `DATA_CHANGE`, the field `objectType` is used.

When a message on any of the event topics is received, the service will deserialize the event into the appropriate class, determine which agent(s) it should be sent to, and call `evaluateWithSignal` for each of them.
It determines that by using the event mapping strategies specified in `signals.yaml` or in `configureSignals` (`Events.on` or `DataChanges.on`). To learn more about configuring signals, see [Event subscriptions](#event-subscriptions).

Note: It sends `evaluateWithSignal` messages for each agent in order to distribute the load across multiple rule engine instances in the event of many agents subscribing to the same event, which would block the service until it processes all of them.

## Agent evaluation
In an ideal case, all agents would constantly be running in an infinite loop, listening to signals and evaluating rules.
Unfortunately, that's not possible when you have millions of agents.

Instead, the rule engine listens to signals (including a periodic heartbeat, see [Heartbeat](TODO)), loads the agent from the database, and evaluates the rules.

### Locking
In order to prevent concurrency issues and allow for horizontal scalability, the rule engine uses a locking mechanism to ensure that only one instance of the rule engine is evaluating a specific agent at a time.
You can read more about agent locking [here](TODO).

When the rule engine receives a signal for an agent, it first tries to lock the agent. If it succeeds, it evaluates the agent and unlocks it.
If it doesn't succeed, the signal is atomically appended to `pendingSignals` (or `pendingUpdates` if the signal is actually an `updateAgent` API call).

Before each evaluation, if the lock succeeded, the service checks if there are any pending signals or updates and adds them to the current evaluation.
After each evaluation, it checks again, and if there's something pending it schedules another evaluation.
This makes sure that all signals are always handled immediately instead of waiting for the next heartbeat.

Important ❗
If an exception occurs during agent evaluation, the agent stays locked to prevent infinite error loops!
If an agent is locked for more than 2 minutes, you will get an alert. You will then have to manually fix the error, and unlock the agent.
See [this](TODO) for instructions.

### Evaluation
Before any evaluation can take place, we first need to load the agent's data from the database (MongoDB).
We call this data the agent's _summary_. It contains the agent itself, all facts inserted into the memory, any pending signals or updates, and the lock information.

It looks something like this:
```json
{
  "agentId": "9jk23qns",
  "facts": {
    "agents#MyAgent": {  // the agent itself (of type `agents/MyAgent.java`)
      "9jk23qns": {      // primary key (agent's ID) and the agent's data
        "id": "9jk23qns",
        "connections": {
          "armory": "2gVbxtQp"
        },
        "type": "MyAgent",
        "currentState": null,
        "dataUpdatedAt": "2023-03-27T12:12:02.354928Z",
        "connected": false
      }
    },
    "models#MyFact": {  // a fact that was inserted (of type `models/MyFact.java`)
      "jf8S7Jko": {
        "id": "jf8S7Jko",
        "status": "INITIALIZED",
        "createdAt": "2023-03-01T07:59:08.598193Z",
        "finishedAt": null
      }
    }
  },
  "pendingSignals": {  // optional
    "signals": {       // entry-point
      "com#mindsmiths#armory#event#UserConnectedEvent": {},  // similar to facts
      ...
    }
  },
  "pendingUpdates": {},  // optional
  "lockedAt": "2023-03-27T12:12:02.354928Z"  // optional
}
```
It's normal for there to be many empty objects in the `pendingSignals` field.

Once the summary is loaded the following happens:
1. The facts and signals from the summary are deserialized into the specified classes
2. A new Drools session is created
3. Facts (along with the agent) are inserted into the memory
4. Signals that triggered the evaluation, along with any pending signals, are inserted into the appropriate entry-point (usually `signals`)
5. A special signal called `Heartbeat` is inserted into the `signals` entry-point
6. Agent's rules are evaluated
7. Resulting facts are serialized and the summary is updated
8. An `Evaluation` event is emitted

It's important to keep in mind that the agent and all inserted facts have to be serializable to JSON.

### Infinite loop protection
It's quite easy to find yourself in an infinite loop when writing rules.
That's why we've added a mechanism to stop rule execution after a certain number of rules have fired.
The default value is 100, but you can tweak it by changing the `MAX_RULES_FIRED` variable in `Runner.initialize`.


## Event subscriptions
There are two ways to subscribe to events - with a `yaml` file or with code.

### YAML
Some plugins will automatically generate a `signals.yaml` file in the `resources/config` directory.
The structure is as follows:
```yaml
com.mindsmiths.armory.event.UserConnected:  # event class
  - !GetAgentByConnection                   # subscription strategy
    connectionName: armory                  # strategy-specific parameters...
    connectionField: connectionId
com.mindsmiths.armory.event.Submit:         # another event class
  - !GetAgentByConnection                   # ...
    connectionName: armory
    connectionField: connectionId
...
```

You then have to call `configureSignals` in `Runner.initialize` to load this YAML file:
```java
public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        configureSignals(getClass().getResourceAsStream("config/signals.yaml"));
        ...
    }   
    ...
}
```

#### Subscription strategies
Possible strategies are:
- `AlwaysSendTo` - always sends the event to a specific agent. Parameters:
  - `agentId` (required) - ID of the agent to send the events to
- `AlwaysSendToMultiple` - always sends the event to a specific list of agents. Parameters:
  - `agentIds` (required) - list of agent IDs to send the events to
- `SendToAll` - sends the event to all agents of a specific type. Parameters:
  - `agentType` (required) - type of the agent to send the event to
- `GetOrCreateAgent` - sends the event to an agent that has a specific ID, or creates a new agent if it doesn't exist. Parameters:
  - `agentId` (required) - ID of the agent to send the event to
  - `agentType` (required) - type of agent to create if no agent with `agentId` exists (eg. `Smith`)
- `GetAgentByConnection` - sends the event to agent(s) with a specific connection. Parameters:
  - `connectionName` (required) - name of the connection
  - `connectionField` (required) - name of the field in the event that contains the connection ID.
     For example, if the event is `{..., "eventType": "SmsMessageReceived", "from": "38591234567", "text": "Hello!"}` and you have a connection `phoneNumber` on the agent, you would use `from` as the `connectionField` and `phoneNumber` as the `connectionName`.
     You can learn more about agent connections in [Agent connections](#agent-connections).
- `GetOrCreateAgentByConnection` - sends the event to agent(s) with a specific connection, or creates a new agent if it doesn't exist. Parameters:
  - `connectionName` (required) - name of the connection
  - `connectionField` (required) - name of the field in the event that contains the connection ID
  - `agentType` (required) - type of agent to create if no agent with the specified connection exists (with the connection automatically added)

All strategies accept an optional `entryPoint` parameter if you want to send the event to a different entry-point than `signals`.
You can create your custom strategy by implementing the `EventMapping` interface or extending any of the existing strategies. It will be registered automatically, no need for additional setup.

### Code
For more flexibility, you can also subscribe to events in code (usually in `Runner.initialize`).

You can do that by calling `configureSignals` and passing in any number of `Events.on` or `DataChanges.on` calls:
```java
public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        configureSignals(
            Events.on(UserCreated.class).sendTo((event) -> Agents.createAgent(new MyAgent())),
            Events.on(UserConnectedEvent.class).sendTo((event) -> Agents.getByConnection("armory", event.getConnectionId())),
            Events.on(OptionActivated.class).sendTo((event) -> event.getAgentId()),
            DataChanges.on(Order.class).sendTo((order, changeType) -> Agents.getByConnection("userId", event.getUserId())),
            DataChanges.on(Order.class).sendToAll(HITLAgent.class)
        );
    }
    ...
}
```
The `sentTo` function accepts either an agent ID, a list of agent IDs, or a function that returns an agent ID, agent instance, or a list of either.
The `sendToAll` function accepts an agent class.

As you can see, you can subscribe multiple times to the same event, and use different strategies, all of which will be executed.
If you have a complex mapping, or one that repeats multiple times, you can extract it into a function like this:
```java
public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        configureSignals(
            Events.on(OrderCreated.class).sendTo(this::getOrderHandlingAgents)
        );
    }

    public List<Agent> getOrderHandlingAgents(OrderCreated orderCreated) {
        List<Agent> agents = new ArrayList<>();
        for (String handler : orderCreated.getHandlers().split(","))
            agents.addAll(Agents.getByConnection("orderHandler", handler));
        agents.add(Agents.get("ORDER_MANAGER"));
        return agents;
    }
    ...
}
```


## Agent connections
Every agent has a special field called `connections`. Connections are used to find specific agents, usually when processing incoming events.

For example, you can add an `email` connection with the value of the user's email address to an agent, and then search for an agent with the matching email address when processing an incoming email.
Other examples of connections include `phone`, `armoryId`, `telegramId`, etc.

You can also use connections to map agents to users in your database or CRM.


## API

### Calls

#### Evaluate
Evaluates the agent with the specified ID.
```
evaluate(agentId: str) -> None
```

#### Evaluate with signals
Evaluates the agent with the specified ID, and sends the specified signals to it. The dictionary key is the entry-point to send the signals to.
```
evaluate_with_signals(agentId: str, signals: Dict[str, List[Signal]]) -> None
```

#### Create agent
Create a new agent of a given type, with the given data.
This call doesn't require a specific constructor, the params are set directly on the agent's fields.
```
create_agent(agentType: str, **params) -> None
```

Example:
```python
RuleEngineAPI.create_agent("MyAgent", name="John", age=30)
```

#### Update agent
Update an existing agent with the given data.
```
update_agent(agentId: str, **params) -> None
```

Example:
```python
RuleEngineAPI.update_agent("agent-123", age=31)
```

#### Delete agent
Delete an existing agent.
```
delete_agent(agentId: str) -> None
```

#### Remove pending signals
Remove all pending signals for the specified agent.
```
remove_pending_signals(agentId: str) -> None
```

#### Lock agents
Lock the specified agents. Locked agents cannot be evaluated.
```
lock_agents(*agentIds: str) -> None
```

Example:
```python
RuleEngineAPI.lock_agents("agent-123", "agent-456")
```


#### Unlock agents
Unlock the specified agents.
```
unlock_agents(*agentIds: str) -> None
```

#### Lock all agents
```
lock_all_agents() -> None
```

#### Unlock all agents
```
unlock_all_agents() -> None
```


### Events

#### Agent
```python
class Agent(EmittableDataModel):
    id: str
    type: str
    connections: Dict[str, str]
```
The `Agent` data change is emitted when an agent is created, updated or deleted.

#### Evaluation
```python
class Evaluation(Event):
    agentId: str
    evaluatedAt: datetime
```
The `Evaluation` event is emitted after an agent finished its evaluation.


## Tips and tricks

### Initializing an agent
You might be tempted to create a custom constructor for your agent, and do something like this:
```java
Events.on(UserCreated.class).sendTo((userCreated) -> Agents.getOrCreate(userCreated.getUserId(), new MyAgent(userCreated)))  // DON'T DO THIS
```
However, this results in the constructor being called on every event, which is probably not what you want.
Instead, use the empty constructor and process the event in a rule:
```java
rule "User created"
    when
        userCreated: UserCreated() from entry-point "signals"
        agent: MyAgent()
    then
        modify(agent) { initializeUser(userCreated) };
        delete(userCreated);
end
```

Another option to initialize an agent is to utilize the `Initialize` signal. This is the first signal that is automatically sent to an agent when it is created.
```java
rule "Initialize"
    when
        Initialize() from entry-point "signals"
        agent: MyAgent()
    then
        agent.initialize();
end
```

### Debugging an agent
Since version 5.0.1, all rule engine logs include the agent ID. This allows you to easily search or filter (eg. `grep`) logs to debug a specific agent.

### Getting current datetime
You might be tempted to use `LocalDateTime.now()` or `new Date()` to get the current datetime, but this is NOT recommended.
Since the rules are evaluated at slightly different times, edge cases often arise when comparing times, causing infinite loops and non-triggered rules.
Additionally, it breaks the ability to test your rules with a "faked" time.

The right way to do it is by using the `Heartbeat` signal:
```java
rule "Heartbeat"
    when
        Heartbeat(now: timestamp) from entry-point "signals"
        agent: MyAgent(lastCheckInAt before[2h] now)
    then
        // send reminder
        modify(agent) { setReminderSentAt(now) };
end
```

If you need to get the current datetime in a method, you can use `Utils.now()` (`Utils.getUtcDatetime` in older versions).

### Creating another agent from within an agent
You can create another agent from within an agent by calling `Agents.createAgent` from within a rule or a method.
```java
Agents.createAgent(new MyOtherAgent());
```
You can send the other agent a message like this:
```java
rule "Some rule"
    when
        ...
    then
        Agent other = Agents.createAgent(new MyOtherAgent());
        agent.send(other.getId(), new MyMessage());
        
        modify(agent) { setOtherAgentId(other.getId()) };  // usefull to save if you need it later
end
```

### Deleting the current agent
An agent can delete itself by calling `delete(agent)` in a rule, or `Agents.deleteAgent(agent)` elsewhere.
This stops the current evaluation immediately and deletes the agent and its summary.

### Stopping an evaluation early
You can call `Agents.stopEvaluation()` at any point during an evaluation to stop the evaluation immediately.
This is useful if you have a specific condition that should effectively deactivate an agent.

### Salience
There is a special `Salience` class that allows you to categorize the priority of a rule. You can always use an integer for salience, but this class allows you to use a more descriptive approach.
```java
rule "Some rule"
    salience Salience.HIGH
    when
        ...
    then
        ...
end
```

### Temporary facts
Sometimes it's useful to insert a fact into the working memory for use in other rules, but you don't want it to persist.
You can annotate an object with `@TemporaryFact` to prevent it from being persisted into the database.
```java
@Data
@TemporaryFact
public class MyFact {
    ...
}
```
```java
rule "Some rule"
    when
        ...
    then
        insert(new MyFact());  // exists only for the duration of the current evaluation
end
```

### Using cron expressions
There are useful utilities for working with cron expressions built-in. You can evaluate a cron expression like this:
```java
rule "Heartbeat"
    when
        agent: MyAgent()
        Heartbeat(now: timestamp,
                  DateUtil.evaluateCronExpression("* * 9-17 ? * * *", now, agent.getTimezone())) from entry-point "signals"
    then
        ...
end
```

There's also an "or" operation (`//`) to combine multiple cron expressions:
```
* * 9-17 ? * MON-FRI * // * * 9-15 ? * SAT *
```

You can find the next active time for a cron expression with `DateUtil.getNextValidTimeForCron`, or the next starting period with `DateUtil.getNextActiveTimePeriodStartForCron`.
If the expression is already satisfied at the given time, `getNextValidTimeForCron` will return the very next second (if it still satisfies the cron), but `getNextActiveTimePeriodStartForCron` will return the start of the next period.

### Working with timezones
Generally, a good practice for working with time zones is to always store and use UTC internally, and convert to the user's timezone only when displaying the time.

In Java, we usually use the `LocalDateTime` object, which _does not_ store the timezone. It is implicitly assumed to be in UTC by the platform.
To add timezone information, we can create a `ZonedDateTime` object.

You can use `Utils.datetimeInTimezone()` (`forge-sdk`>=5.0.8) or the following snipped to convert a UTC `LocalDateTime` to a `ZonedDateTime` in the user's timezone:
```java
Utils.datetimeInTimezone(localDateTime, timezone)
// or
localDateTime.atZone(ZoneId.of("UTC")).withZoneSameInstant(ZoneId.of(timezone))
```
You can convert the resulting `ZonedDateTime` to a `LocalDateTime` with `zonedDateTime.toLocalDateTime()`, which discards the timezone information, but retains the date and time.
