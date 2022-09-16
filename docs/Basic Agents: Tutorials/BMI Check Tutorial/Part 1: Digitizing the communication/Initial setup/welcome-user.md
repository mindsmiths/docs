---
sidebar_position: 2
---

# Welcome user

Let's go through the code we prepared for you. First, we start from onboarding the users in our system. 
In this demo we'll be onboarding two types of users: 
- patients 
- doctors

You can find the welcome rules in the corresponding `.drl` files for the two agent types (`Patient.drl` and `Doctor.drl`).

```java title="rules/doctor/Doctor.drl"
rule "Welcome doctor"
    when
        initialize: Initialize() from entry-point "agent-created"
        message: TelegramReceivedMessage() from entry-point "signals"
        doctor: Doctor()
    then
        String welcomeText = Utils.randomChoice(Doctor.welcomeTexts);
        doctor.sendMessage(welcomeText);
        delete(initialize);
        delete(message);
end
```

You will notice that the two welcome rules look fairly similar, as both types of users simply register in the system by contacting your bot on Telegram.
As mentioned, this is because we made a simplification in the design of the demo: the first person to register will always be the doctor, and every next person will by default be registered as a patient.

Since we always have a single doctor, we also hardcoded the agent’s id to make the inter-agent communication easier. 
The rest of the `Doctor.java` file should already look familiar to you from the previous tutorial.

If you want to try onboarding the doctor, you can already hit **FORGE RUN** and send your Telegram bot a message.

We'll now focus on the differences in the implementation of the rest of the onboarding steps for the doctor and patient agents.
