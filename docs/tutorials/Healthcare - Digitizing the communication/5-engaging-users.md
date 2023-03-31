---
sidebar_position: 6
---

# Engaging: I care about you

Apart from being familiar with the user's context, it's also important to show the user you care about them by providing 
guidance and proactively encouraging them to tend to their problems.
To add some creativity to the way you address your users and make the interactions more natural and diverse,
we can again use the GPT-3 model to make interactions with users more natural:

```java title="rules/patient/Patient.drl"
...

rule "Engage patient"
    when
        Heartbeat(now: timestamp) from entry-point "signals"
        agent: Patient(lastInteractionTime before[1m] now, attemptedReengagement == false)
    then
        agent.engageProactively();
        modify(agent) {setAttemptedReengagement(true)};
end

rule "Send GPT3 response"
    when
        signal: GPT3Completion() from entry-point "signals"
        agent: Patient()
    then
        String response = signal.getBestResponse();
        agent.sendMessage(response);
        delete(signal);
end
```

The main premise behind this feature is that you can’t make a real impact on someone’s life with a purely reactive approach: 
you need to proactively show you care about the user and their problems. 


We also use GPT-3 for asking the user to correct their answer if they send something 
we didn’t expect in a certain context based on our input validation function:

```java title="rules/patient/Patient.drl"
rule "Process invalid value"
    salience -10
    when
        signal: TelegramReceivedMessage(text: text) from entry-point "signals"
        agent: Patient()
    then
        agent.askForValidValue();
        delete(signal);
end
```


