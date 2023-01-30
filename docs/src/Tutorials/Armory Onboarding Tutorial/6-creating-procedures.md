---
sidebar_position: 6
---

# Adding the survey

Ok, now when we have the onboarding in place, we can add the survey screens! There are no new concepts to grasp in this section - so feel free to play around with the code and build up your own survey experience using different components.

You might be wondering what the advantage would be for separating out the different sequences of screens, instead of chaining them all together.

Please consider that you might not always want to use screen chains that are strictly predefined. Sometimes you want more flexibility in allowing the system to determine which screen (sequence) to show next to the user, depending on the state the user is in. 
When the screen to show is determined based on other circumstances, and not just the previous screen and pressed button, you can define these specific behaviors through rules.

```java title="agents/Felix.java"
import com.mindsmiths.armory.component.CloudSelect;
import com.mindsmiths.armory.component.Description;
import com.mindsmiths.armory.component.Group;
...

@Data
@NoArgsConstructor
public class Felix extends Agent {
    public void showSurveyScreens() {
        ArmoryAPI.show(
                getConnection("armory"),
                new Screen("workoutQuestion")
                        .add(new Title("Do you workout?"))
                        .group("buttons")
                        .add(new SubmitButton("submityes", "Hell yeah!", "workoutFrequency"))
                        .add(new SubmitButton("submitno", "Not yet", "chooseDays")),
                new Screen("workoutFrequency")
                        .add(new Title("How many days a week?"))
                        .group("buttons")
                        .add(new SubmitButton("rarely", "1-2", "chooseDays"))
                        .add(new SubmitButton("sometimes", "3-4", "chooseDays"))
                        .add(new SubmitButton("often", "5 or more", "chooseDays")),
                new Screen("chooseDays")
                        .add(new Title(String.format("Okay %s, we are one step away! Choose the days that you are available for a workout?", name)))
                        .add(new CloudSelect("cloud-select").addOption("Monday", "Monday").addOption("Tuesday", "Tuesday").addOption("Wednesday", "Wednesday").addOption("Thursday","Thursday").addOption("Friday", "Friday").addOption("Saturday", "Saturday").addOption("Sunday","Sunday"))
                        .add(new SubmitButton("daysChoosen", "Go on!", "rewardScreen")),
                new Screen("rewardScreen")
                        .add(new Title(String.format("Thank you %s for taking the time to talk to me! I will create your plan in a few moments!", name)))
                        .add(new SubmitButton("buttonPressed", "Cool!", "surveyCompleted"))
        );
    }
}
```

Let's also add the rule to activate these screens:

```java title="rules/felix/Felix.drl"
rule "Start survey"
    when
        signal: Submit(getParamAsString("buttonPressed") == "finishOnboarding") from entry-point "signals"
        agent: Felix()
    then
        modify(agent){
            setWeight (signal.getParamAsInteger("weight")),
            setHeight (signal.getParamAsInteger("height"))
        };
        agent.showSurveyScreens();
        delete (signal);
end
```

Perfect, have fun toying around!