---
sidebar_position: 3
---

# Integration
There are multiple ways to integrate with the platform. Let's discuss them in turn.


## HTTP API
You can use the _API Gateway_ service to expose HTTP endpoints from the platform to external systems.

It already offers endpoints for managing agents and sending signals out-of-the-box. You can extend it with additional
endpoints if the need arises.

You can find the full HTTP API specification [here](/api).


## Websockets
Since HTTP is basically a one-way communication channel, sometimes you may want to use websockets to allow the agents
and services from inside the platform to send signals to external systems proactively. This is, after all, one of the
main benefits of the platform. Websockets are also much more efficient for streaming real-time data. However, be careful
with how many connections you open, because websockets are *not* horizontally scalable.

You can use the _Websocket Adapter_ service to create a websocket server inside the platform, to which you can connect
to from anywhere. You can also use the Forge SDK to make the communication a little easier.

You can find the full specification for websockets [here](pathname:///asyncapi).


## Custom adapter
If you need a highly flexible or complex integration, you can always write a custom adapter service. You can then
connect with any method you need, do pooling or scheduling, or use a special security protocol.

You can learn more about [creating custom services here](./Platform%20architecture/service-creation).
