---
sidebar_position: 8
---

# Doctor's view

Our aim now is closing the interaction loop: we want the doctor to give their opinion on the child’s weight being healthy or not.
To contact the doctor, we’ll add the "Evaluate BMI request" rule to the `Doctor.drl` file. This rule will send the calculated BMI value and age of the child to the doctor's Telegram:

```java title="rules/doctor/Doctor.drl"
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
import com.mindsmiths.telegramAdapter.KeyboardData;
import com.mindsmiths.telegramAdapter.KeyboardOption;
import signals.BMIMeasurement;

@Getter
@Setter
public class Doctor extends Agent {

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
        )
    }
}

```

To process the doctor’s answer and communicate it back to the patient, we need to add the "Process doctor's BMI answer" rule inside the `Doctor.drl` file:

```java title="rules/doctor/Doctor.drl"
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

As you can notice, we’re again sending the response to the Patient in the form of a new signal, so let’s define it:

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

And finally, let's add a rule for sending doctor's answer to the patient.

```java title="rules/doctor/Doctor.drl"
rule "Send answer to the patient"
    when
        Heartbeat(now: timestamp) from entry-point "signals"
        signal: BMIResponse(measurement: request, response: isObese()) from entry-point "signals"
        agent: Patient()
    then
        agent.sendMessage(
            String.format(
                "Your child with its current weight (%.1f kg) is %s",
                measurement.getWeight(), response ? "obese" : "not obese"
            )
        );
        modify(agent) {setLastInteractionTime(now)};
        delete(signal);
end
```