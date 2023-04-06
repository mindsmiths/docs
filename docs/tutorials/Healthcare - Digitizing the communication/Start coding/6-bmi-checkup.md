---
sidebar_position: 7
---

# Let's get rolling: BMI checkup

With the onboarding and engagement processes in place, we can move on to implementing the code for the BMI checkup.
Personalization and proactivity are immensely important, but they are just support mechanisms for improving the user experience. 
The core functionality is still getting the patient the expert opinion on whether their child has obesity issues or not.

So, let's pick up where we left off and ask the user to send us the child's weight:

```java title="rules/patient/Patient.drl"
...

rule "Ask for weight"
    when
        agent: Patient(waitingForAnswer == false, height != null, weight == null)
    then
        agent.sendMessage("We can track your kid's weight together to see if there are any issues. Send me your child's weight.");
        modify(agent){setWaitingForAnswer(true)};
end
```

This rule is very similar to our onboarding rules, and don't forget to add the `weight` field to our Patient agent model, so we can store it:

```java title="java/agents/Patient.java"
public class Patient extends Agent {
    ...
    private Double weight;
    ...
}
```

Once we have the latest weight, we need to forward the user's query to the doctor for evaluation.
However, the patient's agent cannot have direct access to the doctor (remember what we talked about - each type of user in the system has different needs and preferences).

As you probably remember, we use signals for inter-agent communication. So we just need to create a new Java class and pack up the request for the Doctor agent into it. 
Just add the signals directory in java and create the following file:

```java title="java/signals/BMIMeasurement.java"
package signals;

import lombok.*;

import com.mindsmiths.sdk.core.api.Message;

...

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BMIMeasurement extends Message {
    private Integer age;
    private Double weight;
    private Integer height;
}
```

So, let's add a rule that sends the data to the Doctor.

Same as before, the rule contains the verification that the received number is a valid weight value, otherwise the "Process invalid value" rule will ask the user for a different input. 
The only other condition that needs to be satisfied is that the `height` variable is already filled in, so we are sure we’re in the context where we’re expecting to receive 
a `weight` value. 

It is actually the `then` part of the rule that is more interesting to us: there we create a new `BMIMeasurement` signal and fill it in with the necessary data 
(age, height and weight). In the next line we then send the signal to the agent with the `Doctor.ID`.

The rest of the rule is again more familiar to you: we send a "thank you" message to our user, and use modify to memorize the child’s current weight, 
set the `lastInteractionTime` to the current time and enable proactive engagement by setting the `waitingForAnswer` flag to false. 
After that, we delete the received message with the child’s weight.

```java title="rules/patient/Patient.drl"

rule "Process weight"
    when
        Heartbeat(now: timestamp) from entry-point "signals"
        signal: TelegramReceivedMessage(text: text, BMIUtils.isValidWeight(text)) from entry-point "signals"
        agent: Patient(height != null)
    then
        double weight = Double.parseDouble(text);
        BMIMeasurement bmiMeasurement = new BMIMeasurement(agent.getAge(), weight, agent.getHeight());

        agent.sendMessage("Thanks! I'll get back to you as soon as I check with the doctor.");
        agent.send(Doctor.ID, bmiMeasurement);
        modify(agent) {
            setWeight(weight),
            setLastInteractionTime(now),
            setAttemptedReengagement(false)
            };
        delete(signal);
end
```

That's it! When the doctor's agent receives the signal from the Patient agent, it can decide what to do with the received data. 
This will be our next step: implementing the processing of the received singal on the Doctor's side.

For now, you can already run the platform with FORGE RUN to test out what this entire process looks like for your patients!