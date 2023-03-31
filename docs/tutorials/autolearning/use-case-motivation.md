---
sidebar_position: 2
---

# Use case motivation: BMI health check

Our goal is to develop a system that helps parents take care of their child's health by keeping their weight in check. 
In the real world, a parent might ask a doctor whether their child has obesity issues based on their age, height, and weight. 
In a digitized setup, this communication could occur online through a web form, email, or chat platform.

However, our aim is to go beyond simply digitizing doctor-patient communication. We want to build a more comprehensive system 
that can help doctors manage their workload and provide personalized recommendations to patients. 
To do this, first sep is to use a multi-agent approach to manage the complexity of the problem.

When dealing with realistic problems, the system's setup becomes more intricate. In such scenarios, 
the multi-agent approach can help us manage the complexity by dividing the desired behavior into numerous agents. 
Each agent is specifically assigned to cater to the user's needs or a particular set of features.
This approach allows for a more manageable and scalable system. It can handle numerous requests while providing personalized recommendations to the users.
In the following sections, we will delve deeper into the different components of the multi-agent system and explore how they work together to assist parents 
and doctors in managing child obesity issues.

![graphic](multiagents.png#center)

As you can see in the graphic above, there are multiple entities interacting in our system: there are multiple patients that want to get a reply from the doctor, 
and a single doctor that needs to handle all patient queries.

We will build a multi-agent system to tackle this problem, where different agents have distinct roles and responsibilities. 

![graphic](multiagentsystems.png#center)

In this case, we'll have two types of agents: one for doctors and another for patients.

:::note
As you can see in the graphics, each person will have their own agent. You might be wondering why we only have two types of agents when each patient has their own. 
The reason is that even though each patient has their own agent, all of those agents belong to the same category: patient agents.
:::

The doctor's agent will handle BMI queries from patients, analyze the data, and provide a diagnosis (obese or not obese). 
On the other hand, the patient's agent will collect the necessary information from the patient, such as weight, and pass it on to the doctor's agent for analysis.
It will also remind patients to send their weight from time to time to ensure that the data is up to date.

While this use case may seem radically different, we'll continue building on the concepts and principles you learned in the first tutorial. 
Additionally, we'll use GPT-3 and communicate through Telegram Messenger, among other things.

Let's start!