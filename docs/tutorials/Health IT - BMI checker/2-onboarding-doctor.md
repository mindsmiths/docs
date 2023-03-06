---
sidebar_position: 2
---

# Welcome doctor

So, let's go through the code we prepared for you. We start from onboarding the users in our system. 
As mentioned, in this demo we're onboarding two types of users: 
- patients 
- doctors

You can find the welcome rules in the corresponding `.drl` files for the two agent types (`Patient.drl` and `Doctor.drl`). Let's go through doctor `.drl` and `java` files first.

```java title="rules/doctor/Doctor.drl"
package rules.doctor;

import com.mindsmiths.ruleEngine.model.Initialize

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

    public Double calculateBMI(Integer height, Double weight) {
        Double heightMeters = height / 100.0;
        return weight / (heightMeters * heightMeters);
    }
}
```

If you want to try onboarding the doctor, you can already hit **FORGE RUN** and send your Telegram bot a message.

