---
sidebar_position: 3
---

# Template generator

You can either use the already pre-defined screen templates, or you can play around and build screens yourself using the template generator. 
For example, instead of using the `TemplateGenerator`, we could've generated our demo screen just using the `TitleTemplate`: `BaseTemplate screen = new TitleTemplate("Hello, world!");`.
But where is fun in using predefined things, right? So let's jump right into playing with the `TemplateGenerator`. It's really easy, and you are likely to use it often.
We'll be using it to build Felix, so let's jump right into it.

# Meet Felix!

Now that you're familiar with the basics, you are ready to start coding! To make your learning process a bit easier, we'll take you through creating a simple onboarding agent named Felix. 
With Felix you will build onboarding screens, create a short survey for user profiling, and try out different kinds of components.

Let's just jump right into coding!

First, inside the ```Felix.java``` file, we create the showStartScreens method, add screen template, and add components we want our first screen to have.  

```java title="java/agents/Felix.java"

package agents;

...

import java.util.Map;
import com.mindsmiths.armory.component.PrimarySubmitButtonComponent;

...

public class Felix extends Agent {
    String name;
    String onboardingStage = "START";

    public void showStartScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator ("welcome")      
                .addComponent("title", new TitleComponent("Hello! I'm Felix and I'm here to help you find the best workout plan for you. Ready?")) 
                .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")));
        showScreens("welcome", screens);
    }
}
```
Okay, now when the function is defined, all we need is a rule that will tell the agent to show screens once the user connects to Armory by clicking the link.  

Go to ```Felix.drl``` and add the following:

```java title="rules/felix/Felix.drl"

rule "Start flow"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Felix(onboardingStage != "ONBOARDED")
   then
       agent.showStartScreens();
       delete(signal);
end
```

That's it! Now write `forge run` in terminal and start toying around with Felix!