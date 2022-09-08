---
sidebar_position: 4
---

# Chaining Armory screens
You can link together multiple Armory screens by specifying the transitions between them. 
You just specify the name of the screen the action component leads to. 
For example, in the code below, the “Cool, let’s go!” button at the bottom of the welcome screen leads to the screen on 
which we ask the user for their name:

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

@Data
@NoArgsConstructor
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

```java title="rule_engine/src/main/resources/rules/nola/Nola.drl"
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
As you can see, there is no need to write out a separate rule for the transition between the welcome screen and the `askForName`
screen - this will already happen because it is specified in agent’s `showOnboardingScreens`.

The data the user inputs during the screen sequence are transferred as `GET` parameters with the variable name you
set (`componentId`) as key, and we can store them at the end of the onboarding procedure (here we only asked for a name which the user sets through an input area, so we can fetch it off the `SubmitEvent` like this:
`signal.getParamAsString("name")`).

Of course, you don’t always want to use predefined sequences of screens (although note that you can just as easily 
implement condition-based branching in logic, as long as certain actions always lead to the same outcomes). 
Sometimes you want more flexibility in allowing the system to determine which screen to show to the user depending on the 
state s/he is in.

When the screen to show is determined based on other circumstances and not the fact if/which submit action the user made, you can capture this behavior through a rule, e.g.

```java title="rule_engine/src/main/resources/rules/nola/Nola.drl"
    ...
    
rule "Show thank you screen"
    when
        agent: Nola(onboardingStage == "onboarded")
    then
        agent.showThanksScreen();
end
```
With the implementation in agent’s java class:
```java title="rule_engine/src/main/java/agents/Nola.java"
...
@Data
@NoArgsConstructor
public class Nola extends Agent {
    ...
    public void showThanksScreen() {
        showScreen(new TitleTemplate(String.format("Thanks, %s!", name)));
    }
}
```
Perfect, now that you mastered building and chaining different kind of screens, it's time that you get the hang of how to make them
even prettier and personalize them a bit.