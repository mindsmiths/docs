---
sidebar_position: 2
---

# Use case motivation: BMI health check

We want to model a system that can help parents take care of their child’s health by keeping their weight in check.


In the real world, you can imagine a scenario in which a parent asks a doctor whether their child has obesity issues based on the child’s age, height and weight.
In the digitized setup, this communication could happen online via some web form or a chat platform.


We want to do more than just digitize the doctor-patient communication, and automate parts of the process that the system could learn to perform at the same level of quality as the human expert.
We will use a machine learning algorithm that will first track the doctor’s decisions and learn from the responses they send to patients’ queries.
As the available data sample grows larger, the model will gradually learn to predict verdicts on whether the child is obese or not with the same accuracy as the human expert.
Once the estimated confidence is high enough, the model will take over the doctor’s workload and only ask them for opinion in edge cases that still require human attention.

Let's visualize this in a graphic:

![graphic](bmi-guidance-graphic.png#center)

What you can see is that the patient requests first go to the ML component and then get forwarded to the doctor if needed. 
The doctor's input is passed to the model as training data, and communicated back to the patients. Alternatively, the model verdict is just sent back to the patient.

When modelling realistic problems, the setup you need to capture with your system also becomes more layered.
The multi-agent approach allows you to manage the complexity more easily by breaking down the desired behaviour into a multitude of agents, each dedicated specifically to the needs of its user.
As you can see in the graphic above, there are multiple entities interacting in our system: there are multiple patients that want to get a reply from the doctor, and a single doctor that needs to handle all patient queries.

We’ll continue building on the concepts and principles you learned in the previous tutorial. Among other things, we will also be using GPT-3, and we’ll be communicating using Telegram Messenger. 

Let's start!