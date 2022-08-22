---
sidebar_position: 4
---

# Personalized approach: I know you

Context is extremely important in relationships with users: to avoid scripting out the system behavior into fixed scenarios, 
you always want your system to know exactly who the person they are talking to is, what some relevant aspects of previous interactions are and what the current context of their needs is.

In the first step, this simply means giving the agent sufficient information on the user they are assigned to by defining a series of onboarding rules.
In this demo, the user is keeping track of their child’s weight, so we only want them to send us the updated weight values. We’ll simply store some other relevant data, i.e. the child’s name, height and age, right in the beginning when the user registers.


Let’s have a look!

We start from welcoming the user and asking for the name of the child whose health they want to keep track of:
```java title="rules/patient/Patient.drl"
rule "Welcome message"
    salience 100
    when
        initialize: Initialize() from entry-point "agent-created"
        message: TelegramReceivedMessage() from entry-point "signals"
        patient: Patient()
    then
        patient.sendMessage("Welcome to the Clinic!");
        delete(initialize);
end

////////////////////////// Getting child name //////////////////////////
rule "Ask for name"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        patient: Patient(waitingForAnswer != true, name == null)
    then
        patient.sendMessage("What's the name of the child whose weight you would like to check?");
        modify(patient) {setWaitingForAnswer(true)};
        delete(message);
end

rule "Set name"
    when
        message: TelegramReceivedMessage(text: text, !NumberUtils.isParsable(text)) from entry-point "signals"
        patient: Patient(waitingForAnswer == true, name == null)
    then
        modify(patient) {setWaitingForAnswer(false), setName(text)};
        delete(message);
end
```
What these rules will do is welcome the user when they send the first message, and ask them to send the name of the child whose weight they are checking.
Notice that the first two rules react to the same message: since the welcome rule doesn't delete the incoming Telegram message signal, the rule asking for the name fires as well. We ensure this order by setting a higher salience for the welcome rule.

The implementation is extremely simple. All onboarding rules follow the same pattern as the one for setting the name: we ask about the information we need in order, setting the `waitingForAnswer` flag to `true`, and then set the value of the variable when we receive an answer:

```java title="rules/patient/Patient.drl"
rule "Ask for age"
    when
        patient: Patient(waitingForAnswer != true, name != null, age == null)
    then
        patient.sendMessage(
                String.format("Lovely, how old is %s?", patient.getName())
        );
        modify(patient) {setWaitingForAnswer(true)};
end

rule "Set age"
    when
        message: TelegramReceivedMessage(text: text, BMIUtils.isValidAge(text)) from entry-point "signals"
        patient: Patient(waitingForAnswer == true, name!= null, age == null)
    then
        modify(patient) {setWaitingForAnswer(false), setAge(Integer.parseInt(text))};
        delete(message);
end

rule "Ask for height"
    when
        patient: Patient(waitingForAnswer != true, age != null, height == null)
    then
        patient.sendMessage(
                String.format("And how tall is %s in cm?", patient.getName())
        );
        modify(patient) {setWaitingForAnswer(true)};
end

rule "Set height"
    when
        message: TelegramReceivedMessage(text: text, BMIUtils.isValidHeight(text)) from entry-point "signals"
        patient: Patient(waitingForAnswer == true, age != null, height == null)
    then
        modify(patient) {setWaitingForAnswer(false), setHeight(Integer.parseInt(text))};
        delete(message);
end
```
 
This completes the onboarding process for our patients. We send the user an overview with all the data:

```java title="rules/patient/Patient.drl"
rule "Summarize patient data"
    when
        patient: Patient(waitingForAnswer == false, height != null, weight == null)
    then
        patient.sendMessage(
                String.format("So, your %s is %d years old and %d cm tall.", 
                    patient.getName(), 
                    patient.getAge(),
                    patient.getHeight()
                )
        );
end
```
Finally, let's have a look at what this looks like inside the patient's data model:

```java title="rules/patient/Patient.java"
...
public class Patient extends Agent {
    private String name;
    private Integer age;
    private Integer height;
    …
    private boolean waitingForAnswer;
    …

    public Patient(String connectionName, String connectionId) {
        super(connectionName, connectionId);
    }

    public void sendMessage(String text) {
        String chatId = connections.get("telegram");
        TelegramAdapterAPI.sendMessage(chatId, text);
    }
    …
}
```
These parts should also look familiar to you from the first tutorial. We've now set some very basic context with which the agent can show it knows the patient.
Great! Now it's time to start implementing


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
            setAttemptedEngagement(false)
            };
        delete(message);
end
```
Before we turn to the 
The first rule is fairly simple, but let's dig into the second one for a bit.

First, notice that in the `"Process weight"` rule, we only use the condition `height != null` on the Patient agent. This way we can reuse the rule in every subsequent case the user sends us their child's weight, when this variable is already filled with some previous value. That's why we also set some additional things we haven't encountered in onboarding when modifying the agent (`lastInteractionTime` and `attemptedEngagement`). We'll get back to these variables in the Engagement section.

But let's 


The contents of the Patient Java file are again nothing new: it just specifies all the fields you need to fill and implements the functionality for sending Telegram messages.

Last thing to bring your attention to is the Utils for checking the validity of the answer received from the user in a given context. We only implemented the simplest functionalities, but you can imagine extending them in more complex scenarios:
models/utils/Utils.java

```java title="models/utils/BMIUtils.java"
package utils;

public class Utils {
    public static int getWeightForHeightAndBMI(int height, double bmi) {
        double height_m = height / 100.;
        return (int) Math.round(bmi * height_m * height_m);
    }

    public static boolean isValidAge(String strAge) {
        if (isNumeric(strAge)) {
            Integer age = Integer.parseInt(strAge);
            return (age > 1 && age <= 15);
        }
        return false;
    }

    public static boolean isValidHeight(String strHeight) {
        if (isNumeric(strHeight)) {
            Integer height = Integer.parseInt(strHeight);
            return (height >= 30 && height <= 230);
         }
        return false;
    }

    public static boolean isValidWeight(String strWeight) {
        if (isNumeric(strWeight)) {
            Double weight = Double.parseDouble(strWeight);
            return (weight >= 5 && weight <= 300);
        }
        return false;
    }
```

Okay, you can now run the platform with **forge run** to test out what this process looks like for your user!
