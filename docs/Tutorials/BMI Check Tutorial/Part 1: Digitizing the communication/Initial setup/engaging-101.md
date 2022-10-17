---
sidebar_position: 4
---

# Engaging 101: I care about you

Apart from being familiar with the user's context, it's also important to show the user you care about them by providing 
guidance and proactively encouraging them to tend to their problems.
To add some creativity to the way you address your users and make the interactions more natural and diverse,
we can again use the GPT-3 model to make interactions with users more natural:

```java title="rules/patient/Patient.drl"
...
////////////////////////// GPT-3 rules //////////////////////////

rule "Engage patient"
    when
        Heartbeat(now: timestamp) from entry-point "signals"
        patient: Patient(lastInteractionTime before[1m] now, waitingForAnswer != true)
   then
       patient.engageProactively();
       modify(patient) {setWaitingForAnswer(true)};
end

rule "Send GPT3 response"
    when
        gpt3Result: GPT3Completion() from entry-point "signals"
        patient: Patient()
    then
        String response = gpt3Result.getBestResponse();
        patient.sendMessage(response);
        delete(gpt3Result);
end
...
```

The main premise behind this feature is that you can’t make a real impact on someone’s life with a purely reactive approach: 
you need to proactively show you care about the user and their problems. 
Ideally, you want to encourage your users to continuously care for their child’s health and regularly send updated weight data. 
For demonstrative purposes, we’ll keep the time passed since the last checkup at 1 minute and send a reminder to the 
user to check their child’s weight again. In real life, of course, this would more likely be a weekly or monthly cycle.


We also use GPT-3 for asking the user to correct their answer should they send something 
we didn’t expect in a certain context based on our input validation function:

```java title="rules/patient/Patient.drl"
...
rule "Unrecognizable message"
    salience -100
    when
        message: TelegramReceivedMessage(text: text) from entry-point "signals"
        patient: Patient()
    then
        patient.answerIfInvalidValue();
        delete(message);
end
```

Notice that the salience for this rule is way lower than for the other rules we wrote: this makes it into a kind of “catch-all” rule: 
it will make sure no message the user sends stays unprocessed, and that the system can react appropriately in different situations.
You can again control this through the input prompt you send to GPT-3, so let’s take a look at what that looks like in the Java file:

```java title="java/agents/Patient.java"
...
public class Patient extends Agent {
    ...
    public void engageProactively() {
            String intro = "You are a doctor talking to a patient. " +
                        "The patient should send their child's weight for a regular check-up. " +
                        "A week has passed, remind the patient to send you the updated weight so the doctor could check it.";
    
            askGPT3(intro);
    }
    
    public void answerIfInvalidValue() {
        String intro = "";
        String requiredValue = "";
        String instruction = "";
        if (this.name == null) {
            requiredValue = "name";
            instruction = "Ask for the correct name.";
        } else if (this.age == null) {
            requiredValue = "age";
            instruction = "Explain politely that you can only check BMI for age 2 to 15. Ask for an age in that range.";
        } else if (this.height == null) {
            requiredValue = "height";
            instruction = String.format("Explain politely that a child of age %d cannot be this tall. Ask for the correct height.", this.age);
        } else {
            requiredValue = "weight";
            instruction = String.format("Explain politely that a child of age %d who is %d tall cannot weigh that much. Ask for a correct latest weight for their child in the number of kilograms.", this.age, this.height);
        }
        intro = String.format("You're a doctor talking to a patient. " + "The patient should send you their child's %s. ", requiredValue) + "The patient sent you an invalid message. " + instruction + " The doctor says:";

        askGPT3(intro);
    }
    
    public void askGPT3(String prompt) {
        Log.info("Prompt for GPT-3:\n" + prompt);
        GPT3AdapterAPI.complete(prompt, // input prompt
                "text-davinci-001", // model
                128, // max tokens
                0.31 // temperature
        );
    }
}
```

As you can see, you’re tweaking GPT-3 to generate different messages based on the context: 
if the agent was expecting the answer for the child’s height, it will respond differently than if the onboarding process is complete 
and the system only expects updates on the child’s current weight.

And that’s all there is to it: you can now run **FORGE RUN** to try these features out, 
so you can get familiar with the user experience the patients in your system will go through.

Congrats, you are now ready to start developing!