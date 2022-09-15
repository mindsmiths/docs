---
sidebar_position: 5
---

# Let's get rolling: BMI checkup
------------ next:
We now need to ask for the child's current weight. This is the only piece of information we will be updating throughout the demo:

```java title="rules/patient/Patient.drl"
rule "Ask for weight"
    when
        patient: Patient(waitingForAnswer == false, height != null, weight == null)
    then
        patient.sendMessage("We can track your child's weight together to see if there are any issues! Just send me send me your child's weight and I'll check it with the doctor 😊");
        modify(patient){setWaitingForAnswer(true)};
end

rule "Process weight"
    when
        message: TelegramReceivedMessage(text: text, BMIUtils.isValidWeight(text)) from entry-point "signals"
        patient: Patient(height != null)
    then
        double weight = Double.parseDouble(text);
        BMIMeasurement bmiMeasurement = new BMIMeasurement(patient.getAge(), weight, patient.getHeight());

        patient.sendMessage("Thanks!");
        patient.send(Doctor.ID, bmiMeasurement);
        modify(patient) {
            setWeight(weight),
            setLastInteractionTime(new Date()),
            setWaitingForAnswer(false)
            };
        delete(message);
end
```
Before we turn to the 
The first rule is fairly simple, but let's dig into the second one for a bit.

First, notice that in the `"Process weight"` rule, we only use the condition `height != null` on the Patient agent. 
This way we can reuse the rule in every subsequent case the user sends us their child's weight, when this variable is already filled with some previous value. 
That's why we also set some additional things we haven't encountered in onboarding when modifying the agent (`lastInteractionTime` and `waitingForAnswer`). We'll get back to these variables in the Engagement section.

But let's 


Okay, you can now run the platform with **forge run** to test out what this process looks like for your user!
