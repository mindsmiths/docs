---
sidebar_position: 4
---

# Generating templates

Instead of using the predefined screen templates, like we did in our demo rule, or you can play around and build custom screens using the template generator. 

So, let's explore the `TemplateGenerator`, since you are likely to use it quite often in creating your screens.

:::tip
You can find a more detailed description of the `TemplateGenerator()` in the [docs](/docs/integrations/web).
:::

We'll take you through creating a simple agent named Felix, who will gather information about you and your workout preferences. 
With Felix you will build onboarding screens, create a short survey for user profiling, and try out a bunch of different components.

Let's just jump right in!

First, inside the `Felix.java` file, we create the `showOnboardingScreens()` function, add screen template, and add components we want our first screen to have.  

```java title="java/agents/Felix.java"
...
import com.mindsmiths.armory.component.TitleComponent;
import com.mindsmiths.armory.component.PrimarySubmitButtonComponent;
import com.mindsmiths.armory.template.TemplateGenerator;

@Data
@NoArgsConstructor
public class Felix extends Agent {
    String name;

    public void showWelcomeScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator("welcome")      
                    .addComponent("title", new TitleComponent("Hello! I'm Felix and I'm here to help you find the best workout plan for you. Ready?")) 
                    .addComponent("submit", new PrimarySubmitButtonComponent("submit", "Cool, let's go!", "askForName")));
        showScreens("welcome", screens);
    }
    ...
}
```
Let's look at this code real quick: we first create a map of screens we want to show (currently containing just a single screen), with the `screenName` as key, 
and the screen generated with the `TemplateGenerator()` as value. Our first screen consists of some text and a button that will eventually take us to the next screen in the sequence.

But enough with the spoilers! Let's first add a rule that will tell the agent to show the defined screens once the user connects to Armory.
Go to ```Felix.drl``` and add the following:

```java title="rules/felix/Felix.drl"
...
rule "Onboard new user"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Felix(name == null)
   then
       agent.showWelcomeScreens();
       delete(signal);
end
```

To make sure everything is in place, you can already run the code with `forge run` and click the link. Instead of the "Hello world!", you should now see the message from Felix and a button.

As always, feel free to customize the texts to your liking! Otherwise, we are ready for the next step.