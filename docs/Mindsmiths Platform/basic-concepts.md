---
sidebar_position: 2
---

# Mindsmiths Platform: Basic concepts
## 🚧 Under construction 🚧

## Basic concepts
There are several basic concepts we need to introduce before you get started with coding on the platform:
- agents
- facts and signals
- heartbeat
- environment

### Agent ecosystem
    
On the Mindsmiths Platform, any entities that are capable of interacting with each other or the environment are referred to as **agents**. 
Agents can both interact with the end users, or be defined fully internally to the platform, handling certain functionalities. 
Defining a multitude of agents allows you to break down complex issues into more easily solvable and maintainable chunks. The user-facing agents are instances of Java classes, and they are the basic entities the end users interact with. 
Each user gets their own instance of the agent. Note that other components of the platform (such as the separate services) are also considered to be agents.


The basic level of agent behavior is structured in rules. This provides the hard-wiring of the way each agent behaves.
The rules specify the actions to be taken in case certain situations occur. 
There are two basic types of conditions the rules use: those based on signals and those based on facts.
All communication on the platform goes on via **signals**. They can be internal to the platform (e.g. in agent communication), or received from the outside (e.g. coming in from chat platforms).
Signals are not persisted in memory between rule evaluation cycles, but you can insert them into the knowledge base. This makes them into a **fact** that can be re-used, modified and deleted in other rules.  

This is possible because of the **heartbeat**: a mechanism for periodical evaluation of current facts about an agent. 
For instance, this means your users are under constant care of their agents, as opposed to having to prompt the system themselves, so it would react.
You configure the rate of the heartbeat yourself in `config/config.yaml`, and each of the agents you define has their own heartbeat. When it fires, the heartbeat triggers an evaluation cycle for that agent.


Each agent has its own "agency" - it is only aware of a limited set of information that's relevant to it, and optimizes for its own goals. The limited context the agent is exposed to is called **local view**.
The platform is basically just the **environment** in which your agents autonomously live, act and interact with each other and the environment itself. 

The Mindsmiths platform is a platform for running multi-agent simulations: you start it up by writing `forge run`, and the simulation keeps running for as long as the run is active.
Ultimately what this means is that your agents are constantly live, crunching and processing data, which enables them to take proactive and independent actions should they detect the need for it.


### Basic platform components

The platform consists of many different components, but they are all glued together through the **Rule Engine** - an expert knowledge service. Together with the **Heartbeat**, it makes up the core services that every project needs.

#### Rule Engine
The agents and their rules are defined in a service called the Rule engine.
It's responsible for managing and evaluating agents. We use the Drools framework to define and evaluate rules.

When it receives a signal, it performs these steps:
1. Find the agent(s) who should handle the signal - defined with a strategy in `signals.yaml` and/or `Runner.java`
2. Find the facts stored in the agent's memory
3. Insert the signal and facts in the session
4. Evaluate and trigger the agent's rules
5. Store the updated facts in the database

The signals that trigger these actions are defined in `signals.yaml` and/or `Runner.java`.

#### Heartbeat
We want our agents to be "alive" and constantly "think". This allows them to be proactive instead of waiting for someone
to "turn them on". 

However, with potentially millions of agents we need to make sure this process is efficient. Millions of `while true`
loops just won't cut it.

That's why we gave our agents a _heartbeat_. Apart from evaluating agents on each event, they are also evaluated periodically when they receive a heartbeat signal.

The Heartbeat service decides when to send a heartbeat for which agent. The default strategy is to send it every X seconds (where X is configurable).
Other strategies exist for more efficiency in special cases. You can also write a custom strategy if the need arises.