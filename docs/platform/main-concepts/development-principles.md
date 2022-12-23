---
sidebar_position: 4
---

# Development principles

- Quick prototyping
- Local optimization (multiple personas)
- Constant evaluations: Declarative programming

### Quick prototyping: Fail fast approach

- The platform supports the principles of **quick prototyping**, making your development process fundamentally agile.
- You don’t need heaps of data to start developing smart solutions, and you don’t need a fully automated product to unleash it into the world.
- Mindsmiths platform is also specifically designed to support “dataless AI” in building expert knowledge, as well as utilization of pre-trained models to speed up prototyping and bridge the time you need to collect relevant data when already in production.
- You can always improve and move on to more advanced implementations as your product lives on.


### Local optimizations: User-centric approach

- When it comes to **user-centricity**, optimizing for each individual user sits at the very core of the multi-agent systems.
- Building a simulation in which you don't aim to optimize for the system as a whole - each type of agent cares for their own persona, and each agent optimizes for their specific set of goals.
- This approach is in opposition to relying on monolithic large deep learning models trained on heaps of data for developing smart solutions. The agents pursuing their own goals should achieve the optimal performance for the system as a whole.
- Goals and behaviours defined through our agents the capacity to have a personalized approach for every user, tuned to their history, specific situation and preferences, as opposed to predefined scripted behaviors.
- All learning and customization of the process can be done specifically for that individual user.

### Constant evaluation: Declarative programming paradigm

- Running agents in a continuous simulation means your users are constantly under their agent’s care: the situation is constantly evaluated and monitored, enabling your agents to autonomously take proactive actions to improve the users’ lives.
- When trying to achieve this, it helps if you don't need to explicitly define how each possible situation that might occur should be handled.
- Among other reasons, this is why we use **[declarative programming](https://www.techopedia.com/definition/18763/declarative-programming)** in evaluations.
- This logic is implemented in the component called Rule Engine, in the form of human-readable business rules. 
- Declarative programming allows for efficient, data-driven detection of situations as they occur, without the limitation of the imposed order of execution.


## Advantages of rule engines: simplification, flexibility, readability
- The structure of rule engines enables you to break down highly complex scenarios into sets of very simple conditions and spares you the trouble of foreseeing all specific circumstances under which certain events might occur.
- The rules themselves are written using declarative programming. This gives you much more freedom in how you structure the logic, because the rules that fire in evaluations are determined by the data.
- The declarative programming paradigm allows you to express a piece of logic without explicitly specifying the flow of execution: the order of execution governed _only_ by the conditions the rules declare.
- Each rule should be as simple as possible: they should be independent of each other, highly separable and only contain the minimal information necessary. 
- This makes rules more easily maintainable and the system more easily extendable.
- Moreover, together with the fact that rules are written in a sort of a "meta-language", this makes rules easy to read for people of different backgrounds.

#### Examples
- Let's consider two short examples as an illustration of the benefits of this approach.
- Let's say a doctor is examining a patient. The most important questions should be resolved first, such as "Is the person in a life-threatening state?". If the answer is no, the questions to ensue could for example be "Does the person have a fever?", "Is the person feeling nauseous?", "Is the person's face pale?" and so on. Now imagine that, during one these follow-up questions, the patient has a heart attack. If we were to transfer this situation to the digital world, we would have absolutely no way of reacting properly to the newly occurred situation using the imperative programming paradigm, because once we are in the defined process of statement execution, there is no way for us to circle back to the top of that decision tree, which in this situation, you'll agree, is relatively important. Declarative programming, on the other hand, allows us to evaluate each new situation in its own right, irrespective of what led up to its occurrence.


- We can illustrate a different point by considering the situation in which you need to cross the road. There are many circumstances that need to be considered when making the decision to cross: is it a pedestrian crossing, is there a car coming, is there traffic regulation, at what speed is a vehicle approaching you... However, at the conscious level, the decision boils down to two main conditions: is it safe to cross the road, and is it allowed.
- Writing up the logic in the form of rules allows you to efficiently capture exactly this reasoning process: all these "constituent" circumstances can be evaluated individually, operationalizing the evaluation of the two major factors that will ultimately be used to reach a decision. This build-up in which conclusions of one rule are used to set the conditions for execution of another is called **rule chaining**.
- An extra benefit of this approach is transparency of the decision-making process: you can discern how the system reached a certain decision simply by looking at the history of the rules that fired in the process.