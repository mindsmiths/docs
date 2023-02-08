---
sidebar_position: 7
---

# Web

Mindsmiths Platform supports dynamically generated web pages.
You can use these pages to display content to your users, and to collect the data they input.

We call this web templating service **Armory**.

Using Armory is very simple, but there are a couple basic concepts you need to grasp before you start. We look at each of those concepts below.

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
            <li><code>pip install "armory[dev]~=5.0.0"</code></li>
        </ul>
    </div>
    <div>
        <p><b>Initialize setup:</b></p>
        <ul><li><p><code>armory setup</code></p></li></ul>
    </div>
  </div>
</details>

## Armory events 

Let’s start from the basics - there are three different signals Armory as a service uses to communicate with the platform:
* **UserConnected**: event emitted each time a user connects to an Armory screen (opens the link)
* **UserDisconnected**: event emitted when the user disconnects from an Armory screen (closes the link)
* **Submit**: event emitted when the user presses something on the screen (e.g. a button)

These signals are fairly straightforward. We should mention that e.g. refreshing the site emits the `UserDisconnected` and then the `UserConnected` event again.
Since the screens are generated dynamically, these events allow us to control what (next) gets shown to the user.

:::note
when connecting to Armory, the user has a unique `connectionId`. This id is part of that user’s Armory URL, and will be randomly generated if not set for that user in advance.
:::

## Armory components and screens

As mentioned, Armory already comes with a number of "smart defaults", in the form of predefined components and styleguide for screen design. 
We'll go over them briefly, but once you get a hang of how things work, you are welcome to add more custom implementations[TODO insert link] and play around with the styling[TODO insert link] yourself.

You can show the screens you create using `ArmoryAPI.show()`, which takes the mentioned user connection id and the screen(s) to show, for example:
```java
ArmoryAPI.show(
    getConnection("armory"),
    new Screen("HelloScreen").add(new Title("Hello there!"))
);
```

But let's first learn how to create those screens!

### Components
The components are the building blocks of screens, and there are several you can use out-of-the-box, all implementing the `BaseComponent` interface:
* BackButton: component used in Screen headers
* CloudSelect: a cool multi-select component
* Description
* Header: component that normally contains a logo and the `BackButton` (enabled by setting the `allowsBack` field to `true`)
* Image
* Input: component that roughly corresponds to the HTML input element, with the input data type specified by setting `type`
* SubmitButton: basic button component, triggers a `Submit` event
* TextArea: component for longer text input
* Title

Components that are used to collect some sort of input or activity from the user (text areas, buttons etc.) are referenced through the `inputId`. For example, here is a rule that registers the user entered their name and submitted it by pressing a button:
```java
rule "Save customer name"
    when
        signal: Submit(buttonId == "submitName", name: getParamAsString("name")) from entry-point "signals"
        agent: Customer()
    then
        modify(agent){setName(name)};
        delete (signal);
end
```
[TODO add screenshots + tutorial references]
All data within a linked sequence of screens[TODO insert link] is transferred via GET parameters, and you can store them in bulk when a button with a certain `buttonId` is pressed.

### Screens
But what do we do with these components, and how can we assemble them to create screens? For this we use Armory's `Screen` class, to which we simply add the components in the order we want them to appear on the screen.

We should mention that there are some default standards when it comes to spatial organization of the components on screens: all components apart from the action ones (e.g. buttons taking you to the next screen) gravitate towards top of the screen. The action components are anchored to the bottom of the screen, to avoid screens shifting in size depending on how many components they contain.

You can easily override these standard practices by using the `group()` function, which allows you to create a group of components you want to "stick closer together" on the screen. Check it out:
```java
new Screen("customerOnboarding")
        .add(new Header("logo.png", true))
        .add(new Title("Tell us about yourself"))
        .group("center")
        .add(new Description("Welcome! We would like to get to know you a bit better. Can you start by telling us your name?"))
        .add(new Input("name", "Type your name here...", "text"))
        .group("bottom")
        .add(new SubmitButton("submitName", "Next"))
```

This will group the `Description` and `Input` component around the screen center, push the button to the bottom, leaving the `Header` and `Title` by default at the top.

The last function we're going to mention here is `setTemplate()`. If you create some specific screen layout you would like to apply to multiple screens (such as content centering, the order of components on the screen), you can create a template and just set it for all screens you want by writing `.setTemplate("TemplateName")` before adding the components:

```java
new Screen("customerOnboarding")
        .setTemplate("CenteredContent")
        .add(new Header("logo.png", true))
        .add(new Title("Tell us about yourself"))
        .group("center")
        .add(new Description("Welcome! We would like to get to know you a bit better. Can you start by telling us your name?"))
        .add(new Input("name", "Type your name here...", "text"))
        .group("bottom")
        .add(new SubmitButton("submitName", "Next"))
```

We'll show you how to create these templates and custom components in the next section.

## Custom components and templates [TODO]

You can easily create new custom components directly from the Java code using `CustomComponent`. This class just contains a map of parameters

Templates are really easy to define using the `TemplateGenerator`, so we only provide a couple of them out-of-the-box. 
One example is the `GenericTemplate` which contains the following components (in that order of appearance, if actually used on the screen): 
back button, title, image, description text, area for text input, area for data input, and a group of action components (e.g. buttons). 
Of course, not all available components need to be used every time.

The `GenericTemplate` is quite packed, but it can be much simpler than that - for example, we also provide a `TitleTemplate` which literally only contains a TitleComponent.

## Chaining Armory screens

Finally, you can link together sequences of multiple Armory screens by specifying the transitions between them. 
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