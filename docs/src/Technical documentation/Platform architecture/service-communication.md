---
sidebar_position: 2
---

# Service communication

Just like agents, our services also communicate through signals. This allows for a highly decoupled and performant
architecture and enables service-to-service as well as service-to-agent signal exchange.

Basic structure of every signal consists of 4 key fields:
```json
{
  "id": "<unique-signal-id>",
  "timestamp": "<when-the-signal-was-sent>",
  "signalType": "<signal-type>",  // eg. "MESSAGE", "EVENT", "REPLY"
  "from": "<who-is-sending-the-signal>",
  ...  // other fields depending on the signal type
}
```
All these fields are generated and filled in automatically for you, and all are meant to be subclassed, allowing you to add additional fields at any time.

Let's just clarify the last two fields a bit: the `from` field contains the id of the entity sending the signal, so either service or agent id.
The `signalType` field is especially interesting to look at: here we specify which type of signal we're sending.


In total, there are 5 different signal types:
1. `Message`
2. `Event`
3. `Reply`
4. `ErrorReply`
5. `DataChangeEvent`

[Here](#messages) you can read what differentiates them.

Every signal, no matter the type, is serialized to JSON before being sent to the message broker, and deserialized on the receiving side. 
Of course, the platform does this process automatically, so you don't have to worry about it.

### Input topics and addresses

Each service defines its own _input topic_ on which it listens for messages. You can think of topics like queues with unique addresses.

To make the communication easier, most services define their own clients, which automatically build messages in the correct format and send them to the right topic (e.g. `TelegramAdapterAPI`). All agents share a common input topic.

Every service and agent has an address on which it receives signals. Service's default address is its name, while all agents share one address (`agents`).
No matter what the type of signal is being sent or emitted, the address stays the same.

# Signal types

## Messages
Messages are signals that are used when there's a specific agent or service that you want to send the signal to. 

Examples of messages:
- agent sends an offer to user
- user sends a new metric input to agent 
- agent sends a piece of information to another agent

Compared to the `Signal` class, the `Message` has a couple extra fields: you should especially note the obligatory `to` field, which specifies the recipient's id. The remaining two fields are `messageType`, which defaults to the name of the message class (e.g. `Offer`), and the optional `returnAddress`, which specifies the address to which the reply should be sent if it's expected for that `Message`.

## Events
Apart from direct messages (going to a specific service/agent), there are also `Event` signals. 
We use them when an agent or a service wants to notify its surroundings that something has occurred.
Events are used as broadcast signals, which means that there is no `to` field to specify.  
Instead, each `Event` type has its own _event topic_, which anyone can listen to. 
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
3. GCalendar adapter sends the reply with the result back to the sender

Note that if no address is specified when sending a `Reply`, the `replyTo` field defaults to `replyTo.returnAddress`, which is also an optional field. In case `replyTo.returnAddress` is undefined, the address is generated from `replyTo.from`.

## ErrorReply
`ErrorReply` is a subtype of the `Reply` signal which signalizes that the received `Message` couldn't be properly processed.

This signal has some additional fields compared to a `Reply`: `code`, `description` and `help`. The `code` is an `integer` number that represents the error group this error belongs to and is obligatory to fill. The `description` is a `string` field that provides information about how and where the error occurred, and is also mandatory to fill. The field `help` is an optional `string` that provides additional info on the error, and a way to fix it.

## Data changes
`DataChangeEvent` is a special type of event that is sent when an "emmitable" data model is either created, updated or deleted.
Other agents and services can keep their own copy of a database and subscribe to the changes of a specific data object, so they can update the data when needed.

There are several fields on the `DataChangeEvent` we need to note. The field which indicates what type of change has occurred and is obligatory to define is `changeType` (which can be `CREATED`, `UPDATED`, `DELETED`). 
Another one is `objectType`, the type of object that has changed. This field defaults to the data model class name (e.g. `User`). For the deserialization to happen correctly, it's important to keep the naming consistent and formatted correctly.
Also, the field `object` represents the version of the newly created or recently updated object along with the last version of the object if it was deleted.

## Creating and subscribing to events
To emit an event to other services, you first need to define the event model. However, you need to be careful to define
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