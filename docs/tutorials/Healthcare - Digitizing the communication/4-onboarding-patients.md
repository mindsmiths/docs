---
sidebar_position: 5
---

# Adding patients

## Personalized approach: I know you

Context is extremely important when building relationships with users: to avoid scripting out the system behavior into fixed scenarios, 
you always want your system to know exactly who the person it is talking to is, what some relevant aspects of the previous interactions are and what the current context of their needs is.

At the very basic level, this simply means giving the agent sufficient information about the user through an onboarding process.
In this demo, our user keeps track of their child's weight, so we'll store some relevant data for a more personalized experience, 
i.e. the child’s name, height and age, and then iteratively update the weight to the latest provided value.

As mentioned, the onboarding steps for storing the name, height and age information are already written out for you in `Patient.java` and `Patient.drl` files.

Since all onboarding rules follow the same logic, we'll only look at the code of the first one for storing the child's name:

```java title="rules/patient/Patient.drl"
package rules.patient;

import org.apache.commons.lang3.math.NumberUtils

import com.mindsmiths.ruleEngine.model.Initialize
import com.mindsmiths.telegramAdapter.events.TelegramReceivedMessage

import agents.Patient

////////////////////////// Welcome patient //////////////////////////
rule "Welcome message"
    salience 100
    when
        initialize: Initialize() from entry-point "agent-created"
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Patient()
    then
        agent.sendMessage("Welcome to the Clinic!");
        delete(initialize);
end

////////////////////////// Getting child name //////////////////////////
rule "Ask for name"
    when
        signal: TelegramReceivedMessage() from entry-point "signals"
        agent: Patient(waitingForAnswer != true, name == null)
    then
        agent.sendMessage("Welcome to the Clinic!");
        agent.sendMessage("What's the name of the child whose weight you would like to check?");
        modify(agent) {setWaitingForAnswer(true)};
        delete(signal);
end

rule "Set name"
    when
        signal: TelegramReceivedMessage(text: text, !NumberUtils.isParsable(text)) from entry-point "signals"
        agent: Patient(waitingForAnswer == true, name == null)
    then
        modify(agent) {setWaitingForAnswer(false), setName(text)};
        delete(signal);
end
...
```
You'll notice we ask the user for information and store it through a series of rule pairs.

Notice that the "Welcome message" and "Ask for name" rules react to the same message: since the welcome rule doesn't delete the incoming Telegram message signal, 
the rule asking for the name fires as well right after it. We ensure this order by setting a higher salience for the welcome rule. 
We also set the waitingForAnswer to true to indicate we're expecting some response from the user. The fact that the name is null tells us which stage we are in, 
i.e. that we're looking to find out the child's name next.

Once the user sends us the answer, we just need to check it's a valid name, and we can set it as the variable value. We also re-set the waitingForAnswer to false, 
so we can proceed with asking the user for the next piece of information, i.e. the child's age.

The implementation is very simple, and all onboarding rules follow the same pattern: we ask the information we need, setting the waitingForAnswer flag to true, 
and then set the value of the variable when we receive an answer.

Once we have all the info, we send the user an overview with all the data they've provided so far, and set the last interaction time to the current time:

```java title="java/agents/Patient.java"
package agents;

import java.time.LocalDateTime;
import lombok.*;

import com.mindsmiths.gpt3.GPT3AdapterAPI;
import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.ruleEngine.util.Log;
import com.mindsmiths.telegramAdapter.TelegramAdapterAPI;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient extends Agent {
    private String name;
    private Integer age;
    private Integer height;

    private LocalDateTime lastInteractionTime;
    private boolean attemptedReengagement;

    public void sendMessage(String text) {
        String chatId = connections.get("telegram");
        TelegramAdapterAPI.sendMessage(chatId, text);
    }
}
```
Great, we've now set some very basic context with which the agent can show it knows the patient. 
For your convenience, we've also included some simple functions for validating the user's input for each requested piece of information. 
You can check and adapt them in java/utils/BMIUtils.java.

Now that our onboarding is complete, let's look at the remaining code we've included in your initial setup.