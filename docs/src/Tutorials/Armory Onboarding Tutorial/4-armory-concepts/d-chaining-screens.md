---
sidebar_position: 4
---

# Chaining Armory screens

As you can see, you can create screens really quickly with Armory's smart defaults! 
But to create a real web-app experience, you usually want to create a sequence of linked screens the user can switch between.

We'll now show you how to do just that: we'll add a function that shows multiple screens, specifying the transitions between them. 
To tell Armory which screen to switch to, just specify the name of the next screen as the value of the action component that leads to it (such as a button). 
For example, in the code below, the “Cool, let's go!” button at the bottom of the `welcome` screen leads to the screen on which we ask the user for their name (i.e. the `askForName` screen):


```java title="java/agents/Felix.java"

@Data
@NoArgsConstructor
public class Felix extends Agent {
    String name;
    String onboardingStage = "START";

    public void showStartScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator ("welcome")      
                .addComponent("title", new TitleComponent("Hello! I’m Felix and I’m here to help you find the best workout plan for you. Ready?"))
                .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                "askForName", new TemplateGenerator("askForName")
                        .addComponent("title", new TitleComponent("Okay, first, tell me your name? :)"))
                        .addComponent("name", new InputComponent("name", "Type your name here", true))
                        .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "end")));
        showScreens("welcome", screens);
    }
}
```
As you can see, all screens defined within the `showStartScreens()` function are shown to the user as part of a single procedure. This means that there is no need to define any business logic in the rule engine to handle transitions between screens.

The data the user inputs during the screen sequence are transferred as values of `GET` parameters with the corresponding `componentId` as key.
We can store the user's answers at the end of the procedure: for example, here we only asked for the name which the user sets through an input area, so we can fetch it off the `SubmitEvent` using `getParamAsString("name")`, because `name` is the id of the text input component.

Keep in mind that you might not always want to use predefined sequences of screens: sometimes you want more flexibility in allowing the system to determine which screen to show to the user depending on the state the user is in. 
When the screen to show is determined based on other circumstances and not just the fact which screen the user was on, and which button was pressed, you can define this behavior through a rule.

With armory, you can define multiple screen chains for different stages of onboarding easily. This can be beneficial if you want to store some data separately. 

Here you can see that during the `startScreens` sequence we asked the user for a name, and stored it after the procedure was completed. 
Now, we can easily use it in other screens, to add a bit of personalization to the user experience.

Let's add the code for user onboarding in agent's Java class:

```java title="java/agents/Felix.java"

package agents;

...

import com.mindsmiths.armory.component.InputComponent;
import com.mindsmiths.armory.component.HeaderComponent;

...

@Data
@NoArgsConstructor
public class Felix extends Agent {
    String name;
    String age;
    String onboardingStage = "START";
    String weight;
    String height;

    public void showStartScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator ("welcome")      
                .addComponent("title", new TitleComponent("Hello! I’m Felix and I’m here to help you find the best workout plan for you. Ready?"))
                .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                "askForName", new TemplateGenerator("askForName")
                        .addComponent("title", new TitleComponent("Okay, first, tell me your name? :)"))
                        .addComponent("name", new InputComponent("name", "Type your name here", true))
                        .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "done")));
        showScreens("welcome", screens);
    }
    
    public void showOnboardingScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "startOnboarding", new TemplateGenerator ("startOnboarding")
                        .addComponent("title", new TitleComponent(String.format("Nice to meet you %s ! Now, to make the best workout plan only for you, I have a few questions, ready?", name)))
                        .addComponent("submitOnboarding", new PrimarySubmitButtonComponent("submitOnboarding", "Let's go!", "askForAge")),
                "askForAge", new TemplateGenerator("askForAge")      
                        .addComponent("title", new TitleComponent("How old are you?"))
                        .addComponent("age", new InputComponent("age", "Choose the age you would like to be", "age", true))
                        .addComponent("submitAge", new PrimarySubmitButtonComponent("submitAge", "Next", "askForWeight")),
                "askForWeight", new TemplateGenerator ("askForWeight")
                        .addComponent("header", new HeaderComponent(null, true))
                        .addComponent("title", new TitleComponent("How much do you weigh in kilograms?"))
                        .addComponent("weight", new InputComponent("weight", "Type your weight here", true))
                        .addComponent("submitWeight", new PrimarySubmitButtonComponent("submitWeight", "Next!", "askForHeight")),
                "askForHeight", new TemplateGenerator ("askForHeight")
                        .addComponent("header", new HeaderComponent(null, true))        
                        .addComponent("title", new TitleComponent("How tall are you in cm?"))
                        .addComponent("height", new InputComponent("height", "Type your height here", true))
                        .addComponent("submitHeight", new PrimarySubmitButtonComponent("submitHeight", "Next!", "done")));
        showScreens("startOnboarding", screens);
    }
}
```

Here you can see that we are using the user name to refrence them in the start of onboarding flow.
You'll also notice that we added a bunch of fields to our class, to store the data the user inputs on onboarding screens. The data we'll process are age, weight and height. 
Let's see how it looks in the rules:

```java title="rules/felix/Felix.drl"

...

import com.mindsmiths.armory.event.SubmitEvent

...

rule "Start user onboarding"
   when
        signal: SubmitEvent(getParamAsString("submitName") == "next") from entry-point "signals"
        
        agent: Felix()
   then
        modify(agent) {
            setName(signal.getParamAsString("name")),
            setOnboardingStage("ONBOARDING")
        };
        agent.showOnboardingScreens();
        delete(signal);
end
```

Ok, now when we did the onboarding successfully, we can add survey screens! Here we'll use 3 new components: `DescriptionComponent`, `CloudSelectComponent` and `ActionGroupComponent`. 
When it comes to `CloudSelectComponent` and `ActionGroupComponent`, you can't just add them to the method, you need to make list of options first.
For `CloudSelectComponent` the logic goes like this: first you define the name of the list (in our case "buttons"). After that you just choose the ID and the text each button will contain.
You can see how it should look in the code bellow. 
For `ActionGroupComponent`, you just need to create a list of PrimarySubmitButtonComponents, which you define as usual (see the code bellow).

```java title="rules/felix/Felix.java"

package agents;

...
import com.mindsmiths.armory.component.ActionGroupComponent;
import com.mindsmiths.armory.component.DescriptionComponent;
import com.mindsmiths.armory.component.CloudSelectComponent;

import java.util.List;
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
                        .addComponent("description", new DescriptionComponent("To join our workout group on Discord, here is a link!"))
                        );
        showScreens("waterIntake", screens);
    }
}
```

```java title="rules/felix/Felix.drl"

rule "Start survey"
   when
        signal: SubmitEvent(getParamAsString("submitHeight") == "done") from entry-point "signals"
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
```

Perfect, now that you mastered building and chaining different kinds of screens, we can focus a bit more on customizing the screen layout.