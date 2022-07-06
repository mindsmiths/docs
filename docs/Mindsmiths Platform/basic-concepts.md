---
sidebar_position: 5
---

# Mindsmiths Platform: Basic Concepts

- agents
- signals
- knowledge base and memory
- environment
- heartbeat
- multi-agent systems

### Intro

- Mindsmiths Platform is a platform for developing intelligent digital agents.
- This is a platform for running multi-agent simulations, we'll explain each of these things in turn
- You start up the platform by writing `forge run`. The simulation keeps running for as long as the run is active. 
- This means the system is constantly crunching and processing data.
- In the most basic form, the development on the platform revolves around two key types of entities: agents and signals.
- The platform is the environment in which these agents live, act and interact with each other and the environment itself. Interactions among the platform's different components happens via signals. 
- The platform consists of many different components, but they are all glued together through the Rule Engine - an expert knowledge service.

### Multi-agent systems

- On the Mindsmiths Platform, any entities that are capable of interacting with each other or the environment are referred to as **agents**.
- (wiki: an intelligent agent is anything which perceives its environment, takes actions autonomously in order to achieve goals, and may improve its performance with learning or may use knowledge.
- Defining a multitude of agents allows you to break down complex issues into more easily solvable and maintainable chunks.
- Agents can both interact with the end users, or be defined fully internally to the platform, handling certain functionalities.
- On the Mindsmiths platform, the user-facing agents are instances of Java classes. They are the basic entities the end users interact with, and each user is assigned an individual instance.
- ***NOTE: add another document dedicated to defining an agent through rules and java class plus the folder structure
- Other components of the platform (such as the separate services) are also considered to be agents.
- All communication inside platform, i.e. the simulated environment, goes on via **signals**. Accordingly, they can also be external (e.g. coming in from chat platforms) or internal (e.g. coming from one agent communicating to another).
- Signals are not persisted in memory between evaluation cycles.
- If you wish to store something as a fact in the system's knowledge base, you need to insert it into memory.
- These concepts are elaborated in more detail under (insert section), but they relate to another core concept: heartbeat.
- **Heartbeat** is just a mechanism for periodical evaluation of current facts about an agent. You can think of it as a pulse that gets sent through the system to enable constant monitoring of the current situation in the system. This enables you to act proactively and independently, instead of waiting for events to trigger responses.
- The rate of the heartbeat can be configured in the `config.yaml` file and each defined agent has their own heartbeat.
- When it fires, heartbeat triggers an evaluation cycle for that agent.

