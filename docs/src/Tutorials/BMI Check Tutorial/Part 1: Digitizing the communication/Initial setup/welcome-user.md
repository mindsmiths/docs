---
sidebar_position: 2
---

# Welcome user

So, let's go through the code we prepared for you. We start from onboarding the users in our system. 
As mentioned, in this demo we're onboarding two types of users: 
- patients 
- doctors

You can find the welcome rules in the corresponding `.drl` files for the two agent types (`Patient.drl` and `Doctor.drl`):
You will notice that the two welcome rules look fairly similar, as both types of users simply register in the system by contacting your bot on Telegram:
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

As we said, this is because we made a simplification in the design of the demo: the first person to register will always be the doctor, and every next person will by default be registered as a patient.

Since we always have a single doctor, we also hardcoded the agent’s id to make the inter-agent communication easier. 
The rest of the `Doctor.java` file should already look familiar to you from the previous tutorial, as it's only used for communication over Telegram:
```java title="java/agents/Doctor.drl"
package agents;

import lombok.Data;
import lombok.NoArgsConstructor;

import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.telegramAdapter.TelegramAdapterAPI;


@Data
@NoArgsConstructor
public class Doctor extends Agent {
    public static String ID = "DOCTOR";

    public Doctor(String connectionName, String connectionId) {
        super(connectionName, connectionId);
        this.id = Doctor.ID;
    }

    public void sendMessage(String text) {
        TelegramAdapterAPI.sendMessage(connections.get("telegram"), text);
    }
}
```

If you want to try onboarding the doctor, you can already hit **FORGE RUN** and send your Telegram bot a message.

We'll now focus on the differences in the implementation of the rest of the onboarding steps for the doctor and the patients.
