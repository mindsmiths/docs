---
sidebar_position: 4
---

# Armory concepts
**TO-DO**: this is too long, need to split it into 3 or 4 smaller chapters


There are a couple important concepts to grasp for using Armory. We’ll look at them in turn.
## Armory templates and components

As mentioned, the service already comes with a number of predefined templates and components for building screens. Once you get a hang of it, you are welcome to add more custom implementations.

Templates are basically defined by:
* templateName
* componentOrdering

Templates are usually named by the components they contain, e.g. TitleButtonTemplate contains a TitleComponent and a list of PrimarySubmitButtonComponents.
The order in which these components are shown on the screen is specified via the componentOrdering list.
All templates implement the BaseTemplate interface.

Templates are really easy to define using the TemplateGenerator, so we only provide a couple of them out-of-the-box. One example is the GenericTemplate which contains the following components (in that order of appearance, if actually used on the screen): back button, title, image, description text, area for text input, area for data input, and a group of action components (e.g. buttons). Of course, not all available components need to be used every time.

The GenericTemplate is quite packed, but it can be much simpler than that: we also provide a TitleTemplate which literally only contains a TitleComponent.

The components are the building blocks of screens, and there are several of them predefined in the service, all implementing the BaseComponent interface:
* ActionGroupComponent (groups together buttons into a list)
* BackButtonComponent
* CloudSelectComponent (allows user to select multiple elements from a list)
* DescriptionComponent.java
* ImageComponent.java
* InputComponent.java (roughly corresponds to HTML input element, with the data type specified by setting `type`)
* PrimarySubmitButtonComponent (basic button, extending the BaseSubmitButtonComponent which triggers a SubmitEvent)
* TextAreaComponent
* TitleComponent

Each component is referenced through its componentId. We’ll use this id later on for getting the data the user provided on a screen off the SubmitEvent.

## Template generator

We mentioned you can always use one of the predefined templates to create screens, such as the TitleTemplate:
```BaseTemplate screen = new TitleTemplate("Hello, world!");```

But assuming you’ll often want to create your own layouts, we’ll now focus a bit more on the TemplateGenerator. Let’s look at an example of how we can use it to create a new template:

```java title="rule_engine/src/main/java/agents/Nola.java"
new TemplateGenerator("exampleTemplate")
            .addComponent("title", new TitleComponent("Screen Title"))
            .addComponent("description", new DescriptionComponent("Here is where we put the description."))
            .addComponent("input", new InputComponent("name", "Type your name…", true))
            .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("Option 1", "NextScreen1"),
                        new PrimarySubmitButtonComponent("Option 2", "NextScreen2")
)));
```

Let’s break down this code a little: when instantiating a TemplateGenerator, the first thing we can optionally set (```"exampleTemplate"```) is the screen name, and then we add the components we want our template to contain. Here we chose to have a title, description, input field and a group of buttons. The components are added in the form of HashMap with a string identifier as key (usually “input1”, “input2” etc in case of repeating components) and the component itself as value.

The title and description components are fairly straightforward (they only contain the string to display as title and description), but let’s take a closer look at the remaining two components.

## Armory signals and connection

Let’s start from the basics: there are three different Armory signals that are caught by the Rule engine:
* **UserConnectedEvent**: this signal is emitted each time a user connects to Armory (opens the link)
* **UserDisconnectedEvent**: emitted when the user disconnects from Armory (closes the link)
* **SubmitEvent**: emitted when the user presses something on the screen (e.g. a button)

The signals are fairly straightforward. We should mention that e.g. refreshing the site emits the UserDisconnectedEvent and then the UserConnectedEvent again.

To connect to Armory, the user needs a unique`connectionId`. This id is part of that user’s URL, and will be randomly generated if not set in advance. 

## Changing Armory screens
You can link together multiple Armory screens by specifying the transitions between them. You just specify the name of the screen the action component leads to. For example, in the code below, the “Cool, let’s go!” button at the bottom of the welcome screen leads to the screen on which we ask the user for their name:

```java title="rule_engine/src/main/java/agents/Nola.java"
...
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
...
import com.mindsmiths.armory.components.DescriptionComponent;
import com.mindsmiths.armory.components.InputComponent;
import com.mindsmiths.armory.components.PrimarySubmitButtonComponent;
import com.mindsmiths.armory.components.TitleComponent;
import com.mindsmiths.armory.templates.TemplateGenerator;
...

public class Nola extends Agent {
    String name;
    Date birthday;
    String onboardingStage;
    
    ...

   public void showOnboardingScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator("welcome")
                        .addComponent("title", new TitleComponent("Welcome to the demo"))
                        .addComponent("description", new DescriptionComponent("We'll create a really simple onboarding process."))
                        .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                "askForName", new TemplateGenerator("askForName")
                        .addComponent("title", new TitleComponent("What's your name?"))
                        .addComponent("input", new InputComponent("name", "Type your name here", true))
                        .addComponent("submit", new PrimarySubmitButtonComponent("Done, next!", "askForBirthday")),
                "askForBirthday", new TemplateGenerator("askForBirthday")
                        .addComponent("title", new TitleComponent("When is your birthday?"))
                        .addComponent("birthday", new InputComponent("birthday", "mm/dd/yyyy", "date", true))
                        .addComponent("submit", new PrimarySubmitButtonComponent("Finish", "finishOnboarding"))
        );
        showScreens("welcome", screens);
    }
    
    public static Date saveAsDate(String originalValue) throws ParseException {
     return new SimpleDateFormat("MM-dd-yyyy").parse(originalValue);
    }
```

After they input the name, the submit button has “finishOnboarding” as a value, which doesn’t lead to another screen, but you can still catch it in a rule and have the system react accordingly. You can remove the rule showing the demo screen and add the following:

```console title="rule_engine/src/main/resources/rules/nola/Nola.drl"
package rules.nola

import com.mindsmiths.armory.events.UserConnectedEvent
import com.mindsmiths.armory.events.SubmitEvent

import agents.Nola

rule "Start onboarding"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Nola(onboardingStage != "onboarded")
   then
       agent.showOnboardingScreens();
       modify(agent) {
           setOnboardingStage("onboarding")
       };
       delete(signal);
end

rule "Finish onboarding"
   when
       signal: SubmitEvent(getParamAsString("submit") == "finishOnboarding") from entry-point "signals"
       agent: Nola()
   then
       modify(agent) {
	     setName(signal.getParamAsString("name")),
	     setBirthday(agent.saveAsDate(signal.getParamAsString("birthday"))),
         setOnboardingStage("onboarded")
       };
       delete(signal);
end
```
As you can see, there is no need to write out a separate rule for the transition between the welcome screen and the askForName screen - this will already happen because it is specified in agent’s showOnboardingScreens.

The data the user inputs during the screen sequence are transferred as GET parameters with the variable name you set (the component id) as key, and we can store them at the end of the onboarding procedure (here we only asked for a name which the user sets through an input area, so we can fetch it off the SubmitEvent like this: signal.getParamAsString("name")).

Of course, you don’t always want to use predefined sequences of screens (although note that you can just as easily implement condition-based branching in logic, as long as certain actions always lead to the same outcomes). Sometimes you want more flexibility in allowing the system to determine which screen to show to the user depending on the state s/he is in.

When the screen to show is determined based on other circumstances and not the fact if/which submit action the user made, you can capture this behavior through a rule, e.g.

```console title="rule_engine/src/main/resources/rules/nola/Nola.drl"
rule "Show thank you screen"
    when
        agent: Nola(onboardingStage == "onboarded")
    then
        agent.showThanksScreen();
end
```
With the implementation in agent’s java class:
```java title="rule_engine/src/main/java/agents/Nola.java"
    public void showThanksScreen() {
        showScreen(new TitleTemplate(String.format("Thanks, %s!", name)));
    }
```

**TO-DO**: come up with transition for next chapter