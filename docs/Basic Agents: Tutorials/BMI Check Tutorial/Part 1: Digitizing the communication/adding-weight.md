---
sidebar_position: 5
---

# Let's get rolling: BMI checkup

With the onboarding and engagement processes in place, we can move on to implementing the code for the BMI checkup.

So, let's pick up where we left off and ask the user to send us the child's weight:

```java title="rules/patient/Patient.drl"
...
////////////////////////// Process weight //////////////////////////

rule "Ask for weight"
    when
        patient: Patient(waitingForAnswer == false, height != null, weight == null)
    then
        patient.sendMessage("We can track your child's weight together to see if there are any issues! Just send me send me your child's weight and I'll check it with the doctor 😊");
        modify(patient){setWaitingForAnswer(true)};
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
Just add the `signals` directory in `java` and create the following file:

```java title="java/signals/BMIMeasurement.java"
package signals;

import lombok.Data;
import lombok.NoArgsConstructor;

import com.mindsmiths.sdk.core.api.Signal;


@Data
@NoArgsConstructor
public class BMIMeasurement extends Signal {
    private Integer age;
    private Double weight;
    private Integer height;

    public BMIMeasurement(Integer age, Double weight, Integer height) {
        this.age = age;
        this.weight = weight;
        this.height = height;
    }

    public Double calculateBMI() {
        Double heightMeters = height / 100.0;

        return weight / (heightMeters * heightMeters);
    }
}
```

Your Patient agent can now send the BMI data to the Doctor agent. To keep the problem "two-dimensional" (basing the doctor's decision along two axes: age and BMI), we include the function for BMI calculation in the signal.
So, let's add a rule that sends the data to the Doctor:
```java title="rules/patient/Patient.drl"
...
import signals.BMIMeasurement
import agents.doctor.Doctor
...

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

What happens here is that we receive an updated weight value, build a `BMIMeasurement` signal, and send it to the Doctor.
Since we only have a single Doctor agent in this demo, we can just identify the agent by using the hardcoded static `Doctor.ID`.
Also, notice that we only use the condition `height != null`, so we can use the rule in every case the user sends us their child's weight, regardless of the fact that this variable is already filled with some previous value.

That's it! When the doctor's agent receives the signal from the Patient agent, it can decide what to do with the received data. 
This will be our next step: implementing the processing of the received singal on the Doctor's side.  

For now, you can already run the platform with **forge run** to test out what this entire process looks like for your patients!
