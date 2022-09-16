---
sidebar_position: 5
---

# Let's get rolling: BMI checkup

With the onboarding and engagement processes in place, we can move on to implementing the code for the BMI checkup.

So, let's pick up where we left off and ask the user to send us the child's weight: 

```java title="rules/patient/Patient.drl"
...
import signals.BMIMeasurement
import agents.doctor.Doctor
...
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
        modify(patient) {
            setWeight(weight),
            setLastInteractionTime(new Date()),
            setWaitingForAnswer(false)
            };
        
        BMIMeasurement bmiMeasurement = new BMIMeasurement(patient.getAge(), patient.getHeight(), weight);
        patient.send(Doctor.ID, bmiMeasurement);
        
        patient.sendMessage("Thanks!");
        delete(message);
end
```

The first rule is simple, but what's going on in that second one? Let's dig into it.

First, notice that in the "Process weight" rule, we only use the condition `height != null` for the Patient agent. 
This way we can reuse the rule in every subsequent case the user sends us their child's weight, when this variable is already filled with some previous value.

Once you have the latest weight, you need to forward the user's question to the doctor, so they can evaluate if the child has obesity issues.
However, the patient's agent cannot have direct access to the doctor (remember what we talked about - each type of user in the system has different needs and preferences).
Since we only have a single Doctor agent in this demo, we can just identify it using the hardcoded static id.

Instead, the Patient agent packs up the request it has into a signal and sends it to the Doctor agent to process.
This signal is just another Java class that we use for agent communication:

```java title="java/signals/BMIMeasurement.java"
...
public class BMIMeasurement extends Signal {
    private Integer age;
    private Integer height;
    private Double weight;

    public BMIMeasurement(Integer age, Integer height, Double weight) {
        this.age = age;
        this.height = height;
        this.weight = weight;
    }

    public Double calculateBMI() {
        Double heightMeters = height / 100.0;

        return weight / (heightMeters * heightMeters);
    }
}

```

That's it! When the doctor's agent receives the signal from the Patient, it can decide what to do with the received data. This will be our next step: implementing the processing of the received singal on the Doctor's side.  

For now, you can already run the platform with **forge run** to test out what this entire process looks like for your patients!
