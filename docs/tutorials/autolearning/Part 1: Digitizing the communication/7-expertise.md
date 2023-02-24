---
sidebar_position: 6
---

# Building trust: I have the expertise

Personalization and proactivity are immensely important, but they are just support mechanisms for improving the user experience. 
The core functionality is still getting the patient the expert opinion on the question whether their child has obesity issues or not.

Here is where you jump in! We’ll  start with implementing the rules needed for setting up the communication between the patient and the doctor.
We start from defining the signal for passing the relevant information between the agents. You can think of signals as a sort of a package containing certain data that our Patient agent sends to the Doctor agent, so it can pass this data on to the doctor user.

We create a new file java/signals/BMIMeasurement.java and paste in the following:

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

As you can see, BMIMeasurement is a type of signal that contains the data on a child’s age, height and weight, and the calculateBMI() function that calculates BMI without taking age into account.

We now need to write the Patient agent’s rule for sending this signal to the Doctor:

```java title="rules/patient/Patient.drl"
...
import agents.doctor.Doctor
import signals.BMIMeasurement
...

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

Same as before, the rule contains the verification that the received number is a valid weight value, otherwise the "Unrecognizable message" rule will ask the user for a different input.
The only other condition that needs to be satisfied is that the `height` variable is already filled in, so we are sure we’re in the context where we’re expecting to receive a weight value.
It is actually the then part of the rule that is more interesting to us: there we create a new `BMIMeasurement` signal and fill it in with the necessary data (age, height and weight).
In the next line we then send the signal to the agent with the Doctor id.

The rest of the rule is again more familiar to you: we send a "thank you" message to our user, 
and use modify to memorize the child’s current `weight`, set the `lastInteractionTime` to the current time and enable proactive engagement by setting the `waitingForAnswer` flag to false. 
After that, we delete the received message with the child’s weight.

