---
sidebar_position: 7
---

# Going places

You can also redirect the user to another location through a link on an Armory screen.
For example, after finishing the onboarding process, Felix redirects the user to the Discord server.
Just use the hyperlink notation: `<a href='link_placeholder'>text_placeholder</a>` and add the hyperlink where you want, 
in this case it should be on the last screen in `showSurveyScreens()` in `Felix.java` file:

```java title="java/agents/Felix.java"

package agents;

...

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
                        new PrimarySubmitButtonComponent("yes", "Hell yeah!", "workoutFrequency"),
                        new PrimarySubmitButtonComponent("no", "No, but I am planning...", "chooseDays"))
                        )),
                "workoutFrequency", new TemplateGenerator ("workoutFrequency")
                        .addComponent("title", new TitleComponent("How many days a week?"))
                        .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("rarely", "1-2", "chooseDays"),
                        new PrimarySubmitButtonComponent("sometimes", "3-4", "chooseDays"),
                        new PrimarySubmitButtonComponent("often", "5 or more", "chooseDays"))
                        )),
                "chooseDays", new TemplateGenerator ("chooseDays")
                        .addComponent("title", new TitleComponent(String.format("Okay %s , we are one step away! Choose the days that you are available for workout?", name)))
                        .addComponent("buttons", new CloudSelectComponent("buttons", Map.of("MON", "mon", "TUE", "tue", "WED", "wed", "THU", "thu", "FRI", "fri")))
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
                        .addComponent("description", new DescriptionComponent("To join our workout group on Discord, follow this <a href='https://discord.com/invite/mindsmiths'>link</a> !"))
                        );
        showScreens("waterIntake", screens);
    }
    ...
}
```


In the end, we'll just add the ThanksScreen that will appear after if user refreshes the web site after finishing the flow.

```java title="java/agents/Felix.java"

package agetns;

...

import com.mindsmiths.armory.template.TitleTemplate;

...

@Data
@NoArgsConstructor
public class Felix extends Agent {
    public void showThanksScreen() {
        showScreen(new TitleTemplate(String.format("Thanks, %s, you are the best!", name)));
    }
}
```


```java title="java/agents/Felix.drl"

rule "Show screen on refresh after onboarding"
    salience -10
    when
        signal: UserConnectedEvent() from entry-point "signals"
        agent: Felix()
    then
        agent.showThanksScreen();
        delete(signal);
end
```

That's it, `forge run` and you're ready for building screens and creating flows autonomously. Have fun!