---
sidebar_position: 6
---

# Adding the survey

Ok, now when we have the onboarding in place, we can add the survey screens! There are no new concepts to grasp in this section - so feel free to play around with the code and build up your own survey experience using different components.

```java title="java/agents/Felix.java"
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Felix extends Agent {
    String name;
    Integer weight;
    Integer height;

    ...

    // highlight-added-start
    public void showSurveyScreens() {
        ArmoryAPI.show(
                getConnection("armory"),
                new Screen("workoutQuestion")
                        .add(new Title("Do you workout?"))
                        .add(new SubmitButton("workoutYes", "Hell yeah!", "workoutFrequency"))
                        .add(new SubmitButton("workoutNo", "Not yet", "chooseDays")),
                new Screen("workoutFrequency")
                        .add(new Title("How many days a week?"))
                        .add(new SubmitButton("workoutRarely", "1-2", "chooseDays"))
                        .add(new SubmitButton("workoutSometimes", "3-4", "chooseDays"))
                        .add(new SubmitButton("workoutOften", "5 or more", "chooseDays")),
                new Screen("chooseDays")
                        .add(new Title(String.format("Okay %s, we are one step away! Choose the days that you are available for a workout?", name)))
                        .add(new CloudSelect("cloud-select").addOption("Monday", "Monday").addOption("Tuesday", "Tuesday").addOption("Wednesday", "Wednesday").addOption("Thursday","Thursday").addOption("Friday", "Friday").addOption("Saturday", "Saturday").addOption("Sunday","Sunday"))
                        .add(new SubmitButton("daysChoosen", "Go on!", "rewardScreen")),
                new Screen("rewardScreen")
                        .add(new Title(String.format("Thank you %s for taking your time to talk to me! I will generate your plan in a few moments!", name)))
                        .add(new SubmitButton("surveyCompleted", "Cool!"))
        );
    }
    // highlight-added-end
}
```

You might be wondering what is the advantage of separating out the different sequences of screens, instead of chaining them all together.
Please consider that you might not always want to use screen chains that are strictly predefined. Sometimes you want more flexibility in allowing the system to determine which screen (sequence) to show next to the user, depending on the state the user is in. 
When the screen to show is determined based on other circumstances, and not just the previous screen and pressed button, you can define these specific behaviors through rules.

Let's add the rule to activate `Start survey` screens:

```java title="rules/felix/Felix.drl"
...

// highlight-added-start
rule "Start survey"
    when
        signal: Submit(buttonId == "heightSubmitted") from entry-point "signals"
        agent: Felix()
    then
        modify(agent){
            setWeight (signal.getParamAsInteger("weight")),
            setHeight (signal.getParamAsInteger("height"))
        };
        agent.showSurveyScreens();
        delete (signal);
end
// highlight-added-end
```

Perfect, have fun toying around!