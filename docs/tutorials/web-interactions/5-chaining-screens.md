---
sidebar_position: 5
---

# Chaining screens

As you can see, you can create screens really quickly with Armory's smart defaults! 
But to create a real web-app experience, you usually want to create a sequence of linked screens the user can switch between.

We'll now show you how to do just that: we'll add a function that shows multiple screens, specifying the transitions between them. 
To tell Armory which screen to switch to, just specify the name of the next screen as the value of the action component that leads to it (such as a button). 
For example, in the code below, the “Cool, let's go!” button at the bottom of the `"welcome"` screen leads to the screen on which we ask the user for their name (i.e. the `"askForName"` screen):

Let's take a look:
```java title="java/agents/Felix.java"
...
import com.mindsmiths.armory.component.InputComponent;


@Data
@NoArgsConstructor
public class Felix extends Agent {
    String name;

    public void showWelcomeScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator("welcome")      
                    .addComponent("title", new TitleComponent("Hello! I’m Felix and I’m here to help you find the best workout plan for you. Ready?"))
                    .addComponent("submit", new PrimarySubmitButtonComponent("submit", "Cool, let's go!", "askForName")),
                "askForName", new TemplateGenerator("askForName")
                    .addComponent("title", new TitleComponent("Okay, first, tell me your name? 😊"))
                    .addComponent("name", new InputComponent("name", "Type your name here", true))
                    .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "finish")));
        showScreens("welcome", screens);
    }
}
```

As you can see, all screens defined within the `showWelcomeScreens()` function are shown to the user as part of a single procedure, starting from the screen whose name is specified as the `firstScreen`. This means that there is no need to define any business logic in the rule engine to handle transitions between screens.

The data the user inputs during the screen sequence are transferred as values of GET parameters with the corresponding `componentId` as key.
We can store the user's answers at the end of the procedure: for example, here we only asked for the name which the user sets through an input area, so we can fetch it off the `SubmitEvent()` using `getParamAsString("name")`, because `name` is the id of the text input component that was filled in:

```java titile="rules/felix/Felix.drl"
...
import com.mindsmiths.armory.event.SubmitEvent
...
rule "Start user onboarding"
   when
        signal: SubmitEvent(getParamAsString("buttonPressed") == "finish") from entry-point "signals"       
        agent: Felix()
   then
        modify(agent) {
            setName(signal.getParamAsString("name"))
        };
        delete(signal);
end
```

With Armory, you can easily define multiple screen chains for different stages of the process. This can be beneficial if you want to store some data separately.
For example, in the onboarding screens we asked the user for a name, and stored it after the procedure was completed. 
Now, we can use it in other screens, to add a bit of personalization to the user experience.

The data is only stored at the end of a procedure to allow the user to go back and forth and change their answers before submitting. To allow the user to go back through the screen chain, simply set the `allowsUndo` field in the `HeaderComponent` to `true`. Let's see this in the onboarding screens:
```java title="java/agents/Felix.java"
...
import com.mindsmiths.armory.component.HeaderComponent;


@Data
@NoArgsConstructor
public class Felix extends Agent {
    String name;
    String age;
    String onboardingStage = "START";
    String weight;
    String height;

    ...
    
    public void showOnboardingScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "startOnboarding", new TemplateGenerator("startOnboarding")
                        .addComponent("title", new TitleComponent(String.format("Nice to meet you, %s! To make the workout plan just for you, I have a few questions. Ready? 💪", name)))
                        .addComponent("submit", new PrimarySubmitButtonComponent("buttonPressed", "Let's go!", "askForAge")),
                "askForAge", new TemplateGenerator("askForAge")
                        .addComponent("header", new HeaderComponent(null, true))
                        .addComponent("title", new TitleComponent("How old are you?"))
                        .addComponent("age", new InputComponent("age", "Choose the age you would like to be", "age", true))
                        .addComponent("submit", new PrimarySubmitButtonComponent("buttonPressed", "Next", "askForWeight")),
                "askForWeight", new TemplateGenerator("askForWeight")
                        .addComponent("header", new HeaderComponent(null, true))
                        .addComponent("title", new TitleComponent("How much do you weigh in kilograms?"))
                        .addComponent("weight", new InputComponent("weight", "Type your weight here", true))
                        .addComponent("submit", new PrimarySubmitButtonComponent("buttonPressed", "Next!", "askForHeight")),
                "askForHeight", new TemplateGenerator("askForHeight")
                        .addComponent("header", new HeaderComponent(null, true))
                        .addComponent("title", new TitleComponent("How tall are you in cm?"))
                        .addComponent("height", new InputComponent("height", "Type your height here", true))
                        .addComponent("submit", new PrimarySubmitButtonComponent("buttonPressed", "Next!", "finishOnboarding")));
        showScreens("startOnboarding", screens);
    }
...
}
```

Here you can see that we are using the user's name to reference them at the start of the onboarding flow.
You'll also notice that we added a bunch of fields to our class, to store the data the user inputs on onboarding screens. The data we'll process are age, weight and height.


Let's see how it looks in the rules! First add a line to start the onboarding procedure once we have the user's name, and then add a new rule to store the data at the end of onboarding:
```java title="rules/felix/Felix.drl"
...
rule "Start user onboarding"
   when
        signal: SubmitEvent(getParamAsString("buttonPressed") == "finishWelcome") from entry-point "signals"
        agent: Felix()
   then
        modify(agent) {
            setName(signal.getParamAsString("name"))
        };
        agent.showOnboardingScreens(); // TODO: colour-code
        delete(signal);
end

rule "Start survey"
   when
        signal: SubmitEvent(getParamAsString("buttonPressed") == "finishOnboarding") from entry-point "signals"
        agent: Felix()
   then
        modify(agent) {
            setAge(signal.getParamAsString("age")),
            setWeight(signal.getParamAsString("weight")),
            setHeight(signal.getParamAsString("height"))
        };
        delete (signal);
end
```

Start `forge run` and voila! You have a full onboarding process done!