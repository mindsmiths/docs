---
sidebar_position: 4
---

# Chaining Armory screens

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
       signal: SubmitEvent(getParamAsString("submit") == "finishOnboarding") from entry-point "signals"
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