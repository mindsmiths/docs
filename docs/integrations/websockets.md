---
sidebar_position: 8
---

# Websockets
Since HTTP is basically a one-way communication channel, sometimes you may want to use websockets to allow the agents
and services from inside the platform to send signals to external systems proactively. This is, after all, one of the
main benefits of the platform. Websockets are also much more efficient for streaming real-time data. However, be careful
with how many connections you open, because websockets are *not* horizontally scalable.

You can use the _Websocket Adapter_ service to create a websocket server inside the platform, to which you can connect
to from anywhere. You can also use the Forge SDK to make the communication a little easier.

You can find the full specification for websockets [here](pathname:///asyncapi).