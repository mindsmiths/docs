---
sidebar_position: 5
---

# Platform architecture

## Microservices
Under the hood, the platform is a collection of microservices that work together to simulate the world of agents.

We chose the microservice architecture for the following reasons:
- high scalability (needed to handle large numbers of agents)
- high flexibility and extensibility
- highly decoupled
- high availability and robustness
- allows for easier prototyping/experimentation, maintenance and faster adoptions of new technologies
- allows for technological diversity
- supports a faster release cycle
- supports larger teams

We think this trade-off makes sense for us despite the cost of complexity, since our platform is meant to be used to solve very complex problems.

### Core services
There are two core services which every project needs - Rule Engine and Heartbeat.

#### Rule Engine
We use rules to implement the business logic. The rules form the "glue" that coordinates all other actions like doing
deeper analysis with algorithms or ML models, and performing concrete actions like sending messages and calling APIs.
Since we never want to block the decision-making process, all of these actions should be performed asynchronously in
other services. The results are then sent back asynchronously as well, which allows us to be performant and robust.

They also act as the final decision maker. For example, another service that uses a complex model to predict if
the user is likely to engage will provide us with this valuable signal, but in the end the rules will decide whether
to act on this or not. We may also have a model that learns what the best action to take is, and simply accept its
advice most of the time, but when we need to override it (which will happen sooner or later) we're able to do so.

The agents and their rules are defined in a service called the Rule engine.
It's responsible for managing and evaluating agents. We use the Drools framework to define and evaluate rules.

When it receives a signal, it performs these steps:
1. Find the agent(s) who should handle the signal - defined with a strategy in `signals.yaml` and/or `Runner.java`
2. Find the facts stored in the agent's memory
3. Insert the signal and facts in the session
4. Evaluate and trigger the agent's rules
5. Store the updated facts in the database

The signals that trigger these actions are defined in `signals.yaml` and/or `Runner.java`.

#### Heartbeat
We want our agents to be "alive" and constantly "think". This allows them to be proactive instead of waiting for someone
to "turn them on". 

However, with potentially millions of agents we need to make sure this process is efficient. Millions of `while true`
loops just won't cut it.

That's why we gave our agents a _heartbeat_. Apart from evaluating agents on each event, they are also evaluated periodically when they receive a heartbeat signal.

The Heartbeat service decides when to send a heartbeat for which agent. The default strategy is to send it every X seconds (where X is configurable).
Other strategies exist for more efficiency in special cases. You can also write a custom strategy if the need arises.


### Optional services
There are many other services which you can add to your project to extends its capabilities.
You can see a full list of official services here: (TODO). You can also find open-source contributions, or write your
own custom service.

Here are some examples of other services.

#### Adapters
Adapters are services used to integrate with external systems.
Examples of adapters are:
- Email Adapter - used to send and receive emails
- Telegram Adapter - used to send and receive messages over the Telegram messenger
- GCalendar Adapter - used to integrate with Google Calendar (inserting/querying events)
- GSheets Adapter - used to integrate with Google Sheets
- SalesForce Adapter - used to integrate with SalesForce
- etc.

Their APIs are completely custom, depending on their functionality. In addition to sending requests to the corresponding
external system, they may also notify the agents of any changes that may happen (eg. user sent a message, a calendar
event was moved, the user's address changed in the CRM). This allows us to create an efficient event-driven architecture.

#### API Gateway
If you just want to expose a simple HTTP API you can use our prebuilt API Gateway. It already includes endpoints for
sending messages to agents, emitting events, creating and deleting agents, etc.

#### Intent Recognizer
Intent recognizer provides an easy way to augment data about user's activities (eg. a message he/she sent us) with an intent - what he/she actually wanted to do.
An example would be: "turn off the lights please" -> lights_off.

You define the intents you're interested in by writing/extending a _recognizer_. There are multiple types of recognizers - from simple keyword recognizers, to complex NLP models.
See (TODO) for more information.

There is a single API on which it receives the activity and any relevant context, and returns the intent and entities associated with it.

#### AutoML
Not everything can be modeled with rules. Sometimes you need more powerful models that can learn from data.
You can always build a custom neural network and wrap it in a service, but in most cases our AutoML can automatically
find and train the best model for your data.

#### Custom service
If you didn't find a service that fits your needs, you can always write your own. It's actually very simple!
Our SDK will handle most of the boring stuff for you. You can find out how to do it here: (TODO).


## Service communication
Just like agents, our services also communicate through signals. This allows for a highly decoupled and performant
architecture.

All signals have this basic structure:
```json
{
  "id": "<unique-signal-id>",
  "timestamp": "<when-the-signal-was-sent>",
  "signalType": "<signal-type",  // eg. "MESSAGE", "EVENT", "REPLY"
  "from": "<who-is-sending-the-signal>",
  ...  // other fields depending on the signal type
}
```

Most of these fields are automatically generated and added for you.
These signals are serialized to JSON before being sent to the message broker, and deserialized on the receiving side, automatically by the platform.

Every service (and agent) defines its own _input topic_ on which it listens for messages. You can think of topics like queues with unique addresses.
To make it easier to communicate with them, most services define their own clients, which automatically build messages in the correct format and send them to the right topic (eg. `TelegramAdapterAPI`).

### Events
Apart from direct messages (going to a specific service/agent), there are also event signals. Each event type has its own "event" topic, which anyone can listen to.

Some examples of events:
- a new agent is created
- an account was deleted on SalesForce
- an ML model was retrained
- ...

Events are great for decoupling services, which allows for more flexibility and extensibility.
You can learn how to create and subscribe to events here: (TODO)

### Replies
Replies are special messages that represent responses to previously sent requests (messages).
In addition to all the fields a normal message would have, replies also have `replyTo` which should contain the message to which this response relates to.

An example would be:
1. We send a request to the GCalendar adapter asking it which events the user has tomorrow
2. GCalendar adapter queries the user's calendar
3. GCalendar adapter sends the reply with the result back to the sender
4. 
   1. If the sender was a service, a callback function is called with the result 
   2. If the sender was an agent, the reply is inserted to the signals entry point

### Data changes (event-carried state transfer)
TODO


## Versioning
Every service in the platform has its own version. Consult each service's documentation to see with which platform version it's compatible with.
All versions should follow the semantic versioning paradigm.

When specifying the requirements in your project, the recommended way is to specify explicit versions, for example `==1.5.2`.
You could also specify it like `~=1.5.2` (which is equal to `>=1.5.2,<1.6`), or `==1.5.*`, but you're taking a risk there.

If you encounter a bug when upgrading to a compatible version, please let us know.

### Pre-releases
We release alpha and beta versions before every new major release, eg. 4.0.0a0 (this means 4.0.0 doesn't exist yet).
Keep in mind that these are experimental releases, and _we guarantee no backwards-compatibility between such versions_.


## Integration
There are multiple ways to integrate with the platform. Let's discuss them in turn.

### HTTP API
You can use the _API Gateway_ service to expose HTTP endpoints from the platform to the external systems.

It already offers endpoints for managing agents and sending signals out-of-the-box. You can extend it with additional
endpoints if the need arises.

### Websockets
Since HTTP is basically a one-way communication channel, sometimes you may want to use websockets to allow the agents
and services from inside the platform to send signals to external systems proactively. This is, after all, one of the
main benefits of the platform. Websockets are also much more efficient for streaming real-time data. However, be careful
with how many connections you open, because websockets are *not* horizontally scalable.

You can use the _Websocket Adapter_ service to create a websocket server inside the platform, to which you can connect
to from anywhere. You can also use the Forge SDK to make the communication a little easier.

### Custom adapter
If you need a highly flexible or complex integration, you can always write a custom adapter service. You can then
connect with any method you need, do pooling or scheduling, or use a special security protocol.

To learn more about creating custom services, see "Creating a custom service" (TODO).





## Service creation
TODO
(https://git.mindsmiths.com/mindsmiths/platform/-/wikis/Using-the-Platform/Creating-a-new-service)
(https://github.com/mindsmiths/platform-resources/blob/main/create_service_templates/creating_new_service.md)
(https://github.com/mindsmiths/platform-resources/tree/main/create_service_templates/python)

### Saving and querying data
TODO
Data models, Java and Python...

### Building an API
TODO




## Writing rules
TODO (https://git.mindsmiths.com/mindsmiths/platform/-/wikis/Using-the-Platform/Writing-rules)
