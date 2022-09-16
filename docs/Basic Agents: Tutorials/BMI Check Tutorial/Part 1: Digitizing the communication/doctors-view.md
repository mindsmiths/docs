---
sidebar_position: 7
---

# Doctor's view

Our aim now is closing the interaction loop: we want the doctor to give their opinion on the child’s weight being healthy or not.
To contact the doctor, we’ll add the "Evaluate BMI request" rule to the `Doctor.drl` file. This rule will send the calculated BMI value and age of the child to the doctor's Telegram:

```java title="rules/doctor/Doctor.drl"
...
import com.mindsmiths.telegramAdapter.TelegramKeyboardAnswered
import signals.BMIMeasurement
...
rule "Ask doctor for help with BMI request"
  when
      doctor: Doctor()
      bmiMeasurement: BMIMeasurement() from entry-point "signals"
  then
      doctor.sendBMIMeasurement(bmiMeasurement);
      insert(bmiMeasurement);
end
```

The BMI request the doctor receives will be accompanied by “obese” and “not obese” keyboard options as possible replies. To generate a keyboard, you just add the message and button texts:

```java title="java/agents/Doctor.java"
...
import com.mindsmiths.telegramAdapter.KeyboardData;
import com.mindsmiths.telegramAdapter.KeyboardOption;
import signals.BMIMeasurement;
...
public class Doctor extends Agent {
    ...
    public void sendBMIMeasurement(BMIMeasurement bmi) {
        TelegramAdapterAPI.sendMessage(
                connections.get("telegram"),
                "Can you help me with this case?\n" +
                        String.format("Age: %d\nBMI: %.1f\n", bmi.getAge(), bmi.calculateBMI()),
                new KeyboardData(
                        bmi.getId(),
                        Arrays.asList(
                                new KeyboardOption("YES", "Obese"),
                                new KeyboardOption("NO", "Not obese")
                        )
                )
        );
    }
...
```

To process the doctor’s answer and communicate it back to the patient, we need to add the "Process doctor's BMI answer" rule inside the `Doctor.drl` file:

```java title="rules/doctor/Doctor.drl"
...
import com.mindsmiths.telegramAdapter.TelegramKeyboardAnswered
import signals.BMIResponse
...
rule "Process doctor's response"
   when
       response: TelegramKeyboardAnswered() from entry-point "signals"
       bmi: BMIMeasurement(id == response.referenceId)
       doctor: Doctor()
   then
       boolean isObese = response.getAnswer().equals("YES");
       doctor.send(bmi.getFrom(), new BMIResponse(bmi, isObese));
       doctor.sendMessage("Thanks!");
       delete(response);
 end
```

As we used the keyboard to get the doctor’s evaluation, the type of incoming signal we now expect is `TelegramKeyboardAnswered()`, 
making sure the answer we fetched is matched to a specific request (`BMIMeasurement(id == answer.referenceId)`). 
In the `then` part, we just need to interpret the answer (`answer.getAnswer().equals("YES")`) and send it to the Patient agent we received the initial signal from (`bmi.getFrom()`).

As you can notice, we’re again sending the response to the Patient in the form of a new signal, so let’s define it:

```java title="java/signals/BMIResponse.java"
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

As you can see, the signal contains both the data the patient sent and the doctor's answer.
To finish fully digitizing the patient-doctor communication, all that’s left to do is to process the received reply from the Doctor and send it to the patient.

We are going to write a new rule "BMI request answered" that reacts to the received signal and notifies the patient, updating the time the patient last received a response:
```java title="rules/patient/Patient.drl"
...
import signals.BMIResponse
...
rule "Send BMI response to the patient"
    when
        response: BMIResponse(request: request) from entry-point "signals"
        patient: Patient()
    then
        patient.sendMessage(
            String.format(
                "Your child with its current weight (%.1f kg) is %s",
                request.getWeight(), response.isObese() ? "obese" : "not obese"
            )
        );
        modify(patient) {setLastInteractionTime(new Date())};
        delete(response);
end
```
Notice that in all the rules we wrote, we delete the signal after processing, same as we did before. 

And that’s it, you can now try out the whole communication loop! Just register one user as doctor, and another as a patient, and try creating a couple bmi requests and responses!