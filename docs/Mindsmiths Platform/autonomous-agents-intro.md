---
sidebar_position: 2
---

# What are autonomous agents?

Autonomous agents are intelligent pieces of software that act autonomously in a computerized environment to achieve some defined goals.
These agents can interact with each other and with the environment, always being aware only of the _limited_ context and information.


Multi-agent systems are composed of multiple interacting agents, and they are designed to simulate complex scenarios by breaking them down into agent interactions that are simpler and narrower in scope.

When you run Forge, you run the simulation in which the agents act according to the business logic you implemented.

In our setup, the multi-agent environment boils down to these four concepts: 
*  **Forge**
*  **Agents**
*  **Signals** and
*  **Memory**


The agents can communicate with each other using **signals**. By default, these signals are discarded once they are processed, but relevant data is persisted in memory. Note that not all agents have to be in contact with the outside world and end users - you can define as many types of interacting agents as you need to handle your business needs efficiently.


Let’s make things a bit clearer by walking you through an example:


Suppose we have several patients who want to know if and when they should go to their doctor for a check-up given some symptoms.
In real life, we have many concerned patients and much fewer doctors with limited capacity to provide them care.
So, in terms of Forge, you set up an environment in which you define a **Patient agent** to mediate the patients’ wishes. In our setup, each real-life patient gets their own **Patient agent** (their own instance of the **Patient class**) to optimize for data privacy and  individualized approach to end users.
The Patient agent can be augmented with any kind of knowledge representations, decision-making and learning algorithms needed for the particular use case.


On the other hand, the real-life doctor needs a different type of agent, the **Doctor agent**,  to represent his/her interests. For instance, the doctors have limited capacity, working hours and prioritizing algorithms for urgency of admission.
The beauty of multi-agent systems is that the two types of agents don’t need to know or care about the interests of their respective users, but the resulting process once the environment is run should be optimal for each individual situation.