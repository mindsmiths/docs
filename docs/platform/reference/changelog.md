---
sidebar_position: 1
---

# Changelog


## [1.5.4] - 2023-03-06

This release contains the following service versions:
- `forge-sdk==5.0.6` (Python)
- `forge-sdk==5.0.6` (Java)
- `forge-cli==5.0.7`
- `rule-engine==5.0.6`
- `heartbeat==5.0.4`
- `cecs==5.0.2`

Noteable changes **since 1.5.3**:

### Java SDK

### Fixed
- serializing `LocalTime` to MongoDB
- faking time
- empty `Store` prefix

### Changed
- replaced shutdown hooks with explicit `close()` calls

### Added
- `callbackData` field to all `Message` signals


### Python SDK

#### Fixed
- logger `replace` error when logging non-str objects

#### Changed
- replaced shutdown hooks with explicit `close()` calls

#### Added
- `callbackData` field to all `Message` signals


### Rule Engine

#### Fixed
- `IllegalStateException` when shutting down

#### Added
- `RuleEngineAPI.removePendingSignals` to remove pending signals from an agent


### CLI

#### Fixed
- `set-fake-now`, `reset-fake-now` and `delete-topics` commands can now be run in sandbox environments

#### Added
- `forge run` and `forge run-service` now check if there's a hanging service process and kill it before proceeding
- `forge kill` to kill all hanging processes
- `forge remove-pending-signals` to remove pending signals from an agent


### Heartbeat

#### Fixed
- service freeze on database failure
- graceful shutdown on interrupt signal

#### Changed
- heartbeats ignore fake time to provide consistent experience when testing


### Cecs

#### Fixed
- ignore markers in Java



## [1.5.3] - 2023-02-02

This release contains the following service versions:
- `forge-sdk==5.0.4` (Python)
- `forge-sdk==5.0.3` (Java)
- `forge-cli==5.0.4`
- `rule-engine==5.0.3`
- `heartbeat==5.0.1`
- `cecs==5.0.1`

Noteable changes **since 1.5.2**:

### CLI

#### Fixed
- build doesn't crash if there's an empty `clients/java/` folder
- logs are streamed live into `forge.log`
- `forge run` doesn't build excluded services

#### Changed
- config, dockerfiles and manifests are now rendered with the basic set of built-in values and filters (`project`, `env`, `os`, `json`, `read_file`, `file_hash`, `b64encode` and `b64decode`)

#### Added
- `forge run` got the `-ll/--log-level` option


### Rule Engine

#### Fixed
- `UnsupportedOperationException` when there were pending signals
- `IllegalStateException` when shutting down
- emitting agent data changes only when there were changes


### Python SDK

#### Fixed
- `Module` now works correctly during migration to `Environment`


### Java SDK

#### Changed
- updated `pulsar-client` dependency to `2.11.0`
- removed `netty` and `aircompressor` version overrides



## [1.5.2] - 2023-01-16

❗ _This release contains important fixes. Please update as soon as possible._

This release contains the following service versions:
- `forge-sdk==5.0.3` (Python)
- `forge-sdk==5.0.2` (Java)
- `forge-cli==5.0.2`
- `rule-engine==5.0.2`
- `heartbeat==5.0.1`
- `cecs==5.0.1`

Noteable changes **since 1.5.1**:

### Java SDK

#### Fixed
- reverted to using exact dependency versions since intervals caused build issues


### Python SDK

#### Fixed
- Pulsar consumer now properly processes all pending messages and closes gracefully
- Pulsar producers are now flushed before closing


### CLI

#### Fixed
- `consume-message` command
- commands that send messages or events no longer need to sleep in order for messages to be flushed

#### Added
- `produce-message` now has `--num-messages` option



## [1.5.1] - 2023-01-11

This release contains the following service versions:
- `forge-sdk==5.0.2` (Python)
- `forge-sdk==5.0.1` (Java)
- `forge-cli==5.0.1`
- `rule-engine==5.0.1`
- `heartbeat==5.0.1`
- `cecs==5.0.1`

Noteable changes **since 1.5.0**:

### CLI

#### Added
- `create-agent` command that makes it easier to create new agent types
- `new-agent`, `update-agent`, `delete-agent`, `send-heartbeat` commands that make it easier to manage agents
- `send-event`, `send-message` and `send-agent-message` commands for manual interaction with the platform
- `list` and `add-service` commands that use the central service registry (experimental)

#### Changed
- `create-project` now accepts project name as an argument
- `Secrets` utility for changing the `.env` file now handles comments correctly


### Heartbeat

#### Changed
- deprecated `HeartbeatDisabled` feature toggle (use `HeartbeatEnabled` instead)

#### Fixed
- warning log when the feature toggle was not set (now defaults to heartbeat enabled)


### Rule Engine

#### Added
- logs now include the agent ID during agent evaluation
- when running locally, all agents are now unlocked when the rule engine starts
- `Salience` enum to allow for more readable salience values

#### Changed
- most dependencies are now intervals instead of exact versions
- agent IDs have 16 characters by default (instead of 8)

#### Removed
- `CutelogLayout`


### Python SDK

#### Fixed
- callbacks are now also `async` functions

#### Added
- `datetime.time` (de)serialization support
- `time_to_str` and `str_to_time` utils

#### Changed
- deprecated `random_generator` (use `random_string`)
- deprecated `get_datetime`, `get_utc_datetime`, `get_utc_date`, `get_utc_datetime_str` and `get_utc_date_str`
  (use `now`, `today`, `now_str` and `today_str`)
- deprecated `MongoClientKeeper` (use `Mongo` instead)
- deprecated `Module` (use `Environment` instead)
- logs now escape the `\n` and `\r` characters


### Java SDK

#### Added
- (de)serialization support for Java 8 `java.time` types (including `LocalTime`) and `Optional` types
- `strToTime` and `timeToStr` utils

#### Fixed
- `RejectedExecutionException` when shutting down the service
- serializing only fields of a class and ignoring any additional `get*` methods

#### Changed
- most dependencies are now intervals instead of exact versions
- deprecated `Utils.randomGenerator` (use `Utils.randomString`)
- deprecated `getDatetime`, `getUtcDatetime`, `getUtcDate`, `getUtcDatetimeStr` and `getUtcDateStr`
  (use `now`, `today`, `nowStr` and `todayStr`)
- deprecated `MongoClientKeeper` (use `Mongo` instead)
- deprecated `Module` (use `Environment` instead)
- logs now escape the `\n` and `\r` characters



## [1.5.0] - 2022-12-21

This release contains the following service versions:
- `forge-sdk==5.0.0` (Python)
- `forge-sdk==5.0.0` (Java)
- `forge-cli==5.0.0`
- `rule-engine==5.0.0`
- `heartbeat==5.0.0`
- `cecs==5.0.0`

Noteable changes **since 1.5.0 beta**:

### CLI

#### Fixed
- loading env variables in JSON form

#### Added
- locking/unlocking all agents
- overriding any Kubernetes manifest file

#### Changed
- prebuilt Django services are started with `<service-name> runserver` instead of `<service-name>-admin runserver`


### Rule Engine

#### Fixed
- `getByConnection` and `getOrCreateByConnection` now return the correct agent instance instead of a generic `Agent`
- `ConncurrentModificationExeption` when clearing entry points

#### Added
- `GetAgentByConnection` for `signals.yaml`
- stopping agent evaluation with `Agents.stopEvaluation()`
- `unlockAllAgents` and `lockAllAgents` APIs

#### Changed
- deprecated `Agent.addConnection` (use `Agent.setConnection`)
- upgraded dependency `io.github.classgraph==4.8.151`

#### Removed
- `json-simple` dependency


### Python SDK

#### Fixed
- service API functions no longer get signal metadata (`id`, `timestamp`...) in `**kwargs`

#### Changed
- `LOGGING`, `REGISTRY_CONFIG`, `CONSUMER_CONFIG` and `PRODUCER_CONFIG` settings are now loaded as JSON to supported advanced configuration
- upgraded dependencies (`redis<4.5.0`, `fakeredis<3.0`)


### Java SDK

#### Added
- `getVariant` in `UnleashFeatureToggle`

#### Changed
- _requires self-hosted Sentry >=v21.9.0 (!)_
- updated dependencies


### Project template

#### Changed
- cleaned up project root
- using CI v5.x

#### Fixed
- `MONGO_CLIENT_CONNECTION_STRING` secret would throw an error if not set
- `rule-engine` depends on the `mongo` database


### Docs

#### Added
- technical documentation for CLI and Heartbeat

#### Fixed
- minor tutorial fixes



## [1.5.0 beta] - 2022-10-19

This release contains the following service versions:
- `forge-sdk==5.0.0b0` (Python)
- `forge-sdk==5.0.0b0` (Java)
- `forge-cli==5.0.0b0`
- `rule-engine==5.0.0b0`
- `heartbeat==5.0.0b0`
- `cecs==4.0.0a3`

These are the most important changes when compared to v1.4.
Aside from the ones mentioned, there were lots of bug fixes and improvements.

### Concepts

#### Changed
- _Communication_
  - Instead of `BaseMessage` that had `configuration` and `payload`, there are now 5 clearly defined signal types:
    - `Message` - when agent/service wants to send a message to a specific agent/service. Triggers functions annotated with `@api`
    - `Event` - when agent/service wants to notify its surroundings that something happened. Other agents/services can subscribe to a specific event
    - `Reply` - a subtype of `Message` that can only be sent as a response to a previous `Message` signal
    - `ErrorReply` - a subtype of `Reply` that signalizes that the received `Message` couldn't be properly processed
    - `DataChangeEvent` - a special type of event that is sent when an "emittable" data model is created, updated or deleted. Other agents/services can subscribe to the changes of a specific data object
  - All signals must contain the following fields:
    - `id` - a unique string representing this signal
    - `timestamp` - the datetime when this signal was created
    - `signalType` - one of: `MESSAGE`, `EVENT`, `REPLY`, `ERROR`, `DATA_CHANGE`
    - `from` - sender's ID (service/agent ID)
  - These signals are meant to be subclassed (additional fields can be added)
  - Signals are serialized into a flat JSON structure
  - `Message`
    - must define `messageType` which defaults to the name of the class (e.g. `RegisterUser`) - used in deserialization
    - must define `to` - the recipient's ID
    - can define `returnAddress` to which the reply should be sent
  - `Event`
    - must define `eventType` which must be unique in the whole system - defaults to the name of the class, used in deserialization
    - events no longer have a "service owner"
  - `Reply` (extends `Message`)
    - must define `replyTo` - the `Message` to which this is a response to, defaults to the message that's currently being processed
    - if no address is specified when sending, defaults to `replyTo.returnAddress`, and if that's not defined defaults to an address generated from `replyTo.from`
  - `ErrorReply` (extends `Reply`)
    - must define `code` and `description`
    - can define `help`
  - `DataChangeEvent`
    - must define `changeType` - one of: `CREATED`, `UPDATED`, `DELETED`
    - must define `objectType` - the type of object that has changed, defaults to the data model class name (e.g. `User`) - used in deserialization
    - must define `object` - the new version of the object if created or updated, the last version of the object if deleted

- _Data models_
  - there is no longer a concept of separate data "model" and "view" because it created unnecessary complexity
  - there is now only a single `DataModel` class which enabled the model to be saved to the database
  - if you want data object changes to be emitted automatically, inherit `EmittableDataModel` in Python, or set `@DataModel(emit = true)` in Java

#### Added
- _Addresses_
  - Every service and agent now has an address on which it receives signals
  - The service's default address is its name
  - All agents have the same address (`agents`)
  - The signal has `from` and `to` fields which define the specific recipient on that address (e.g. agent's ID)
  - `Message` signals can define a `returnAddress` where they expect a reply

- _Agent locking_
  - when an agent is being evaluated, it is "locked" so that no other Rule Engine instances can start the evaluation of that agent
  - this prevents concurrency problems and enables horizontal scaling of Rule Engine
  - **IMPORTANT**: if an exception is thrown when an agent is being evaluated, it will _stay locked_ and must manually be unlocked (either using CLI commands or the Rule Engine's API)

- _Concurrency_
  - All services (Python and Java) can now _concurrently_ process multiple requests, thereby increasing performance (sometimes significantly)
  - The level of concurrency is controlled with a `CONCURRENCY` setting (default: 1)


### API Gateway

#### Changed
- renamed from "Forge API"
- changed `/signal/{from}/{to}/{type}` to `/message/{to}` and `/message/{to}/{type}`
- changed `/event/{from}/{type}` to `/event` and `/event/{type}`


### CLI

#### Fixed
- `build` command would hang when build fails

#### Added
- `lock-agents` and `unlock-agents` commands


### Heartbeat

#### Changed
- moved to core services
- there are no longer two sub-services (`scheduler` and `sender`) - there is now only a single `heartbeat` service
- `SentHearbeat` view is now a `Heartbeat` event
- `Heartbeat` view is now an emmitable `HeartbeatModel` data model

#### Fixed
- handles deletion of agents correctly

#### Removed
- backoff strategy - can be implemented as a custom strategy


### Rule Engine

#### Changed
- `send_signal` API is now `evaluate_with_signals`
- `Evaluation` is now an event signal, use `timestamp` instead of `evaluatedAt`
- project MUST include `kmodule.xml`
- `Signals.on` is now either `Events.on` or `DataChanges.on`
- using `LocalDateTime` instead of `Date`
- when an event is received, the Rule Engine determines which agents should receive it, and sends a message to each of them, instead of evaluating them all immediately and blocking other messages
- the agent's "summary" structure now has `facts`, `pendingSignals` and `pendingUpdates`
- `getOrCreateByConnection` now automatically adds the connection when creating a new agent, so no need for the `(connectionName, connectionId)` constructor
- `getOrCreate` now automatically sets the specified ID when creating a new agent

#### Added
- working with data changes is easier
- `AgentAlreadyExists` exception if trying to create an agent with an already existing ID
- `GetOrCreateAgent` signal mapping strategy
- custom signal mapping strategies can be created and used in the `yaml` configuration
- locking agents when they're being evaluated
  - any updates are queued as pending and applied after the evaluation
  - if there are any queued signals, the agent's evaluation is queued again
- useful cron functions in `DateUtil`

#### Removed
- `agent-created` entry-point - use `signals`
- agents cannot send messages to specific entry points
- filters in subscriptions
- feature toggling - moved to SDK



### SDK

#### Changed
- see also [Concepts](#concepts)
- `Context` renamed to `ServiceContext`
- `CurrentContext` is now a thread-local `Context` which contains the signal that's currently being processed, and who's processing it (`sender`)
- `DBModel` is now `DataModel`
- there are now 3 functions to build topic names: `get_input_topic_name`, `get_event_topic_name`, and `get_data_change_topic_name`
- `forge.setup` now accepts `project_slug` as an optional parameter

#### Added
- posthog integration
- support for a custom MongoDB connection string
- `@on_change` function decorator to listen to data changes
- checks that an API is defined only once
- `utils.strings` - convert strings to camel/pascal/kebab/snake case

#### Removed
- `traceId` and `pipeline`
- `REGISTERED_VIEWS` setting - use `service.register_for_changes()`
- constants `PROCESS`, `CALLBACK`, `EXCEPTION`
- `DBView` - use data changes (`EmittableDataModel`)
- `EmitType` - use `DataChangeType`
- `build_configuration` and similar message building/parsing utils


### Python SDK

#### Changed
- API functions now must be `async`
- structure refactored (some imports may change)
- pydantic data-classes are now serialized by using the field's `alias`
- bumped dependencies (`pydantic<1.11`, `prometheus_client<0.16`)

#### Added
- some missing performance metrics on `Store` and `Cache`
- `Store.delete` and `Cache.delete`

#### Removed
- `forge.api.send_event` - just use `requests`
- `ServiceExtension`


### Java SDK

#### Added
- `Forge.setup`, `ServiceContext` and `Context` to mirror the Python SDK
- `ReflectionUtils`
- ability to set a custom `Jinjava` template renderer
- missing date-time and Base64 utilities to mirror Python SDK
- feature toggling utilities
- `DistributedCache` which equals to Python SDK's `Cache(distributed=True)`

#### Changed
- renamed `BaseSettings` to `ForgeSettings`
- renamed `DataUtils` to `Database` and added lots of useful functions
- `@DataModel` should now only be used on data models that are saved in the database (not on signals)
- `UnleashFeatureToggle` is now a singleton

#### Fixed
- methods whose name starts with `get` are no longer evaluated and serialized to MongoDB
- `MONGO_REPLICA_SET_NAME` setting name
