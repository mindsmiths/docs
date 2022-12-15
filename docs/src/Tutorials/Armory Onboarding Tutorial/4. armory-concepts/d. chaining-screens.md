---
sidebar_position: 4
---

# Chaining Armory screens

As you can see, you can create screens really quickly with Armory's smart defaults! 
But to create a real web-app experience, you usually want to create a sequence of linked screens the user can switch between.

We'll now show you how to do just that: we'll add a function that shows multiple screens, specifying the transitions between them. 
To tell Armory which screen to switch to, just specify the name of the next screen as the value of the action component that leads to it (such as a button). 
For example, in the code below, the “Cool, let's go!” button at the bottom of the `welcome` screen leads to the screen on 
which we ask the user for their name (i.e. the `askForName` screen):
// TODO explain where the jpg file got from (add it in later?) - actually, remove the image entirely for now and only add it in in the chapter where you address adding images 
// TODO remove all armory history stuff
// TODO add file path
// TODO - better naming than "next"? - to signify it's the end of a procedure
```
public class Felix extends Agent {
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
As you can see, all screens defined within the `showStartScreens()` function are shown to the user as part of a single procedure. This means that there is no need to define any business logic in the rule engine to handle transitions between screens.

// TODO add the whole code in rules that covers this part, it's confusing like this
The data the user inputs during the screen sequence are transferred as values of `GET` parameters with the corresponding `componentId` as key.
We can store the user's answers at the end of the procedure: for example, here we only asked for the name which the user sets through an input area, so we can fetch it off the `SubmitEvent` using `getParamAsString("name")`, because `name` is the id of the text input component.

Keep in mind that you might not always want to use predefined sequences of screens: sometimes you want more flexibility in allowing the system to determine which screen to show to the user depending on the state the user is in. When the screen to show is determined based on other circumstances and not just the fact which screen the user was on, and which button was pressed, you can define this behavior through a rule.


// TODO present this more as a feature, less of an inconvenience :)
You can define multiple screen chains, for different stages of onboarding. In the Felix case, we decided to separate `startScreens` from `onboardingScreens`, because we want to store and use the name the user provides to address them in onboarding.
In other words, during the `startScreens` sequence, we asked the user for a name, and stored it after the procedure was completed (i.e. the user entered their name on the second screen and pressed the "Done, next!" button). 
Now, we can easily use it in other screens, to add a bit of personalization to the user experience.

Let's add the code for onboarding in agent's Java class:
// TODO change goData :D
```java title="java/agents/Felix.java"

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

You'll notice we added a bunch of fields to our class, to store the data the user inputs on onboarding screens. Let's see how it looks in the rules:
// TODO remove the imports that were already in there, use "..." + format code
// TODO process the onboarding data as well, now that you included it in the java class, and it's not a new concept (it's the same as storing the name)
// TODO explicitly show where you used this name you stored, now that you mentioned it
```java title="rules/felix/Felix.drl"
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

Perfect, now that you mastered building and chaining different kinds of screens, we can focus a bit more on customizing the screen layout.