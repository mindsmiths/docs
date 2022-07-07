---
sidebar_position: 4
---

# Development principles

- Quick prototyping
- Local optimization (multiple personas)
- Constant evaluations: Declarative programming

### Qucik prototyping: Fail fast approach

- The platform supports the principles of **quick prototyping**, making your development process fundamentally agile.
- You don’t need heaps of data to start developing smart solutions, and you don’t need a fully automated product to unleash it into the world.
- Mindsmiths platform is also specifically designed to support _“dataless AI”_ in building expert knowledge, as well as utilization of pre-trained models to speed up prototyping and bridge the time you need to collect relevant data when already in production.
- You can always improve and move on to more advanced implementations as your product lives on.


### Local optimizations: User-centric approach

- When it comes to **user-centricity**, optimizing for each individual user sits at the very core of the multi-agent systems.
- Building a simulation in which you don't aim to optimize for the system as a whole - each type of agent cares for their own persona, and each agent optimizes for their specific set of goals.
- This approach is in opposition to relying on monolithic large deep learning models trained on heaps of data for developing smart solutions. The agents pursuing their own goals should achieve the optimal performance for the system as a whole.
- Goals and behaviours defined through our agents the capacity to have a personalized approach for every user, tuned to their history, specific situation and preferences, as opposed to predefined scripted behaviors.
- All learning and customization of the process can be done specifically for that individual user.
- We believe in the world where the best service and top-quality knowledge are accessible to everyone.
- Through this platform, we want to help you create smart and caring support systems and bring value to the world. 

### Constant evaluation: Declarative programming paradigm

- Running agents in a continuous simulation means your users are constantly under their agent’s care: the situation is constantly evaluated and monitored, enabling your agents to autonomously take proactive actions to improve the users’ lives.
- When trying to achieve this, it helps if you don't need to explicitly define how each possible situation that might occur should be handled.
- Among other reasons, this is why we use **[declarative programming](https://www.techopedia.com/definition/18763/declarative-programming)** in evaluations.
- This logic is implemented in the component called Rule Engine, in the form of human-readable business rules. 
- Declarative programming allows for efficient, data-driven detection of situations as they occur, without the limitation of the imposed order of execution.

#### Examples
- Let's consider two short examples as an illustration of the benefits of this approach.
- Let's say a doctor is examining a patient. The most important questions should be resolved first, such as "Is the person in a life-threatening state?". If the answer is no, the questions to ensue could for example be "Does the person have a fever?", "Is the person feeling nauseous?", "Is the person's face pale?" and so on. Now imagine that, during one these follow-up questions, the patient has a heart attack. If we were to transfer this situation to the digital world, we would have absolutely no way of reacting properly to the newly occurred situation using the imperative programming paradigm, because once we are in the defined process of statement execution, there is no way for us to circle back to the top of that decision tree, which in this situation, you'll agree, is relatively important. Declarative programming, on the other hand, allows us to evaluate each new situation in its own right, irrespective of what led up to its occurrence.
- In a milder example, let's consider the situation in which you need to cross the road. There are many circumstances that need to be considered when making the decision to cross: is it a pedestrian crossing, is there a car coming, is there traffic regulation, at what speed is a vehicle approaching you... However, at the conscious level, the decision boils down to two main conditions: is it safe to cross the road, and is it allowed.
- Writing up the logic in the form of rules allows you to efficiently capture exactly this reasoning process: all these "constituent" circumstances can be evaluated individually, operationalizing the evaluation of the two major factors that will ultimately be used to reach a decision. This build-up in which conclusions of one rule are used to set the conditions for execution of another is called **rule chaining**.
- An extra benefit of this approach is transparency of the decision-making process: you can discern how the system reached a certain decision simply by looking at the history of the rules that fired in the process.