---
sidebar_position: 1
---

# Intro

Welcome to the BMI Check Tutorial!

Here you will learn how to use more advanced features of the platform. Together we'll develop a more complex system, working with multiple types of agents. 

This combination brings human-to-machine communication to another level, and makes digital agents emotionally intelligent. 

In this demo, we’re implementing a health assistant for identifying potential obesity issues in children. 
This is a real-life problem that is fairly well-defined, but not as straight-forward in its calculation as it is for adults.
That's why at first it requires expert knowledge from a doctor who will evaluate the BMI queries themselves.

We will build a multi-agent system to tackle this problem. In a multi-agent system, different agents can have distinct roles and responsibilities. 
In the case of the health assistant we are building, we will have two different types of agents: one for the doctors and one for the patients. 

The doctor's agent will be responsible for receiving the BMI queries from patients, analyzing the data, and providing a diagnosis (obese or not obese), 
while the patient's agent cwill be responsible for collecting the necessary information from the patient, such as their weight, and passing it on to the doctor's agent for analysis.
it will also remind patients to send weight from time to time.

By enabling effective communication and collaboration between agents, we can build a system that is capable of handling complex problems in a more efficient and effective way than a single agent could on its own.

This is a slightly more complex use case compared to the first tutorial, but we’ll get through it together step by step,
taking care to implement all three core agent characteristics. Let's have a look!

:::note
No matter how complex our systems get, we always want our agents to display these three core characteristics in communication with end users:
- I know you (and that's why I can take care of your specific needs)
- I have the expertise (and that's why my advice is relevant)
- I care about you (and that's why I'm proactively reaching out to you).
:::
