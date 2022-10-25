---
sidebar_position: 2
---

# Service communication
## 🚧 Under construction 🚧

Just like agents, our services also communicate through signals. This allows for a highly decoupled and performant
architecture and enables service-to-service as well as service-to-agent signal exchange.

Basic structure of every signal consists of 4 key fields:
```json
{
  "id": "<unique-signal-id>",
  "timestamp": "<when-the-signal-was-sent>",
  "signalType": "<signal-type",  // eg. "MESSAGE", "EVENT", "REPLY"
  "from": "<who-is-sending-the-signal>",
  ...  // other fields depending on the signal type
}
```
Let's take a closer look to that structure, starting with `id`, a unique `string` which represents a signal. 
Next one is `timestamp`, the `datetime` when a signal was created, alongside with`from` - sender's (either agent's or service's) ID. 
All mentioned fields are automatically generated and added for you. Also, all of them are meant to be subclassed, which allows adding additional fields at any time.

There is one more especially important field that we need to clarify (`signalType`), which concerns different types of signals that can be emitted. 
In total, there are 5 different signal types:
1. `Message`
2. `Event`
3. `Reply`
4. `ErrorReply`
5. `DataChangeEvent`

[Here](#messages) you can read what differentiates them.

Every signal, no matter the type, is serialized to JSON before being sent to the message broker, and deserialized on the receiving side. 
This process platform does automatically, so you don't have to worry about it.

Each service defines its own input topic on which it listens for messages. You can think of topics like queues with unique addresses.
To make communicating with them easier, most services define their own clients, which automatically build messages in the correct format and send them to the right topic (e.g. TelegramAdapterAPI).
On the other hand, agents share one input topic.

### Addresses
Every service and agent has an address on which it receives signals. Service's default address is its name, while all agents share one address (`agents`).
No matter what the type of signal is being sent or emitted, the address stays the same.

# Signal types

## Messages
Messages are signals that are used whenever there's a specific agent or a concrete service that you want to send message to. 

Examples of messages:
- agent sends an offer to user
- user sends a new metric input to agent 
- agent sends a reminder to user

It's important that every `Message` defines its `messageType`, which defaults to the name of the message class (e.g. Offer).
Besides the type field, there's another mandatory element - `to`, which specifies the recipient's ID. If an answer to current `Message` is expected,
then you should specify the `returnAddress` field - that's the address to which the reply should be sent. 

## Events
Apart from direct messages (going to a specific service/agent), there are also `Event` signals. 
We use them when an agent or a service wants to notify its surroundings that something occurred.
Events are used as broadcast signals, which means that there is no `to` field to specify.  
Instead, each `Event` type has its own "event topic", which anyone can listen to. 
This means other agents and services can subscribe to a specific event. 

Some examples of events:
- a new user is registered
- some threshold is reached
- an ML model was retrained

Events are great for decoupling services, which allows for more flexibility and extensibility.
You can learn how to create and subscribe to events [here](#creating-and-subscribing-to-events).

## Replies
`Reply` signals are special `Message` signals that represent responses to previously sent requests (messages).
In addition to all the fields a normal message would have, replies also have `replyTo` that should contain the message to which this response relates to.
This field defaults to the `Message` signal that's currently being processed.

An example of a reply would be:
1. We send a request to the GCalendar adapter asking it which events the user has tomorrow
2. GCalendar adapter queries the user's calendar
3. GCalendar adapter sends the reply with the result back to the sender:
   1. If the sender was a service, a callback function is called with the result 
   2. If the sender was an agent, the reply is inserted to the signals entry point

On the side note, if no address is specified when sending a `Reply`, then the `replyTo` field defaults to `replyTo.returnAddress`, which is also an optional field.
Therefore, it's also possible that `replyTo.returnAddress` is undefined, after which the address is generated from `replyTo.from`.

## ErrorReply
`ErrorReply` is a subtype of `Reply` signal which signalizes that the received `Message` couldn't be properly processed.

Besides all the fields that a regular `Reply`, this signal has an addition of a few others. First one is `code`, which is an `integer` number that represents the error group this error belongs to and is mandatory to fill.
Next one is `description` - a `string` field that provides information about how and where the error occurred, also mandatory to fill. 
Field `help` is an optional `string`, it's intended to provide an additional error description and a way to resolve this error.

## Data changes
`DataChangeEvent` is a special type of event that is sent when an "emmitable" data model is either created, updated or deleted.
Other agents/services can subscribe to the changes of a specific data object.

Field which indicates what type of change has occurred and is obligatory to define is `changeType` (which can be `CREATED`, `UPDATED`, `DELETED`). Another one is `objectType`,
the type of object that has changed. This field defaults to the data model class name (e.g. `User`) and is used in deserialization.
Also, field `object` represents the version of the newly created or recently updated object along with the last version of the object if it was deleted.

## Creating and subscribing to events
To emit an event to other services, first you need to define the event model. However, you need to be careful to define
it somewhere in the service `api/` directory, because other services only have access to that package.

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

To listen to events from other services, simply add a new function and decorate it with `@on_event(<EventCls>)`, for example:
```python
from another_service.api import UserRegistered

class NewService(BaseService):
    ...

    @on_event(UserRegistered)
    def on_user_registered(self, user_registered: UserRegistered) -> None:
        ...
```