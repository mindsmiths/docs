---
sidebar_position: 9
---

# Doctor's view

Our aim now is closing the interaction loop: we want the doctor to give their opinion on the child’s weight being healthy or not.
To contact the doctor, we’ll add the "Evaluate BMI request" rule to the `Doctor.drl` file. This rule will send the calculated BMI value and age of the child to the doctor's Telegram:

```java title="rules/doctor/Doctor.drl"
import signals.BMIMeasurement

...

rule "Ask doctor for opinion on BMI"
  when
      signal: BMIMeasurement() from entry-point "signals"
      agent: Doctor()
  then
      agent.sendBMIMeasurement(signal);
      insert(signal);
end
```

The BMI request the doctor receives will be accompanied by “obese” and “not obese” keyboard options as possible replies. To generate a keyboard, you just add the message and button texts:

```java title="java/agents/Doctor.java"
import com.mindsmiths.telegramAdapter.api.KeyboardData;
import com.mindsmiths.telegramAdapter.api.KeyboardOption;
import signals.BMIMeasurement;

import java.util.Arrays;

@Getter
@Setter
public class Doctor extends Agent {
    
public double calculateBMI(int height, double weight) {
        return weight / (height * height);
    }

public void sendBMIMeasurement(BMIMeasurement bmi) {
        TelegramAdapterAPI.sendMessage(
                getConnection("telegram"),
                "Can you help me with this case?\n" +
                        String.format("Age: %d\nBMI: %.1f\n",
                                bmi.getAge(), this.calculateBMI(bmi.getHeight(), bmi.getWeight())),
                new KeyboardData(
                        bmi.getId(),
                        Arrays.asList(
                                new KeyboardOption("YES", "Obese"),
                                new KeyboardOption("NO", "Not obese")
                        )
                )
        );
    }
}

```

As we used the keyboard to get the doctor’s evaluation, the type of incoming signal we now expect is `TelegramKeyboardAnswered()`, 
making sure the answer we fetched is matched to a specific request `BMIMeasurement(id == answer.referenceId)`. In the then part, 
we just need to interpret the answer `answer.getAnswer().equals("YES")` and send it to the Patient agent we received the initial signal from as `bmi.getFrom()`.

```java title="java/signals/BMIResponse.java"
package signals;

import lombok.*;

import com.mindsmiths.sdk.core.api.Message;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BMIResponse extends Message {
    private BMIMeasurement request;
    private boolean isObese;
}
```

To process the doctor’s answer and communicate it back to the patient, we need to add the "Process doctor's BMI answer" rule inside the `Doctor.drl` file:

```java title="rules/doctor/Doctor.drl"
...

import com.mindsmiths.telegramAdapter.events.TelegramKeyboardAnswered
import signals.BMIResponse

...

rule "Process doctor's answer"
   when
       signal: TelegramKeyboardAnswered(answer: answer, requestId: referenceId) from entry-point "signals"
       measurement: BMIMeasurement(id == requestId, patientId: getFrom())
       agent: Doctor()
   then
       boolean isObese = answer.equals("YES");
       agent.send(patientId, new BMIResponse(measurement, isObese));
       agent.sendMessage("Thanks!");
       delete(signal);
 end
```

As you can see, the signal contains both the data the patient sent and the doctor's answer. To finish fully digitizing the patient-doctor communication, 
all that’s left to do is to process the received reply from the Doctor and send it to the patient.

We are going to write a new rule "BMI request answered" that reacts to the received signal and notifies the patient, updating the time the patient last received a response:

```java title="rules/patient/Patient.drl"
...
        
import signals.BMIResponse
        
...

rule "Send answer to the patient"
    when
        Heartbeat(now: timestamp) from entry-point "signals"
        signal: BMIResponse(measurement: request, response: isObese()) from entry-point "signals"
        agent: Patient()
    then
        agent.sendMessage(
            String.format(
                "Your child with its current weight (%.1f kg) is %s.",
                measurement.getWeight(), response ? "obese" : "not obese"
            )
        );
        modify(agent) {setLastInteractionTime(now)};
        delete(signal);
end
```

Notice that in all the rules we wrote, we delete the signal after processing, same as we did before.

And that’s it, you can now try out the whole communication loop! 
Just register one user as doctor, and another as a patient, and try creating a couple BMI requests and responses!