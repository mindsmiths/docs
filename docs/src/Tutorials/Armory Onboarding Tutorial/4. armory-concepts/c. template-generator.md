---
sidebar_position: 3
---

# Template generator

At this moment (we are not coding anything yet), you can either use screen templates we already have pre-defined, or you can play around and build screens yourself using the template generator. 
You can easily use our predefined screens, such as TitleTemplate: ```BaseTemplate screen = new TitleTemplate("Hello, world!");```, but where is fun in that, right? 
Let's jump right into playing with TemplateGenerator (it's more fun, plus, you will likely use this more often).
Here you can see an example of how we can use TemplateGenerator to create a new template:

```java title="rule_engine/src/main/java/agents/Felix.java"

new TemplateGenerator("exampleTemplate")
            .addComponent("title", new TitleComponent("Screen Title"))
            .addComponent("description", new DescriptionComponent("Here is where we put the description."))
            .addComponent("input", new InputComponent("name", "Type your name…", true))
            .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("Option 1", "NextScreen1"),
                        new PrimarySubmitButtonComponent("Option 2", "NextScreen2")
)));
```

Let's break down this code: when initiating a TemplateGenerator, the first thing we can optionally set (```"exampleTemplate"```) 
is the screen name. After defining the screen name we can add the components we want our template to contain. 
In this example we decided to add: title, description, input field and a group of buttons. The components need to be added in the order you want them to appear on the screen.
Components are added in the form of HashMap with a string identifier as key (usually “input1”, “input2” etc. in case of repeating components) and the component itself as value.

You can combine elements like these in any order you'd like. 

# Meet Felix!

So, now you are familiar with the basics, and you are ready to start coding. To make your learning process a bit easier, we'll guide you through the process of creating simple onboarding agent named Felix. 
With Felix you will build onboarding screens, create a short survey, and try out different kinds of components. 

Let's just jump right into building!

First, inside the ```Felix.java``` file, we create the showStartScreens method, add screen template, and add components we want our first screen to have.  
Maybe you are wondering what's up with the armoryHistory? Good question. 
Armory history is another component made for memorizing last screen you were at. At the beginning, we don't really need it, but it will come in handy later when we'll have multiple chained screens.  

```java title="rule_engine/src/main/java/agents/Felix.java"

package agents;

import java.util.Map;

import com.mindsmiths.armory.ArmoryAPI;
import com.mindsmiths.armory.template.BaseTemplate;
import com.mindsmiths.armory.template.TitleTemplate;
import com.mindsmiths.armory.template.TemplateGenerator;
import com.mindsmiths.ruleEngine.model.Agent;

import lombok.*;
import com.mindsmiths.armory.component.TitleComponent;
import com.mindsmiths.armory.component.PrimarySubmitButtonComponent;

public class Felix extends Agent {
    String name;
    String onboardingStage = "START";

    public void showStartScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator ("welcome")      
                .addComponent("title", new TitleComponent("Hello! I'm Felix and I'm here to help you find the best workout plan for you. Ready?")) 
                .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
    }
}
```

Okay, now when the method is defined, all we need is a rule to start our method the moment signal indicating that user is connected to armory arrives. 
Go to ```Felix.drl``` and add the following:

```java title="rule_engine/src/main/java/rules/Felix.drl"

package rules.felix
import agents.Felix
import com.mindsmiths.armory.event.UserConnectedEvent
import com.mindsmiths.armory.event.SubmitEvent
import com.mindsmiths.ruleEngine.util.Log 

rule "Start flow"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Felix(onboardingStage != "ONBOARDED")
   then
       agent.showStartScreens();
       delete(signal);
end
```

That's it! You can now run forge and meet Felix!