---
sidebar_position: 6
---

# Adding the survey

Ok, now when we have the onboarding in place, we can add the survey screens! There are no new concepts to grasp in this section - so feel free to play around with the code and build up your own survey experience using different components.

You might be wondering what the advantage would be for separating out the different sequences of screens, instead of chaining them all together.

Please consider that you might not always want to use screen chains that are strictly predefined. Sometimes you want more flexibility in allowing the system to determine which screen (sequence) to show next to the user, depending on the state the user is in. 
When the screen to show is determined based on other circumstances, and not just the previous screen and pressed button, you can define these specific behaviors through rules.

You'll notice that two of the newly added components look slightly different: the `ActionGroupComponent` comprises a list of buttons (`PrimarySubmitButtonComponent`) that you saw on previous screens. This means that these buttons form a group, and in principle you can only pick one of them. The other component we want to turn your attention to is the `CloudSelectComponent`, which is basically a map of multiple options you can select. Since in our particular case we care about the order in which these options appear, we fixate their order by using a Linked HashMap.

As always, check out our docs for more insights on the components and their syntax!
```java title="rules/felix/Felix.java"
...
import java.util.List;
...
import com.mindsmiths.armory.component.ActionGroupComponent;
import com.mindsmiths.armory.component.DescriptionComponent;
import com.mindsmiths.armory.component.CloudSelectComponent;


@Data
@NoArgsConstructor
public class Felix extends Agent {
    public void showSurveyScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "waterIntake", new TemplateGenerator ("waterIntake")
                        .addComponent("title", new TitleComponent("How much water do you drink a day?"))
                        .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("submit3", "1-3 glasses", "workoutQuestion"),
                        new PrimarySubmitButtonComponent("submit4", "5-6 glasses...", "workoutQuestion"),
                        new PrimarySubmitButtonComponent("submit5", "8 glasess or more...", "workoutQuestion"))
                        )),
                "workoutQuestion", new TemplateGenerator ("workoutQuestion")
                        .addComponent("title", new TitleComponent("Do you workout?"))
                        .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("submityes", "Hell yeah!", "workoutFrequency"),
                        new PrimarySubmitButtonComponent("submitno", "No, but I am planning...", "chooseDays"))
                        )),
                "workoutFrequency", new TemplateGenerator ("workoutFrequency")
                        .addComponent("title", new TitleComponent("How many days a week?"))
                        .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("rarely", "1-2", "chooseDays"),
                        new PrimarySubmitButtonComponent("sometimes", "3-4", "chooseDays"),
                        new PrimarySubmitButtonComponent("often", "5 or more", "chooseDays"))
                        )),
                "chooseDays", new TemplateGenerator ("chooseDays")
                        .addComponent("title", new TitleComponent(String.format("Okay %s, we are one step away! Choose the days that you are available for workout?", name)))
                        .addComponent("buttons", new CloudSelectComponent("buttons", new LinkedMap<String, String>().putall("MON", "mon", "TUE", "tue", "WED", "wed", "THU", "thu", "FRI", "fri")))
                        .addComponent("submitDays", new PrimarySubmitButtonComponent("submitDays", "Submit", "askMail"
                        )),
                "askMail", new TemplateGenerator("askMail")
                        .addComponent("title", new TitleComponent("We are done! I am going to send this info to our experts, and one of them will contact you as soon as possible! Just write down your email and we’ll be right on it!"))
                        .addComponent("mail", new InputComponent("mail", "Write your mail here", "mail", true))
                        .addComponent("submitMail", new PrimarySubmitButtonComponent("submitMail", "Submit", "rewardScreen"
                        )),
                "rewardScreen", new TemplateGenerator("rewardScreen")
                        .addComponent("title", new TitleComponent(String.format("Thank you %s for taking your time to talk to me! You earned your first apple! 🍎 Now you’re in the apple league and you gained access to various workout tips for beginners!", name)))
                        .addComponent("submitReward", new PrimarySubmitButtonComponent("submitReward", "Thanks", "endScreen"
                        )),
                "endScreen", new TemplateGenerator("endScreen")
                        .addComponent("title", new TitleComponent("You are the best!💙"))
                        .addComponent("description", new DescriptionComponent("To join our workout group on Discord, here is a link!"))
                        );
        showScreens("waterIntake", screens);
    }
    
    public void showThanksScreen() {
        showScreen(new TitleTemplate(String.format("Thanks, %s, you are the best!", name)));
    }
}
```

To round off the experience, we also added a thanks screen that we can display once we have all the information we need.
Let's also add the rules for these screens:

```java title="rules/felix/Felix.drl"
...
rule "Start survey"
   when
        signal: SubmitEvent(getParamAsString("submitHeight") == "completed") from entry-point "signals"
        agent: Felix()
   then
        modify(agent) {
            setAge(signal.getParamAsString("age")),
            setWeight(signal.getParamAsString("weight")),
            setHeight(signal.getParamAsString("height")),
            setOnboardingStage("ONBOARDED")
        };
            agent.showSurveyScreens();
            delete (signal);
end

rule "Show thank you screen"
    salience -10
    when
        signal: UserConnectedEvent() from entry-point "signals"
        agent: Felix()
    then
        agent.showThanksScreen();
        delete(signal);
end
```

Perfect, have fun toying around!
Now that you mastered building and chaining different kinds of screens, we can focus a bit more on customizing the screen layout.