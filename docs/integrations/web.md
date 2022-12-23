---
sidebar_position: 5
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
* **UserConnectedEvent**: emitted each time a user connects to Armory (opens the link)
* **UserDisconnectedEvent**: emitted when the user disconnects from Armory (closes the link)
* **SubmitEvent**: emitted when the user presses something on the screen (e.g. a button)

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
* ActionGroupComponent (groups together buttons into a list of options out of which only one can be selected)
* BackButtonComponent
* CloudSelectComponent (allows user to select multiple elements from a list)
* DescriptionComponent
* ImageComponent
* InputComponent (roughly corresponds to HTML input element, with the data type specified by setting `type`)
* PrimarySubmitButtonComponent (basic button, extending the `BaseSubmitButtonComponent` which triggers a `SubmitEvent`)
* TextAreaComponent
* TitleComponent

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

```java title="rule_engine/src/main/java/agents/Mindy.java"
...
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
...
import com.mindsmiths.armory.component.DescriptionComponent;
import com.mindsmiths.armory.component.InputComponent;
import com.mindsmiths.armory.component.PrimarySubmitButtonComponent;
...

@Data
@NoArgsConstructor
public class Mindy extends Agent {
    String name;
    Date birthday;
    String onboardingStage;
    
    ...

    public void showOnboardingScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator("welcome")
                        .addComponent("title", new TitleComponent("Welcome to the Armory demo"))
                        .addComponent("description", new DescriptionComponent("We'll create a really simple onboarding process."))
                        .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                "askForName", new TemplateGenerator("askForName")
                        .addComponent("title", new TitleComponent("What's your name?"))
                        .addComponent("name", new InputComponent("name", "Type your name here", true))
                        .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "askForBirthday")),
                "askForBirthday", new TemplateGenerator("askForBirthday")
                        .addComponent("title", new TitleComponent("When is your birthday?"))
                        .addComponent("birthday", new InputComponent("birthday", "mm/dd/yyyy", "date", true))
                        .addComponent("submitBirthday", new PrimarySubmitButtonComponent("submitBirthday", "Finish", "finishOnboarding"))
        );
        showScreens("welcome", screens);
    }
    
    public static Date saveAsDate(String originalValue) throws ParseException {
     return new SimpleDateFormat("MM-dd-yyyy").parse(originalValue);
    }
```

After the user provides the name, the submit button has `"finishOnboarding"` as a value, which doesn’t lead to another screen, but you can still catch it in a rule and have the system react to it. 
You can remove the rule showing the demo screen and add the following:

```java title="rule_engine/src/main/resources/rules/mindy/Mindy.drl"
package rules.mindy

import com.mindsmiths.armory.event.UserConnectedEvent
import com.mindsmiths.armory.event.SubmitEvent

import agents.Mindy


rule "Start onboarding"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Mindy(onboardingStage != "onboarded")
   then
       agent.showOnboardingScreens();
       delete(signal);
end

rule "Finish onboarding"
   when
       signal: SubmitEvent(getParamAsString("submitBirthday") == "finishOnboarding") from entry-point "signals"
       agent: Mindy()
   then
       modify(agent) {
         setName(signal.getParamAsString("name")),
         setBirthday(agent.saveAsDate(signal.getParamAsString("birthday"))),
         setOnboardingStage("onboarded")
       };
       agent.showThanksScreen();
       delete(signal);
end
```
As you can see, there is no need to write out a separate rule for the transition between the welcome screen and the `askForName`
screen - this will already happen because it is specified in agent’s `showOnboardingScreens()`.

The data the user provides on the screens during the onboarding (here, name and birthday date) are transferred as `GET` parameters with the variable name you
set (`componentId`) as key, and we preferably store them all together at the end of the procedure. You see an example of this when using `signal.getParamAsString("name")`.

Of course, you don’t always want to use predefined sequences of screens (although note that you can just as easily 
implement slightly more complex condition-based branching in logic, as long as certain actions always lead to the same outcomes). 
Sometimes you want more flexibility in allowing the system to determine which screen to show to the user depending on the 
state the user is in.

When the screen to show is determined based on other circumstances and not the fact if/which submit action the user made, you can capture this behavior through a rule.
For example, we can add a "Thank you" screen to be shown after the onboarding process is complete:

```java title="rule_engine/src/main/resources/rules/mindy/Mindy.drl"
...
rule "Finish onboarding"
   ...
   then
   ...
       agent.showThanksScreen();
   ...
    
rule "Show screen on refresh after onboarding"
    salience -10
    when
        signal: UserConnectedEvent() from entry-point "signals"
        agent: Mindy()
    then
        agent.showThanksScreen();
        delete(signal);
end
```

With the implementation in agent’s java class:
```java title="rule_engine/src/main/java/agents/Mindy.java"
...
@Data
@NoArgsConstructor
public class Mindy extends Agent {
    ...
    public void showThanksScreen() {
        showScreen(new TitleTemplate(String.format("Thanks, %s!", name)));
    }
}
```

Test the code with `forge run`!
Now that you've mastered building and chaining different kinds of screens, you are ready to dig into the frontend part: how to quickly and easily customize your screens and add some more advanced components.