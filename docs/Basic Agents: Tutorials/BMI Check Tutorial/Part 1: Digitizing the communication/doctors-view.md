---
sidebar_position: 7
---

# Doctor's view

Our next step is closing the interaction loop: i.e. we want the doctor to give their opinion on the child’s weight being healthy or not.
To contact the doctor, we’ll add the "Evaluate BMI request" rule to the `Doctor.drl` file. This rule will send the calculated BMI value and age of the child:

```java title="rules/doctor/Doctor.drl"
...
rule "Evaluate BMI request"
  when
      doctor: Doctor()
      bmiMeasurement: BMIMeasurement() from entry-point "signals"
  then
      doctor.sendBMIMeasurement(bmiMeasurement);
      insert(bmiMeasurement);
end
```

We’ll implement the sending of the BMI request (sendBMIMeasurement(...)) by adding “obese” and “not obese” keyboard options as possible replies from the doctor:

```java title="agents/doctor/Doctor.java"
...
import java.util.Arrays;

import com.mindsmiths.telegramAdapter.KeyboardData;
import com.mindsmiths.telegramAdapter.KeyboardOption;

import signals.BMIMeasurement;
import signals.Prediction;
...
public class Doctor extends Agent {
    ...
    private Integer modelVersion;
    ...
    public void sendBMIMeasurement(Prediction prediction) {
        BMIMeasurement bmi = prediction.getBmiMeasurement();

        String predictionResult = prediction.getPrediction() ? "obese" : "not obese";

        TelegramAdapterAPI.sendMessage(
                connections.get("telegram"),
                "Can you help me with this case?\n" +
                        String.format("Age: %d\nBMI: %.1f\n", bmi.getAge(), bmi.calculateBMI()),
                new KeyboardData(
                        prediction.getPredictionId(),
                        Arrays.asList(
                                new KeyboardOption("YES", "Obese"),
                                new KeyboardOption("NO", "Not obese")
                        )
                )
        );
    }
}
```

Telegram is really developer-friendly for generating all sorts of forms. To generate a keyboard, you just add the message and button texts.
To process the doctor’s answer and communicate it back to the patient, we need to add the  "Process doctor's BMI answer" rule inside the Doctor.drl file:

```java title="rules/doctor/Doctor.drl"
...
rule "Process doctor's BMI answer"
   when
       answer: TelegramKeyboardAnswered() from entry-point "signals"
       bmi: BMIMeasurement(id == answer.referenceId)
       doctor: Doctor()
   then
       boolean isObese = answer.getAnswer().equals("YES");
       doctor.send(bmi.getFrom(), new BMIResponse(bmi, isObese));
       doctor.sendMessage("Thanks!");
       delete(answer);
 end
```

As we used the keyboard to get the doctor’s evaluation, the type of incoming signal we now expect is `TelegramKeyboardAnswered()`, making sure the answer we fetched is matched to a specific request (`BMIMeasurement(id == answer.referenceId)`). In the `then` part, we just need to interpret the answer (`answer.getAnswer().equals("YES")`) and send it to the Patient agent we received the initial signal from (`bmi.getFrom()`).

As you can notice, we’re sending the response to the Patient in the form of a new signal, so let’s define it:

```java title="models/signals/BMIResponse.java"
package signals;

import lombok.*;

import com.mindsmiths.sdk.core.api.Signal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BMIResponse extends Signal {
    private BMIMeasurement request;
    private boolean isObese;
}
```

To finish fully digitizing the patient-doctor communication, all that’s left to do is to process the received reply from the Doctor and send it to the patient. We are going to write a new rule "BMI request answered" that reacts to the received signal and notifies the patient, updating the time the patient last received a response:
```java title="rules/patient/Patient.drl"
...
import signals.BMIResponse
...
rule "BMI request answered"
    when
        res: BMIResponse(req: request) from entry-point "signals"
        patient: Patient()
    then
        patient.sendMessage(
            String.format(
                "Your child with its current weight (%.1f kg) is %s",
                req.getWeight(), res.isObese() ? "obese" : "not obese"
            )
        );
        modify(patient) {setLastInteractionTime(new Date())};
        delete(res);
end
```
That’s it, you can now try the whole loop! Register one user as doctor, and another as a patient, and try creating a couple interactions!