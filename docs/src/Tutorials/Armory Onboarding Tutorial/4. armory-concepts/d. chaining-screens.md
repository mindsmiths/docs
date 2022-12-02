---
sidebar_position: 4
---

# Chaining Armory screens

Pretty cool ha? It's so simple! But obviously, you don't want to have just one screen, but the chain of screens.
Well, you can link together multiple Armory screens by specifying the transitions between them. 
Just specify the name of the screen the action component leads to. 
For example, in the code below, the “Cool, let's go!” button at the bottom of the `welcome` screen leads to the screen on 
which we ask the user for their name (`askForName` screen):

```public class Felix extends Agent {
    String name;
    String onboardingStage = "START";

    public void showStartScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator ("welcome")      
                .addComponent("title", new TitleComponent("Hello! I'm Felix and I'm here to help you find the best workout plan for you. Ready?"))
                .addComponent("image", new ImageComponent("/public/JogaPuppy.png"))  
                .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                "askForName", new TemplateGenerator("askForName")
                        .addComponent("title", new TitleComponent("Okay, first, tell me your name? :)"))
                        .addComponent("name", new InputComponent("name", "Type your name here", true))
                        .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "next")));
        String lastScreenId = "welcome";
        if (armoryHistory != null && armoryHistory.size() > 0)
            lastScreenId = armoryHistory.get(armoryHistory.size() - 1).getActiveScreenId();
        showScreens(lastScreenId, screens);
    }
}
```
As you can see, there is no need to write out a separate rule for the transition between the `welcome` screen and the `askForName`
screen - this will already happen because it is specified in agent's `showStartScreens`.

The data the user inputs during the screen sequence are transferred as `GET` parameters with the variable name you set (`componentId`) as key, 
and we can store them at the end of the onboarding procedure (here we only asked for a name which the user sets through an input area, so we can fetch it off the `SubmitEvent` like this:
`signal.getParamAsString("name")`).

Of course, you don't always want to use predefined sequences of screens (although note that you can just as easily 
implement condition-based branching in logic, as long as certain actions always lead to the same outcomes). 
Sometimes you want more flexibility in allowing the system to determine which screen to show to the user depending on the 
state s/he is in.

When the screen to show is determined based on other circumstances and not the fact if/which submit action the user made, you can capture this behavior through a rule.
In Felix case, we decided to seperate `startScreens` from `onboardingScreens`, while otherwise it would be hard to use the name of the user, while we need to set it first.
So, when we activated `startScreens`, we asked user for a name, and we stored it after the whole start process is done. 
Now, we can easily use it in the onboarding part, to add a bit of personalization to our usecase.

We can do it with the following implementation in agent's java class:

```java title="rule_engine/src/main/java/agents/Felix.java"

package agents;

import java.util.Map;

import com.mindsmiths.armory.ArmoryAPI;
import com.mindsmiths.armory.template.BaseTemplate;
import com.mindsmiths.armory.template.TitleTemplate;
import com.mindsmiths.armory.template.TemplateGenerator;
import com.mindsmiths.armory.component.TitleComponent;
import com.mindsmiths.ruleEngine.model.Agent;
import lombok.*;
import java.util.List;
import java.util.ArrayList;
import com.mindsmiths.armory.component.InputComponent;
import com.mindsmiths.armory.component.ActionGroupComponent;
import com.mindsmiths.armory.component.PrimarySubmitButtonComponent;
import com.mindsmiths.armory.component.ImageComponent;
import com.mindsmiths.armory.component.CloudSelectComponent;
import com.mindsmiths.armory.component.HeaderComponent;

@Data
@NoArgsConstructor

public class Felix extends Agent {
    String name;
    String age;
    String onboardingStage = "START";
    String survey;
    String weight;
    String height;
    String reviewData;
    List<HistoryItem> armoryHistory = new ArrayList<>();
    String lastScreenId;

    public void showStartScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator ("welcome")      
                .addComponent("title", new TitleComponent("Hello! I’m Felix and I’m here to help you find the best workout plan for you. Ready?"))
                .addComponent("image", new ImageComponent("/public/JogaPuppy.png"))  
                .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                "askForName", new TemplateGenerator("askForName")
                        .addComponent("title", new TitleComponent("Okay, first, tell me your name? :)"))
                        .addComponent("name", new InputComponent("name", "Type your name here", true))
                        .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "next")));
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
                        .addComponent("submitHeight", new PrimarySubmitButtonComponent("submitHeight", "Next!", "goData")));
        showScreens("startOnboarding", screens);
    }
}
```

And with the rule that activates written function and initialize screens. 

```java title="rule_engine/src/main/resources/rules/felix/Felix.drl"
    
...
    
package rules.felix
import com.mindsmiths.armory.event.UserConnectedEvent
import agents.Felix
import com.mindsmiths.armory.event.SubmitEvent
import com.mindsmiths.ruleEngine.util.Log 

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
 
After the name is submitted, this rule is activated - in that moment the name will be stored in the base, and the onboarding will start. 

Perfect, now that you mastered building and chaining different kind of screens, we can go a step further and introduce you to the `armory history`.