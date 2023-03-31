---
sidebar_position: 5
---

# Welcome patient

## Personalized approach: I know you

Context is extremely important when building relationships with users: to avoid scripting out the system behavior into fixed scenarios, 
you always want your system to know exactly who the person you are talking to is, what some relevant aspects of the previous interactions are and what the current context of their needs is.

At the very basic level, this simply means giving the agent sufficient information about the user they are assigned to by defining some onboarding process.
In this demo, our user keeps track of their child's weight, so we'll store some relevant data for a more personalized experience, i.e. the child’s name, height and age, and then iteratively update the weight to the latest provided value.


```java title="rules/patient/Patient.drl"
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

rule "Ask for age"
    when
        agent: Patient(waitingForAnswer != true, name != null, age == null)
    then
        agent.sendMessage(
                String.format("Lovely, how old is %s?", agent.getName())
        );
        modify(agent) {setWaitingForAnswer(true)};
end

rule "Set age"
    when
        signal: TelegramReceivedMessage(text: text, BMIUtils.isValidAge(text)) from entry-point "signals"
        agent: Patient(waitingForAnswer == true, name!= null, age == null)
    then
        modify(agent) {setWaitingForAnswer(false), setAge(Integer.parseInt(text))};
        delete(signal);
end

rule "Ask for height"
    when
        agent: Patient(waitingForAnswer != true, age != null, height == null)
    then
        agent.sendMessage(
                String.format("And how tall is %s in cm?", agent.getName())
        );
        modify(agent) {setWaitingForAnswer(true)};
end

rule "Set height"
    when
        signal: TelegramReceivedMessage(text: text, BMIUtils.isValidHeight(text)) from entry-point "signals"
        agent: Patient(waitingForAnswer == true, age != null, height == null)
    then
        modify(agent) {setWaitingForAnswer(false), setHeight(Integer.parseInt(text))};
        delete(signal);
end
```

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