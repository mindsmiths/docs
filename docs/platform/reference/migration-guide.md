---
sidebar_position: 3
---

# Migration guide


## [1.5] - 2022-10-19

### API Gateway
- rename usages of "Forge API" to "API Gateway"
- change usage of the path `/signal/{from}/{to}/{type}` to either `/message/{to}` or `/message/{to}/{type}`
- change usage of the path `/event/{from}/{type}` to either `/event` or `/event/{type}`

### Heartbeat
- remove the config for `heartbeat-sender` and rename `heartbeat-scheduler` to `heartbeat`

### Rule Engine
- add `resources/META-INF/kmodule.xml`
- replace `extends Signal` with either `extends Message` or `extends Event`, and remove `@DataModel`
- data models should implement `Serializable` and be annotated with `@DataModel`
- replace `addListener` with `registerForChanges`
- replace `Signals.on` with either `Events.on` or `DataChanges.on`
- you can remove the `(connectionName, connectionId)` constructor in your agents if you're using `getOrCreateByConnection` and just call the empty constructor
- replace `agent-created` with `signals`
- use `LocalDateTime` instead of `Date`
- replace `DataUtils` with `Database`

### Custom services
- in the `api_builder` rename `service_name` to `service_id`
- replace `DBModel` with `[Emittable]DataModel`, remove `DBView`s
- add `async` to API methods
- if you're using any global or service-level variables, make sure they are asyncio-safe
- replace `forge.core.api.BaseAPI` with `from forge.core.api.base import BaseAPI`
- replace `forge.core.api.api_interface` with `forge.core.api.decorators.api_interface`
- replace `forge.utils.datetime_helpers` with `forge.utils.datetime`

### Django services
- you may need to use `await sync_to_async(lambda: YourModel(...).save())()` or `await sync_to_async(_my_inline_function)()` - Django is still working on full async support in their ORM

### Java clients
- replace "Payload" classes with classes that extend `Message`
- replace `...BaseMessage(type, new ...Payload(...)).send()` with `new [ApiMessage](....).send(serviceId)`
- replace `topic = Messaging.getInputTopicName("{service}")` with `serviceId = "{service}"`

### Database
- in `ruleEngineDB.summary` move all facts from document root to `facts.{...}`

### If something is still not working
- try shouting "Livac!"
