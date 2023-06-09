---
sidebar_position: 4
---

# Welcome, doctor

Let's start from the beginning - onboarding the users in our system. 

As mentioned, in this demo we'll be onboarding two types of users: 
- patients 
- doctors

You can find the welcome rules in the corresponding `drl` files for the two agent types (`Patient.drl` and `Doctor.drl`). 
Let's go through doctor's `drl` and `java` files first.

```java title="rules/doctor/Doctor.drl"
package rules.doctor;

import com.mindsmiths.ruleEngine.model.Initialize
import com.mindsmiths.telegramAdapter.events.TelegramReceivedMessage

import agents.Doctor

rule "Welcome doctor"
    when
        signal: Initialize() from entry-point "signals"
        doctor: Doctor()
    then
        doctor.sendMessage("Welcome, doctor!");
        delete(signal);
end
```

To simplify things a bit, the first person to send the message when you hit `forge run` will always be onboarded as the doctor, and every next person will by default be registered as a patient.

Since we always have a single doctor, we also hardcoded the agent’s id to make the inter-agent communication easier. 
The rest of the `Doctor.java` file should already look familiar to you from the previous tutorial, as it's only used for communication over Telegram:

```java title="java/agents/Doctor.java"
package agents;

import java.util.Arrays;
import lombok.Getter;
import lombok.Setter;

import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.telegramAdapter.TelegramAdapterAPI;

@Getter
@Setter
public class Doctor extends Agent {
    public static String ID = "DOCTOR";

    public Doctor() {
        id = ID;
    }

    public void sendMessage(String text) {
        TelegramAdapterAPI.sendMessage(getConnection("telegram"), text);
    }
}
```

If you want to try onboarding the doctor, you can already hit **FORGE RUN** and send your Telegram bot a message.
We'll now focus on the differences in the implementation of the rest of the onboarding steps for the doctor and the patients.
