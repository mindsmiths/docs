---
sidebar_position: 7
---

# Web

Mindsmiths Platform supports dynamically generated web pages.
You can use these pages to display content to your users, or to collect data from them.

The service for this is called **Armory**.

There are a couple important concepts to grasp for using Armory. We’ll look at them in turn.

<details>
  <summary>Setup details</summary>
<div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li>SECRET_KEY</li>
            <li>DEBUG</li>
            <li>ALLOW_EVERYONE</li>
            <li>SITE_URL</li>
            <li>INTERNAL_SITE_URL</li>
        </ul>
    </div>
    <div>
        <p><b>Installment:</b></p>
        <ul>
            <li><code>pip install "armory[dev]~=5.0.0b0"</code></li>
        </ul>
    </div>
    <div>
        <p><b>Initialize setup:</b></p>
        <ul><li><p><code>armory setup</code></p></li></ul>
    </div>
  </div>
</details>

## Armory concepts

Let’s start from the basics: there are three different Armory signals that are caught by the Rule engine:
* **UserConnected**: emitted each time a user connects to Armory (opens the link)
* **UserDisconnected**: emitted when the user disconnects from Armory (closes the link)
* **Submit**: emitted when the user presses something on the screen (e.g. a button)

The signals are fairly straightforward. We should mention that e.g. refreshing the site emits the UserDisconnectedEvent and then the UserConnectedEvent again.

To connect to Armory, the user needs a unique`connectionId`. This id is part of that user’s URL, and will be randomly generated if not set in advance. 


## Armory templates and components

As mentioned, Armory already comes with a number of predefined templates and components for building screens. Once you get a hang of how they work, you are welcome to add more custom implementations.

Templates are basically defined by:
* **templateName**
* **componentOrdering**

Templates are usually named by the components they contain, e.g. `TitleButtonTemplate` contains a `TitleComponent` and a list of `PrimarySubmitButtonComponents`.
The order in which these components are displayed on the screen is specified via the `componentOrdering` list.
All templates implement the `BaseTemplate` interface.

Templates are really easy to define using the `TemplateGenerator`, so we only provide a couple of them out-of-the-box. 
One example is the `GenericTemplate` which contains the following components (in that order of appearance, if actually used on the screen): 
back button, title, image, description text, area for text input, area for data input, and a group of action components (e.g. buttons). 
Of course, not all available components need to be used every time.

The `GenericTemplate` is quite packed, but it can be much simpler than that - for example, we also provide a `TitleTemplate` which literally only contains a TitleComponent.

The components are the building blocks of screens, and there are several of them predefined in the service, all implementing the `BaseComponent` interface:
* ActionGroup (groups together buttons into a list of options out of which only one can be selected)
* BackButton
* CloudSelect (allows user to select multiple elements from a list)
* Description
* Image
* Input (roughly corresponds to HTML input element, with the data type specified by setting `type`)
* SubmitButton (basic button, extending the `BaseSubmitButtonComponent` which triggers a `SubmitEvent`)
* TextArea
* Title

Each component is referenced through its `componentId`. We’ll use this id later on for getting the data the user provided on a screen off the `SubmitEvent`.

## Template generator

We mentioned you can always use one of the predefined templates to create screens, such as the `TitleTemplate`:
```BaseTemplate screen = new TitleTemplate("Hello, world!");```

But assuming you’ll often want to create your own layouts, we’ll now focus a bit more on the `TemplateGenerator`. Let’s look at an example of how we can use it to create a new template:

```java
new TemplateGenerator("exampleTemplate")
            .addComponent("title", new TitleComponent("Screen Title"))
            .addComponent("description", new DescriptionComponent("Here is where we put the description."))
            .addComponent("input", new InputComponent("name", "Type your name…", true))
            .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("inputId1", "Option 1", "NextScreen1"),
                        new PrimarySubmitButtonComponent("inputId2", "Option 2", "NextScreen2")
)));
```

Let’s break down this code a little before writing up the actual code: when instantiating a `TemplateGenerator`, the first thing we can optionally set (```"exampleTemplate"```) 
is the screen name, and then we add the components we want our template to contain. Here we chose to have a title, description,
input field and a group of buttons. The components are added in the form of HashMap with a string identifier as key (usually “input1”, 
“input2” etc. in case of repeating components) and the component itself as value.

We'll go through the logic that gets executed in the background as we integrate the actual screens to our project.

You can combine elements like these in any order you like. Feel free to create some of your own templates a check them out when running `forge run`.

## Chaining Armory screens

You can link together sequences of multiple Armory screens by specifying the transitions between them. 
You just define the name of the screen the action component takes the user to. 
For example, in the code below, the “Cool, let’s go!” button at the bottom of the welcome screen leads to the screen on 
which we ask the user for their name:

```java title="rule_engine/src/main/java/agents/Felix.java"
package agents;

import com.mindsmiths.ruleEngine.model.Agent;
import lombok.*;

import com.mindsmiths.armory.ArmoryAPI;
import com.mindsmiths.armory.Screen;
import com.mindsmiths.armory.component.*;

import com.mindsmiths.ruleEngine.util.Log;

@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Felix extends Agent {

    String name;
    
    public void showWelcomeScreens() {
        ArmoryAPI.show(
                getConnection("armory"),
                new Screen("welcome")
                        .add(new Title("Hello! I’m Felix and I’m here to help you get as hot as hell! Ready?"))
                        .add(new Image("public/JogaPuppy.png", false))
                        .add(new SubmitButton("welcomeStarted", "Cool, let's go!", "askForName")),
                new Screen("askForName")
                        .add(new Header("logo.png", false))
                        .add(new Title("Alright! First, tell me your name?"))
                        .add(new Input("name", "Type your name here", "text"))
                        .add(new SubmitButton("nameSubmited", "Done, next!"))
        );
    }
}
```

After the user provides the name, the submit button has `"nameSubmited"` as a value, which doesn’t lead to another screen, but you can still catch it in a rule and have the system react to it. 
You can remove the rule showing the demo screen and add the following:

```java title="rule_engine/src/main/resources/rules/felix/Felix.drl"
package rules.felix;

import agents.Felix
import com.mindsmiths.ruleEngine.model.Heartbeat
import com.mindsmiths.armory.event.UserConnected
import com.mindsmiths.armory.event.Submit
import com.mindsmiths.ruleEngine.util.Log

rule "Welcome new user"
   when
       signal: UserConnected() from entry-point "signals"
       agent: Felix()
   then
       agent.showWelcomeScreens();
       delete(signal);
end
```
As you can see, there is no need to write out a separate rule for the transition between the `welcome` screen and the `askForName`
screen - this will already happen because it is specified in agent’s `showWelcomeScreens()`.

Of course, you don’t always want to use predefined sequences of screens (although note that you can just as easily 
implement slightly more complex condition-based branching in logic, as long as certain actions always lead to the same outcomes). 
Sometimes you want more flexibility in allowing the system to determine which screen to show to the user depending on the 
state the user is in.

When the screen to show is determined based on other circumstances and not the fact if/which submit action the user made, you can capture this behavior through a rule.
With Armory, you can easily define multiple screen chains for different stages of the process. This can be beneficial if you want to store some data separately.
For example, in the welcome screens we asked the user for a name, and we want to store it after the procedure is completed, 
so we can use it in other screens to add a bit of personalization to the user experience. We will do this inside the `Start user onboarding` rule. 

We'll add a line to start the onboarding procedure once we have the user's name, and then add a new rule to store the data at the end of welcome flow.

How to store data? Well, the data the user inputs during the screen sequence are transferred as values of GET parameters with the corresponding `componentId` as key.
We can store the user's answers at the end of the procedure. For example, here we only asked for the name, which the user set through an input area. 
We can fetch it off the `Submit()` using `buttonId == "nameSubmitted"` because the `"nameSubmitted"` is the ID of the submit button that we will use as a trigger to take us to the next screen.


```java title="rule_engine/src/main/resources/rules/mindy/Mindy.drl"
...

rule "Start user onboarding"
    when
        signal: Submit(buttonId == "nameSubmited") from entry-point "signals"
        agent: Felix()
    then
        modify(agent){
            setName(signal.getParamAsString("name"))
            };
        agent.showOnboardingScreens();
        delete(signal);
end
```

With the implementation in agent’s java class:
```java title="rule_engine/src/main/java/agents/Felix.java"
...
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Felix extends Agent {
    String name;
    Integer weight;
    Integer height;

    public void showOnboardingScreens() {
            ArmoryAPI.show(
                    getConnection("armory"),
                    new Screen("startOnboarding")
                            .add(new Title(String.format("Nice to meet you %s! Now let's make a workout plan just for you!\nReady? 💪", name)))
                            .add(new Image("public/GymPuppy.png", false))
                            .add(new SubmitButton("onboardingStarted", "Let's go!", "askForWeight")),
                    new Screen("askForWeight")
                            .add(new Header("logo.png", true))
                            .add(new Title("How much do you weigh in kilograms?"))
                            .add(new Input("weight", "Type your weight here", "number"))
                            .add(new SubmitButton("weightSubmited", "Next!", "askForHeight")),
                    new Screen("askForHeight")
                            .add(new Header("logo.png", true))
                            .add(new Title("How tall are you in cm?"))
                            .add(new Input("height", "Type your height here", "number"))
                            .add(new SubmitButton("heightSubmited", "Next!"))
        );
    }
}
```

Test the code with `forge run`!
Now that you've mastered building and chaining different kinds of screens, you are ready to dig into the frontend part: how to quickly and easily customize your screens and add some more advanced components.