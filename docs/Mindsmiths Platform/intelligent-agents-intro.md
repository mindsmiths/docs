---
sidebar_position: 3
---

# What are intelligent agents?

Intelligent digital agents are intelligent pieces of software that perceive their environment and act autonomously in it to achieve some defined goals. They may also improve their performance through learning.
These agents can interact with each other and with the environment, always being aware only of the _limited_ context and information.


Multi-agent systems are composed of multiple interacting agents, and they are designed to simulate complex scenarios by breaking them down into agent interactions that are simpler and narrower in scope.

When you start the Platform with _forge run_, you run the simulation in which the agents act according to the business logic you implemented.


Let’s make things a bit clearer by walking you through an example:


Suppose we have several patients who want to know if and when they should go to their doctor for a check-up given some symptoms.
In real life, we have many concerned patients and much fewer doctors with limited capacity to provide them care.
Transferring this to the Mindsmiths Platform, you set up an environment in which you define a **Patient agent** to mediate the patients’ wishes. 
In our setup, each real-life patient gets their own **Patient agent** (their own instance of the **Patient class**) to optimize for data privacy and  individualized approach to end users.
The Patient agent can be augmented with any kind of knowledge representations, decision-making and learning algorithms needed for the particular use case.


On the other hand, the real-life doctor needs a different type of agent, the **Doctor agent**,  to represent his/her interests. 
For instance, the doctors have limited capacity, working hours and prioritizing algorithms for urgency of admission.
The beauty of multi-agent systems is that the two types of agents don’t need to know or care about the interests of each other's respective users, but the resulting process once the environment is run should be optimal for each individual situation. This is referred to as **local view**: each agent only has access to certain information at all times.


## DNA & Learning

DNA = Rules
- gives structure
- no need to learn unnecessary stuff (constrain problem/solution space to be relevant)
- same as humans (predefined brain structures)
- rules evolve just like organisms did

Learning = AutoML & Model-as-a-Service
- only for certain (relevant) parts
- constrained to manageable size for small amounts of data
- make use of already (pre)trained models, no need to start from scratch
