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


## Service creation
Sometimes you simply need more flexibility, so you want to create a custom service to extract a piece of functionality or logic.
Whether it's an adapter, a complex algorithm or model, or a dashboard, you can easily create such a service.

To create a new service simply run `forge create-service` in a terminal. You will be prompted to choose which type of service you want to create.
You can see the [full list of available templates here](https://github.com/mindsmiths/platform-resources/tree/main/create_service_templates).
Make sure you match the exact name of the directory.
```shell
root:/app$ forge create-service
Which type of service would you like to create (eg. python, django)? ... [default: python]:
```
Read the template's documentation to fill in the prompts that follow correctly.
For example, if you're creating a Python service, you need to set the name for the new service. The name should be capitalized, with words separated by spaces (e.g. `New Service`).
The rest of the naming formats will be automatically generated based on the initial name you choose, so you can just press enter:
```shell
service_name: New Service
service_name_camel_case [NewService]: 
service_identifier [new_service]: 
service_artifact_name [new-service]:
New Service was successfully incorporated into your project!
```

That's it! The added service will now appear in your directory tree (`services` folder), and will be automatically added at the bottom of your `config/config.yaml`, for example:
```yaml
...
  new-service:
    type: python
    db:
      mongo: true
    resources:
      cpu: 100m
      memory: 100Mi
```

You can learn more about the config file in "Project Config" (TODO).
Don't forget to run `forge install` to install any new dependencies, and you're ready to start coding!

### Service structure
The service's structure depends on the template you used. Here we'll focus on a simple Python service.

The basic structure looks like this:
- {service_identifier}/
  - api/ - contains the public API that can be used by other services (incl. models and a client)
    - api.py - data models used in the API
    - api_builder.py - a Python client that other services use to communicate with this service
  - clients/java/ - a Java client that other services use to communicate with this service
  - tests/ - service unit-tests
  - {service_identifier}.py - the service's logic

You're free to add new files and packages, but the basic structure should remain the same.

### Writing the logic
You can write the service's logic in `services/<new_service>/<new_service>.py`.

You'll see an example function that receives some data, and returns a result. This function is already exposed through an API.
Feel free to change this example and add new functions.

If you don't want to expose any functions, but want some code to be run in a loop instead, just override the `start` function:
```python
class NewService(BaseService):
    def start(self) -> None:
        while True:
            """ TODO: WRITE YOUR MAGIC HERE """
            sleep(5)
```

If you want both, just add `self.start_async_message_consumer()` before the loop in the `start` method, to enable the service to listen to requests in a separate thread.

### Defining an API
To allow other services to communicate with our new service, we'll create a client for them. The `create-service` command already generated some examples for us.

The platform will do most of the work for us, so all we need to do is define the prototypes of the exposed functions in `services/<new_service>/api/api_builder.py`.
Keep in mind that if you're using additional data models in the calls or in the return (eg. `Result` in the example), they *must* be defined somewhere in the `services/<new_service>/api/` package, because this is the only package other services can access.
This also means you *cannot* import any files outside this package in any file defined inside it.

Notice that there is no `self` argument, and that we specify the expected result as _Future[dataType]_ in `api_builder.py`.
This reminds us that the service doesn't wait for the result before continuing. All service communication in the platform is *asynchronous*.

### Java client
The code for handling communication with Java-based services (e.g. Rule Engine) is in the directories under the `services/<new_service>/clients/java` path. 
The generated files also contain template code for API calls. Just mirror what you defined in the Python API, but in Java.

Note that if you want the new service to communicate with the Rule Engine, you should add it as a dependency to its `pom.xml` (in `services/rule_engine/pom.xml`):
```xml
<dependencies>
    ...
		<dependency>
			<groupId>com.mindsmiths</groupId>
			<artifactId>new-service-client</artifactId>
			<version>4.0.0a0</version>
		</dependency>
    ...
</dependencies>
```

You need to run `forge install` from the terminal to finish connecting the services after adding the dependency.

### Saving and querying data
If you want to save some data in a database, you need to define a model for this data.
We use dataclasses (specifically the Pydantic framework) to define these models.

For example, you could define a simple Model like this:
```python
class User(DBModel):
    id: str
    name: str
    isRegistered: bool = False
    numTimesLoggedIn: int = 0
```
When using the model, the values of fields will be validated according to the specified type-hints, so they are required.
Fields can have defaults if not specified (like `isRegistered` and `numTimesLoggedIn`).
For more information about possible field types, see [Field Types](https://pydantic-docs.helpmanual.io/usage/types/).

Keep in mind that every model needs to have a single primary key field, that needs to be unique. By default, this field
is `id`, and if no such field exists, and you didn't override the `get_primary_field` function, an exception will be thrown.

You can create a new user in the database like this:
```python
User(id='user1', name='Mind Smith', numTimesLoggedIn=1).create()
```

To fetch a single user you can use `get`:
```python
User.get(id='user1')
```

To query multiple users use `filter`:
```python
User.filter(numTimesLoggedIn=0)
```
This will return an iterator. You can wrap it in `list()` to fetch them all at once.

There are also useful methods like `count`, `distinct`, `all`, `exists`, and others.

To update an object, you have two options:
```python
user = User.get(id='user1')

# Option 1
user.update(numTimesLoggedIn=2)

# Option 2
user.numTimesLoggedIn = 2
user.save()
```
Depending on the complexity of the update, one or the other may be preferred.

Finally, to delete an object, just use `delete`:
```python
user.delete()              # if you have an instance
```

### Emitting events
To emit an event to other services, first you need to define the event model. However, you need to be careful to define
it somewhere in the `api/` folder, because other services only have access to that package.

For example:
```python
class UserRegistered(Event):
    userId: str
    registeredAt: datetime
    user: User
```

To emit the event, just do:
```python
UserRegistered(userId=userId, registeredAt=get_utc_datetime(), user=user).emit()
```

### Listening to events
To listen to events from other services, simply add a new function and decorate it with `@on_event(<EventCls>)`, for example:
```python
from another_service.api import UserRegistered

class NewService(BaseService):
    ...

    @on_event(UserRegistered)
    def on_user_registered(self, user_registered: UserRegistered) -> None:
        ...
```

### Service configuration
If you'd like to be able to configure parts of the logic, a good practice is to use settings. Settings are also great for secret values like passwords and authentication tokens.

Settings are regular Python variables, but their values are loaded from environment variables.
To define one, first create `services/<new_service>/settings.py` and add the following code:
```python
from environs import Env
env = Env()
```
Now you can add settings below, here are some examples:
```python
DEFAULT_TIMEZONE = env.str('DEFAULT_TIMEZONE', 'Europe/Zagreb')
HTTP_PORT = env.int('HTTP_PORT', 8080)
AUTH_TOKEN = env.str('AUTH_TOKEN')
USE_WEBHOOK = env.bool('USE_WEBHOOK', True)
```
To override the service defaults, or provide values for settings with no defaults, go to `config/config.yaml` and add something like this to for your service:
```yaml
  new-service:
    ...
    env:
      MY_SERVICE_PORT: 8081
      AUTH_TOKEN: "{{env.NEW_SERVICE_AUTH_TOKEN}}"  # this will read the system's environment (and the '.env' file if running locally), and fill it here - good for secrets
    ...     
```
