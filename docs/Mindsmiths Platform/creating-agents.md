---
sidebar_position: 6
---

# Creating agents

To create a new type of agent, you just need to define two things:
1. Agent's data model (Java class)
2. Agent's rules

## Defining the agent's data model
The agent's data model defines the fields and methods which the agent can use in the rules. For example:

```java title="models/agents/Butler.java"
package agents;

import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.telegramAdapter.TelegramAdapterAPI;
import lombok.*;

@Getter
@Setter
public class Butler extends Agent {

    String name;
    List<String> messageHistory = new LinkedList<>();

    public Butler(String name, String telegramId) {
        this.id = "butler";
        this.name = name;
        addConnection("telegram", telegramId);
    }

    public void sendMessage(String text) {
        String chatId = getConnections().get("telegram");
        TelegramAdapterAPI.sendMessage(chatId, text);
    }
}
```

Here we define a new agent type `Butler`. Each "Butler" agent has a name, a connection to a Telegram number, and its own message history.
Additionally, it has a `sendMessage` method that we can call to send a Telegram message to the connected number.

In this case, we decided that there should be a single Butler agent, so we always set the `id` to "butler".
Otherwise, the ID is generated as a random string.

Of course, you don't have to define any of these things and have an empty class, or add fields/methods that you need.


## Defining the agent's rules
First we need to create a new package for rules.
Go to `rules/` (`services/rule_engine/resources/rules/`) and create a new folder `butler/`.
The folder *must* be called the same as the agent's class (ignoring casing - camelCase is recommended).

The agent will only evaluate rules within this package (and the global package).
Within that package, you can create other subpackages to organize your rules.

Now we can create a new `.drl` file where we'll write our rules.
The name of the file is not important, but give it something meaningful so that you can find your rules easier.
You can organize your rules in multiple `drl` files, and each one can contain multiple rules.

For example:
```java title="rules/butler/Conversation.drl"
package rules.butler;

import com.mindsmiths.ruleEngine.model.Initialize;
import com.mindsmiths.telegramAdapter.TelegramReceivedMessage;
import agents.Butler;

rule "Agent created"
    when
        message: Initialize() from entry-point "agent-created"
        agent: Butler()
    then
        agent.sendMessage("Booting up!");
end

rule "Handle message"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Butler()
    then
        agent.sendMessage(message.getText());
        delete(message);
end
```

Important: always make sure the `package` statement defines the correct package.
Otherwise, your rules may not be evaluated or be evaluated by the wrong agent.

To learn more about writing rules, see [Writing rules](./writing-rules).


## Creating a new agent instance
There are multiple ways to create a new agent instance.

### Manually
To manually create an actual agent instance, use `Agents.createAgent()`. It accepts a single parameter - the agent's java class instance.
For example:
```java
Agents.createAgent(new Butler("Albert", "012345678"));
```

You can do this in:
- `Runner.java`
- In the `then` part of another agent's rule
- In another agent's method
- On an event (see [Registering for events](#registering-for-events))

For example:
```java title="models/Runner.java"
import agents.Butler;
import com.mindsmiths.ruleEngine.runner.RuleEngineService;
import com.mindsmiths.ruleEngine.util.Agents;


public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        if (!Agents.exists("butler"))
            Agents.createAgent(new Butler("Albert", "012345678"));
    }
    ...
}
```

Here we create our butler on startup, if one doesn't already exist.

### Through the API
You can also create agents from other services and even external systems, by using the API.

For example, using the internal API could look something like this:
```python
RuleEngineAPI.create_agent("Butler", name="Albert", connections={"telegram": "012345678"})
```

For details on using the external API, see "Swagger HTTP API" (TODO).


## Registering for events
In order for your agent to be able to react to external events, we need to register on these events and forward them to the agent of our choice.

There are two ways to do this: in `signals.yaml` and `Runner.java`.

### In signals.yaml
You can find or create this file in `services/rule_engine/src/main/resources/config/signals.yaml`.

The structure of the file is as follows:
```yaml
<signal class>:
  - !<strategy name>
    <strategy param 1>
    <strategy param 2>
    ...
  ...
...
```

You can have as many signal types and strategies per signal as you want.

The strategy defines what to do when the event is received. For example:
```yaml title="services/rule_engine/resources/config/signals.yaml"
com.mindsmiths.telegramAdapter.TelegramReceivedMessage:
  - !GetOrCreateAgentByConnection
    connectionName: telegram
    connectionField: chatId
    agentType: agents.Butler
```
This strategy will try to find an agent with the connection `telegram:<chatId>`, and if it fails it will create a new
Butler agent with such a connection. In our case this would fail though, because Butler doesn't have a default constructor.

You can see all available strategies in the `com.mindsmiths.ruleEngine.mapping` package.


### In Runner.java
A more powerful alternative is registering signals in `models/Runner.java`. Here you can write custom Java code to execute when the event is received.

For example:
```java title="models/Runner.java"
import agents.Butler;
import com.mindsmiths.ruleEngine.runner.RuleEngineService;
import com.mindsmiths.ruleEngine.util.Agents;
import com.mindsmiths.telegramAdapter.TelegramReceivedMessage;

public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        configureSignals(
            Signals.on(TelegramReceivedMessage.class).sendTo((msg) -> Agents.getOrCreateByConnection("telegram", msg.getChatId(), new Butler("Albert", "012345678")),
            ...
        );
    }
    ...
}
```

Here we do basically the same as in the `signals.yaml`, but we have more control over it.

### Using events in rules
After registering an event and defining a strategy to handle it, it will be sent to one or more agents.
These agents will be re-evaluated as soon as that happens, and the event will be inserted to their "signals" entry point, where you can query it.

You can learn more about that in [Writing rules](./writing-rules).
