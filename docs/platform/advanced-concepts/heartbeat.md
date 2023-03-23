_---
sidebar_position: 7
---_

# Heartbeat
The heartbeat service sends a regular heartbeat signal to each and every agent. It wakes up the agent and re-evaluates its rules.

This enables the agents to have time-based rules and act proactively. For example, if a user had a technical issue 2 days ago and no follow-up was made,
the agent can ask the user if everything is okay now.


## How it works
Each agent has its own heartbeat signal, and can be scheduled independently.
By default, the `Uniform` heartbeat strategy is used, which schedules heartbeats at a regular interval.
The interval can be configured with the `HEARTBEAT_CYCLE` environment variable (see `config.yaml`). The default value is 30 seconds.

The Heartbeat service works by periodically querying the database of schedules and sending the signals whose next execution time has passed.
It does this every `HEARTBEAT_PRECISION_MS` milliseconds (default: 1000), which means that the actual heartbeat time may
lag for up to 1 second during normal operational load, which is acceptable for most use cases.


## Strategies

### Uniform
This is currently the only available strategy, which schedules heartbeats at a regular interval.

### Custom strategies
You can implement custom strategies by extending the `HeartbeatStrategy` class.

For example, to increase the heartbeat frequency only for the `Smith` agent, put the following in `services/heartbeat/smith_strategy.py`:
```python
from datetime import datetime, timedelta

from forge.utils.datetime import now
from heartbeat import settings
from heartbeat.base import HeartbeatStrategy
from rule_engine.api import Evaluation


class SmithStrategy(HeartbeatStrategy):

    def get_next_heartbeat(self, evaluation: Evaluation) -> datetime:
        if evaluation.agentId == 'Smith':
            return now() + timedelta(seconds=5)
        return now() + timedelta(seconds=settings.HEARTBEAT_CYCLE)
``` 
Don't forget to set `HEARTBEAT_STRATEGY` to `SmithStrategy` in `config.yaml`.

There is also an abstract strategy `Priority` which you can extend to implement a priority-based strategy.
An agent with priority `1` is evaluated every `HEARTBEAT_CYCLE` seconds, an agent with priority `2` is evaluated twice as much, etc.
Priorities smaller than `1` are allowed, as long as they're greater than zero.


## Checks and alerts
Before sending the heartbeat signal, the service checks if the signal is lagging for more than `HEARTBEAT_PRECISION_MS` milliseconds.

If it is, it will log a warning. If it's lagging for more than 2 times the `HEARTBEAT_PRECISION_MS` time, it will log an error and send an alert.
You can control the maximum number of alerts with the `HEARTBEAT_LAG_ERR_MAX_EVERY_SECS` environment variable.
Keep in mind that if the service restarts, the counter is reset, and it may send an alert immediately.


## API

### Calls
There are currently no calls you can make to the Heartbeat service.

### Events

#### Heartbeat
```python
class Heartbeat(Event):
    agentId: str
```
The `Heartbeat` event is emitted when a heartbeat signal for an agent is sent.

#### HeartbeatModel
```python
class HeartbeatModel(EmittableDataModel):
    agentId: str
    nextHeartbeatAt: datetime
```
The `HeartbeatModel` data change is emitted when a new heartbeat signal is scheduled for an agent.


## Settings
- `HEARTBEAT_STRATEGY` - The strategy to use for scheduling heartbeats. The default is `Uniform`.
- `HEARTBEAT_PRECISION_MS` - How often the service queries the scheduled heartbeats. The default is `1000` milliseconds.
- `HEARTBEAT_MAX_USERS_PER_LOOP` - The maximum number of users to process in a single loop. Can be used to limit burst loads to the system. This may increase the maximum heartbeat time lag above the `HEARTBEAT_PRECISION_MS` time. The default is `0` (no limit).
- `HEARTBEAT_LAG_ERR_MAX_EVERY_SECS` - The minimum time between lag alerts (see [Checks and alerts](#checks-and-alerts)). The default is `3600` seconds (1 hour).
- `HEARTBEAT_CYCLE` - If using the `Uniform` strategy, the interval between heartbeats. The default is `30` seconds.

There is also a feature toggle `HeartbeatEnabled` which you can use to control heartbeats for all (or specific) agents.


## Changelog

### [5.0.4] - 2023-03-02

#### Changed
- heartbeats ignore fake time to provide consistent experience when testing


### [5.0.3] - 2023-02-24

#### Fixed
- service freeze on database failure


### [5.0.2] - 2023-02-23

#### Fixed
- graceful shutdown on interrupt signal


### [5.0.1] - 2023-01-05

#### Changed
- deprecated `HeartbeatDisabled` feature toggle (use `HeartbeatEnabled` instead)

#### Fixed
- warning log when the feature toggle was not set (now defaults to heartbeat enabled)


### [5.0.0] - 2022-12-09

#### Added
- documentation

#### Changed
- the default `HEARTBEAT_CYCLE` is now `30`
- compatible with SDK 5.0


### [5.0.0b0] - 2022-10-19

#### Changed
- compatible with SDK 5.0 beta


### [5.0.0a2] - 2022-10-13

#### Added
- database index for `nextHeartbeatAt`


### [5.0.0a1] - 2022-10-12

#### Fixed
- deleting heartbeat when agent deleted


### [5.0.0a0] - 2022-10-12

#### Changed
- compatible with 5.0


### [4.0.0a1] - 2022-02-04

#### Changed
- compatible with 4.0


### [3.0.0a7] - 2021-12-06

#### Changed
- improved `add-to-project`


### [3.0.0a6] - 2021-11-04

#### Changed
- `listen.view` to `on_event`


### [3.0.0a4] - 2021-10-13

#### Added
- reimplemented user deletion support


### [3.0.0a2] - 2021-09-24

#### Changed
- heartbeat works without project folder


### [2.0.2] - 2021-09-15

#### Fixed
- handling user deleted event


### [2.0.1] - 2021-04-16

#### Changed
- platform dependencies are now `~=2.0`


### [2.0.0] - 2021-04-08

#### Added
- feature toggle to disable heartbeats
- strategies for customizing how heartbeats are sent
- model-view strategy from platform 2.0

#### Changed
- heartbeat now has two parts - scheduler and sender
- uses `vingdmind~=2.0`, `gatekeeper-api~=2.0` and `user-summary-handler-api~=2.0`
- 'add_to_project' upgraded

#### Fixed
- crash in production
- delayed heartbeat error log spam


### [1.5.3] - 2020-10-26

#### Fixed
- crash when processing time would be higher than sleep time
- `add_to_project` now references the correct template


### [1.5.2] - 2020-09-01

#### Added
- HEARTBEAT_SENT emit


### [1.5.1] - 2020-08-12

#### Added
- add_to_project command


### [1.5.0] - 2020-06-18

#### Added
- service name constant in root package

#### Changed
- every user is sent in his own message with his own `traceId`
- all summaries are sent (including locked ones)
- uses `gatekeeper` api
- service has all it's own settings defined and reads them from env


### [1.4.0] - 2020-04-20

#### Changed
- summaries are now sent in uniformly distributed batches


### [1.2.1] - 2020-03-16

#### Changed
- using `vingdmind` version `1.2.*`
- using `activity-handler` api version `1.2.*`


### [1.2.0] - 2020-02-28

#### Changed
- using `vingdmind` version `1.1.1`
- using `activity-handler` api version `1.1.1`


### [1.1.0] - 2020-02-11

#### Added
- API is now a package
- implemented an API builder for easier request creation

#### Changed
- using `vingdmind` version `1.1.0`


### [1.0.5] - 2020-01-30

#### Added
- Changelog file is added

#### Changed
- Logs are updated to abide to following convention:
  - `ERROR`: We need to know it happened
  - `WARN`: Recoverable, unexpected things
  - `INFO`: Things we want to know when testing locally
  - `DEBUG`: Everything that may be helpful when tracing what happened
- `vingdmind` is running version `1.0.15`
