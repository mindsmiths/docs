---
sidebar_position: 4
---

# Personalized approach: I know you

Context is extremely important in relationships with the users: to avoid scripting out the system behavior into fixed scenarios, 
you always want your system to know exactly who the person they are talking to is, what are some relevant aspects of previous interactions and what is the current context of their needs.

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
Notice that the first two rules react to the same message: since the welcome rule doesn't delete the Telegram message signal, the rule asking for the name fires as well. We ensure this order by setting a higher salience for the welcome rule.

The implementation is extremely simple. All onboarding rules follow the same pattern as the one for setting the name: we ask about the information we need in order, setting the `waitingForAnswer` flag to true, and set the value when we receive an answer.
After filling in the child's name, age and height in turn, we send an overview:

```java title="rules/patient/Patient.drl"
rule "Summarize patient data"
    when
        patient: Patient(waitingForAnswer == false, height != null, weight == null)
    then
        patient.sendMessage(
                String.format("So, your %s is %d years old and %d cm tall.", patient.getName(), patient.getAge(),
                patient.getHeight())
        );
end
```
We now need to ask for the child's current weight. We fill this information in the same way as the previously: 


```java title="rules/patient/Patient.drl"
rule "Ask for weight"
    when
        patient: Patient(waitingForAnswer == false, height != null, weight == null)
    then
        patient.sendMessage("We can track your kid's weight together to see if there are any issues. Send me your kid's weight.");
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

Just the amount of code might seem intimidating, but the logic of the rules is very simple: based on the data we currently have about the user, we ask the next question for the data we still need to fill.
But let’s start from the top! There are a couple of important things to note here.
First, let’s look at the first three rules in the onboarding process. Notice that after executing the `"Welcome patient"` rule we don’t delete the incoming message signal that triggered it: instead, we use the same signal again to trigger the `"Ask for name"` rule, in which we prompt the user to submit their child’s name.
This kind of connecting up the rules is actually just multiple rules fireing, some sooner than the others (acording to the `salience` index). To ensure the welcome rule fires first, we set its `salience` to 100 (as opposed to the default value 0), and then we delete the message signal later on after the `"Ask for name"` rule is executed.
Next, to better specify the context the user is currently in, we add the `waitingForAnswer` flag, to distinguish between the conditions of the rules where we ask for the name and where we got the answer back from the user.
This is the mechanism you can now see in the remaining rules as well: the rules for filling in the data are always triggered by the facts we have stored in memory (the data about the child), while the rules that modify the data are triggered on receiving the message signal. The “ask” and “set” rules are connected via these current facts: once we know the child’s name, but don’t know his/her age, we need to ask the user to tell us that next. And so on until we acquire all the necessary information (name, age, and height).

Let’s have a look at how these things look like inside the Patient agent’s data model:
models/agents/Patient.java

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
