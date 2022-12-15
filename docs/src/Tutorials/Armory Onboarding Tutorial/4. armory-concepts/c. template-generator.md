---
sidebar_position: 3
---

# Template generator

You can either use the already pre-defined screen templates, or you can play around and build screens yourself using the template generator. 
For example, instead of using the `TemplateGenerator`, we could've generated our demo screen just using the `TitleTemplate`: `BaseTemplate screen = new TitleTemplate("Hello, world!");`.
But where is fun in using predefined things, right? ;) So let's jump right into playing with the `TemplateGenerator`. It's really easy, and you are likely to use it often.
Here you can see an example of how we can use `TemplateGenerator` to create a new template:

```java title="java/agents/Felix.java"

new TemplateGenerator("exampleTemplate")
            .addComponent("title", new TitleComponent("Screen Title"))
            .addComponent("description", new DescriptionComponent("Here is where we put the description."))
            .addComponent("input", new InputComponent("name", "Type your name…", true))
            .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("Option 1", "NextScreen1"),
                        new PrimarySubmitButtonComponent("Option 2", "NextScreen2")
)));
```

Let's break down this example code: when initiating a `TemplateGenerator`, the first thing we can optionally set (`"exampleTemplate"`) 
is the screen name. After that we add the components we want our template to contain, for example: title, description, input field and a group of buttons. If you don't specify the `componentOrdering` explicitly, the components will appear on the screen in the order you add them in the `TemplateGenerator`.
Components are all added as entries of a `HashMap` with a string identifier as key (usually `“input1”`, `“input2”` etc. in case of there are multiple components of the same type) and the component object itself as value.

You can combine elements like these in any order you'd like. 

// TODO would move this to another section completely? maybe even in a different ordering (move out of concepts section entirely)
# Meet Felix!

Now that you're familiar with the basics, you are ready to start coding! To make your learning process a bit easier, we'll take you through creating a simple onboarding agent named Felix. 
With Felix you will build onboarding screens, create a short survey for user profiling, and try out different kinds of components.
// TODO mozda naglasiti value-bringing values jos vise u intru?

Let's just jump right into coding!


// TODO 1. would move all references to code below the code block. 2. why is this a method for chaining screens for a single screen, 3. avoid adding armoryhistory before you need to use it (better edit existing code than confuse users with too many new concepts).
First, inside the ```Felix.java``` file, we create the showStartScreens method, add screen template, and add components we want our first screen to have.  
Maybe you are wondering what's up with the armoryHistory? Good question. 
Armory history is another component made for memorizing last screen you were at. At the beginning, we don't really need it, but it will come in handy later when we'll have multiple chained screens.  

```java title="java/agents/Felix.java"

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
// TODO why do we need the onboardingStage? drop it if not necessary, explain if it is. you also need to explain the structure of the function (although it shouldn't be a function)
// TODO I'm also pretty sure this code doesn't show any screens :D

Okay, now when the function is defined, all we need is a rule that will tell the agent to show the screens once the user connects to Armory by clicking the link.  
Go to ```Felix.drl``` and add the following:

```java title="rules/felix/Felix.drl"
package rules.felix;

import com.mindsmiths.armory.event.UserConnectedEvent
import com.mindsmiths.armory.event.SubmitEvent
import com.mindsmiths.ruleEngine.util.Log 

import agents.Felix


rule "Start flow"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Felix(onboardingStage != "ONBOARDED")
   then
       agent.showStartScreens();
       delete(signal);
end
```

That's it! You can now run forge and start toying around with Felix!