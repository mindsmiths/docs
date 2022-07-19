# TODO

## Quickstart
- [ ] Hello world in 1 minute

## Mindsmiths Platform
- [ ] Platform intro
  - [ ] What is it
  - [ ] When is it useful
  - [ ] When should it NOT be used
  - [ ] What are the common use cases
- [ ] Basic concepts
  - [ ] Agent
      - [ ] Autonomous in environment
      - [ ] Local view
  - [ ] Rule
  - [ ] Facts and Signals
  - [ ] Heartbeat
  - [ ] Service
  - [ ] Adapter
- [ ] Philosophy
  - [ ] Agents are always alive
      - [ ] Careful with infinite loops
  - [ ] Complex problems can be split into smaller agents
  - [ ] Agents are independent and optimize for their "customer" (user-centricity)
  - [ ] DNA + Learning
  - [ ] Declarative programming
  - [ ] Prototyping (fail fast)
- [ ] Coding environment
  - [ ] Usage basics
  - [ ] Connecting to git
  - [ ] Deployment
  - [ ] Support and reporting issues

## Tutorials
- [x] Tutorial 1 - Nola
- [ ] Tutorial 2 - Doctor/Patient
- ...

## Deep dive (technical documentation)
- [x] Project structure
  - [x] Project config
  - [ ] Secret management
- [ ] Platform architecture
  - [ ] Microservices
  - [ ] Core services
  - [ ] Contrib services
  - [ ] Service communication
  - [ ] Versioning
- [ ] Service creation
  - [ ] Structure
  - [ ] Data management, events
  - [ ] API, Java client
  - [ ] Logic
  - [ ] Listening to events
  - [ ] Settings
  - [ ] Service config
- [ ] Creating agents
  - [ ] Agent's model
  - [ ] Agent's behavior
    - [ ] Rule package
  - [ ] Instantiating agents
    - [ ] Manually, API
    - [ ] On signal (connections)
  - [ ] Registering for signals
    - [ ] signals.yaml
    - [ ] Runner
- [ ] Writing rules
  - [ ] Drools
  - [ ] Rule structure
  - [ ] Rule organization
  - [ ] Rule mechanics
  - [ ] When
    - [ ] Signals, events and facts
      - [ ] Defining new signals
    - [ ] Time-based conditions (proactivity, heartbeat)
  - [ ] Then
    - [ ] modify
    - [ ] sending signals to other agents
    - [ ] deleting signals
    - [ ] insert - persistence
  - [ ] Chaining
  - [ ] Configuration (settings)
  - [ ] Best practices
- [ ] Machine learning and other intelligent components
- [ ] Content management (Mitems)
- [ ] Integrations
  - [ ] HTTP
  - [ ] Websockets
  - [ ] Custom adapter
- [ ] Testing
- [ ] Infrastructure

## Reference
- [ ] HTTP API reference
- [ ] Websocket API reference
- [ ] Forge CLI reference
- [ ] Forge SDK reference
- [ ] Drools / Rule Engine reference
- [ ] Contrib services reference