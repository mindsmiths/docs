---
sidebar_position: 2
---

# Service communication
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
To make communicating with them easier, most services define their own clients, which automatically build messages in the correct format and send them to the right topic (e.g. `TelegramAdapterAPI`).

## Events
Apart from direct messages (going to a specific service/agent), there are also event signals. Each event type has its own "event" topic, which anyone can listen to.

Some examples of events:
- a new agent is created
- an account was deleted on SalesForce
- an ML model was retrained
- ...

Events are great for decoupling services, which allows for more flexibility and extensibility.
You can learn how to create and subscribe to events here: (TODO)

## Replies
Replies are special messages that represent responses to previously sent requests (messages).
In addition to all the fields a normal message would have, replies also have `replyTo` which should contain the message to which this response relates to.

An example would be:
1. We send a request to the GCalendar adapter asking it which events the user has tomorrow
2. GCalendar adapter queries the user's calendar
3. GCalendar adapter sends the reply with the result back to the sender:
   1. If the sender was a service, a callback function is called with the result 
   2. If the sender was an agent, the reply is inserted to the signals entry point

## Data changes (event-carried state transfer)
TODO

## Emitting and listening to events
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