---
sidebar_position: 3
---

# Doctor and Patient Agents

Our goal is to develop a system that helps parents take care of their child's health by keeping their weight in check. 
In the real world, a parent might ask a doctor whether their child has obesity issues based on their age, height, and weight. 
In a digitized setup, this communication could occur online through a web form, email, or a chat platform.

However, our aim is to go beyond simply digitizing doctor-patient communication. We want to build a more comprehensive system 
that can help doctors manage their workload and provide personalized care to patients. 
To do this, first step is to use a multi-agent approach to break down the complexity of the problem.

## So, what is the multi-agent approach?

It's actually very simple: when dealing with real-life use cases, it's helpful (and advisable) to break them down into simpler problems and handle them separately.
In a multi-agent system, each agent only handles a single type of user, or a particular set of features inside the system. In other words, each agent only cares about the subset of functionalities it is assigned to, instead of being concerned with searching for optimal solutions at system level.
This approach allows for a more manageable and scalable system. Let's illustrate this with the use case from our tutorial.

![graphic](../../../static/img/tutorials/doctor-patient/multiagents.png#center)

As you can see in the graphic above, there are different personas interacting: there are multiple patients that want to get a reply from the doctor, 
and a single doctor that needs to handle the patient queries. Similarly, we'll have separate agents representing patients and doctors in the digital world. For example, the patient's agent is responsible for getting the parent's question to the doctor and delivering a reply as soon as possible. The doctor's agent on the other hand takes care that the doctor is not overloaded, that working hours and patient priority are respected, and so on.

So instead of guiding you through typing out the code yourself, we want to draw your attention to some principles of developing smart and emotionally intelligent agents. 
The key moment is shifting the focus on the users themselves: what would a patient want from their agent in order to feel comfortable and cared for? 
As opposed to that, what would the doctor need from their agent? Their roles in real life are different, so the logic implemented by the agents necessarily differs as well.

Generally speaking, there are three key components we believe the users look for and appreciate in this kind of digital relationships:

- **I KNOW YOU** _(personalized approach)_
- **I CARE ABOUT YOU** _(proactive care)_
- **I HAVE THE EXPERTISE** _(relevant expert knowledge)_

We'll demonstrate these characteristics throughout the implementation of the communication between the agents and the users.

![graphic](../../../static/img/tutorials/doctor-patient/mutliagentsystem.png#center)

In our multi-agent system, there are two types of agents: one for doctors and another for patients.

The doctor's agent will handle BMI queries from patients, analyze the data, and provide a diagnosis (obese or not obese). 
On the other hand, the patient's agent will regularly collect the necessary information from the patient, such as weight, and pass it on to the doctor's agent for analysis.
It will also remind patients to send their weight from time to time to ensure that the data is up-to-date.

Although this use case may seem very different, you'll see that we'll actually continue building on the concepts and principles you learned in the [first tutorial](conversational-ai/introduction). 
Among other things, we'll also use GPT-3 and communicate through Telegram Messenger.

Let's start!