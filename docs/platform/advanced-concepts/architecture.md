---
sidebar_position: 1
---

# Architecture
Under the hood, the platform is a collection of **microservices** that work together to simulate the world of agents.

We chose the microservice architecture for the following reasons:
- highly scalable (needed to handle large numbers of agents)
- highly flexible and extendable
- highly decoupled
- highly available and robust
- allows for easier prototyping/experimentation, maintenance and faster adoptions of new technologies
- allows for technological diversity
- supports a faster release cycle
- supports cooperation of larger teams

We think this trade-off makes sense for us despite the cost of increasing complexity, since our platform is meant for solving very complex problems.

## Core services
There are two core services that every project needs - Rule Engine and Heartbeat.

### Rule Engine
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

### Heartbeat
We want our agents to be "alive" and constantly "think". This allows them to be proactive instead of waiting for someone
to "turn them on". 

However, with potentially millions of agents we need to make sure this process is efficient. Millions of `while true`
loops just won't cut it.

That's why we gave our agents a _heartbeat_. Apart from evaluating agents on each event, they are also evaluated periodically when they receive a heartbeat signal.

The Heartbeat service decides when to send a heartbeat for which agent. The default strategy is to send it every X seconds (where X is configurable).
Other strategies exist for more efficiency in special cases. You can also write a custom strategy if the need arises.


## Additional services
There are many other services which you can add to your project to extends its capabilities.
You can see a full list of official services here: (TODO). You can also find open-source contributions, or write your
own custom service.

Here are some examples of other services.

### Adapters
Adapters are services used to integrate with external systems.
Examples of adapters are:
- **Email Adapter** - used to send and receive emails
- **Telegram Adapter** - used to send and receive messages over the Telegram messenger
- **GCalendar Adapter** - used to integrate with Google Calendar (inserting/querying events)
- **GDrive Adapter** - used to integrate with Google Drive
- **SalesForce Adapter** - used to integrate with SalesForce
- etc.

Their APIs are completely custom, depending on their functionality. In addition to sending requests to the corresponding
external system, they may also notify the agents of any changes that occur (e.g. user sent a message, a calendar
event was moved, the user's address changed in the CRM). This allows us to create an efficient event-driven architecture.

### API Gateway
If you just want to expose a simple HTTP API you can use our prebuilt API Gateway. It already includes endpoints for
sending messages to agents, emitting events, creating and deleting agents, etc.

### Intent Recognizer
Intent recognizer provides an easy way to augment data about user's activities (e.g. a message he/she sent us) with an intent - what he/she actually wanted to do.
An example would be: "turn off the lights please" -> lights_off.

You define the intents you're interested in by writing/extending a _recognizer_. There are multiple types of recognizers - from simple keyword recognizers, to complex NLP models.
See (TODO) for more information.

There is a single API on which it receives the activity and any relevant context, and returns the intent and entities associated with it.

### AutoML
Not everything can be modeled with rules. Sometimes you need more powerful models that can learn from data.
You can always build a custom neural network and wrap it in a service, but in most cases our AutoML can automatically
find and train the best model for your data.

### Custom service
If you didn't find a service that fits your needs, you can always write your own. It's actually very simple!
Our SDK will handle most of the boring stuff for you. You can find out how to [create a custom service here](./service-creation).