---
sidebar_position: 5
---

# Chaining Armory screens

As you can see, you can create screens really quickly with Armory's smart defaults! 
But to create a real web-app experience, you usually want to create a sequence of linked screens the user can switch between.

We'll now show you how to do just that: we'll add a function that shows multiple screens, specifying the transitions between them. 
To tell Armory which screen to switch to, just specify the name of the next screen as the value of the action component that leads to it (such as a button). 
For example, in the code below, the “Cool, let's go!” button at the bottom of the `"welcome"` screen leads to the screen on which we ask the user for their name (the `"askForName"` screen):

Let's take a look:

```java title="java/agents/Felix.java"
...
import com.mindsmiths.armory.component.Header;
import com.mindsmiths.armory.component.Input;
...

@Data
@NoArgsConstructor
public class Felix extends Agent {
    String name;

    public void showWelcomeScreens() {
        ArmoryAPI.show(
                getConnection("armory"),
                new Screen("welcome")
                        .add(new Title("Hello! I’m Felix and I’m here to help you get as hot as hell! Ready?"))
                        .add(new Image("public/JogaPuppy.png", false))
                        .add(new SubmitButton("buttonPressed", "Cool, let's go!", "askForName")),
                new Screen("askForName")
                        .add(new Header("logo.png", false))
                        .add(new Title("Alright! First, tell me your name?"))
                        .add(new Input("name", "Type your name here", "text"))
                        .add(new SubmitButton("buttonPressed", "Done, next!", "finishWelcome"))
        );
    }
}
```

As you can see, all screens defined within the `showWelcomeScreens()` function are shown to the user as part of a single procedure, starting from the screen whose name is specified as the `welcome`. 
This means that there is no need to define any business logic in the rule engine to handle transitions between screens.

With Armory, you can easily define multiple screen chains for different stages of the process. This can be beneficial if you want to store some data separately.
For example, in the welcome screens we asked the user for a name, and we will store it after the procedure is completed, so we can use it in other screens, to add a bit of personalization to the user experience.

We will do this inside the `Start user onboarding` rule. 

We'll add a line to start the onboarding procedure once we have the user's name, and then add a new rule to store the data at the end of welcome flow.

How to store data? Well, the data the user inputs during the screen sequence are transferred as values of GET parameters with the corresponding `componentId` as key.
We can store the user's answers at the end of the procedure: for example, here we only asked for the name which the user sets through an input area, 
so we can fetch it off the `Submit()` using `getParamAsString("name")`, because `name` is the id of the text input component that was filled in. 

```java titile="rules/felix/Felix.drl"
...
import com.mindsmiths.armory.event.Submit
...
rule "Start user onboarding"
    when
        signal: Submit(getParamAsString("buttonPressed") == "finishWelcome") from entry-point "signals"
        agent: Felix()
    then
        modify(agent){
            setName(signal.getParamAsString("name"))
            };
        agent.showOnboardingScreens();
        delete(signal);
end
```

The data is only stored at the end of a procedure to allow the user to go back and forth and change their answers before submitting. 
To allow the user to go back through the screen chain, simply set the `allowsUndo` field in the `HeaderComponent` to `true`. 
Let's see this in the onboarding screens:

```java title="java/agents/Felix.java"

package agents;

...

@Data
@NoArgsConstructor
public class Felix extends Agent {
    String name;
    Integer weight;
    Integer height;

    ...
    
    public void showOnboardingScreens() {
        ArmoryAPI.show(
                getConnection("armory"),
                new Screen("startOnboarding")
                        .add(new Title(String.format("Nice to meet you, %s! To make a workout plan just for you, I have a few question.\nReady? 💪", name)))
                        .add(new Image("public/GymPuppy.png", true))
                        .add(new SubmitButton("buttonPressed", "Let's go!", "askForWeight")),
                new Screen("askForWeight")
                        .add(new Header("logo.png", true))
                        .add(new Title("How much do you weigh in kilograms?"))
                        .add(new Input("weight", "Type your weight here", "number"))
                        .add(new SubmitButton("buttonPressed", "Next!", "askForHeight")),
                new Screen("askForHeight")
                        .add(new Header("logo.png", true))
                        .add(new Title("How tall are you in cm?"))
                        .add(new Input("height", "Type your height here", "number"))
                        .add(new SubmitButton("buttonPressed", "Next!", "finishOnboarding"))
        );
    }
}
```

Here you can see that we set the `allowsUndo` field in the `HeaderComponent` to `true`.
You can also see that we are using the user's name to reference them at the start of the onboarding flow. 
We have also added some fields to our class to store the data the user inputs on onboarding screens. The data we will process are weight and height.

Okay, now you can do `forge reset` and run the code with `forge run` to see the new screens!