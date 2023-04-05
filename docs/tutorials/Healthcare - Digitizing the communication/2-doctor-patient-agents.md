---
sidebar_position: 3
---

# Doctor and Patient Agents

Our goal is to develop a system that helps parents take care of their child's health by keeping their weight in check. 
In the real world, a parent might ask a doctor whether their child has obesity issues based on their age, height, and weight. 
In a digitized setup, this communication could occur online through a web form, email, or chat platform.

However, our aim is to go beyond simply digitizing doctor-patient communication. We want to build a more comprehensive system 
that can help doctors manage their workload and provide personalized recommendations to patients. 
To do this, first step is to use a multi-agent approach to manage the complexity of the problem.

When dealing with realistic problems, the system's setup becomes more intricate. In such scenarios, 
the multi-agent approach can help us manage the complexity by dividing the desired behavior into numerous agents. 
Each agent is specifically assigned to cater to the user's needs or a particular set of features.
This approach allows for a more manageable and scalable system. It can handle numerous requests while providing personalized recommendations to the users.
In the following sections, we will delve deeper into the different components of the multi-agent system and explore how they work together to assist parents 
and doctors in managing child obesity issues.

![graphic](../../../static/img/tutorials/doctor-patient/multiagents.png#center)

As you can see in the graphic above, there are multiple entities interacting in our system: there are multiple patients that want to get a reply from the doctor, 
and a single doctor that needs to handle all patient queries. Each agent cares only for the needs of the user it is assigned to, instead of being concerned with searching for optimal solutions at system level.

Looking at the principles behind the implementation, there is nothing especially new you will learn from the process of onboarding patients compared to the user communication you implemented in the Conversational AI Tutorial.

So instead of guiding you through typing out the code yourself, we want to draw your attention to some principles of developing smart and emotionally intelligent agents. 
The key moment is shifting the focus to the users themselves: what would a patient want from their agent in order to feel comfortable and cared for? 
As opposed to that, what would the doctor need from their agent? Their roles in real life are different, so the logic implemented by the agents necessarily differ as well.

Generally speaking, we argue that there are three key components the users look for and appreciate in this kind of digital relationships:

- **I KNOW YOU** _(personalized approach)_
- **I CARE ABOUT YOU** _(proactive care)_
- **I HAVE THE EXPERTISE** _(relevant expert knowledge)_

We'll demonstrate these characteristics throughout the implementation of the communication between the agents and the users.

![graphic](../../../static/img/tutorials/doctor-patient/mutliagentsystem.png#center)

In our mutltiagent system, there are two types of agents: one for doctors and another for patients.

:::note
As you can see in the graphics, each person has their own agent. You might be wondering why we only have two types of agents when each patient has their own. 
The reason is that even though each patient has their own agent, all of them belong to the same category: patient agents.
:::

The doctor's agent will handle BMI queries from patients, analyze the data, and provide a diagnosis (obese or not obese). 
On the other hand, the patient's agent will collect the necessary information from the patient, such as weight, and pass it on to the doctor's agent for analysis.
It will also remind patients to send their weight from time to time to ensure that the data is up to date.

While this use case may seem radically different, we'll continue building on the concepts and principles you learned in the first tutorial. 
Additionally, we'll use GPT-3 and communicate through Telegram Messenger, among other things.

Let's start!