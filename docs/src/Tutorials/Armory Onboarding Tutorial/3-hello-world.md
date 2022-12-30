---
sidebar_position: 3
---

# Hello world!

Now, give this new service a try! 
Let's start by giving our agent the ability to show the Armory screens. Just create the file `java/agents/Felix.java` and add the following functions:

```java title="java/agents/Felix.java"
package agents;

import java.util.Map;

import com.mindsmiths.armory.ArmoryAPI;
import com.mindsmiths.armory.template.BaseTemplate;
import com.mindsmiths.ruleEngine.model.Agent;
import lombok.*;

@Data
@NoArgsConstructor
public class Felix extends Agent {

   public void showScreen(BaseTemplate screen) {
       ArmoryAPI.showScreen(getConnection("armory"), screen);
   }

   public void showScreens(String firstScreenId, Map<String, BaseTemplate> screens) {
       ArmoryAPI.showScreens(getConnection("armory"), firstScreenId, screens);
   }
}
```

These are the basic functions that allow you to control how screens, 
either a single one or a sequence of them, are presented to the users using the ArmoryAPI.

:::tip
Every screen template is built up of multiple components. You can see a breakdown of the components we have readily available for you [here](/docs/integrations/web).
:::

Let's start with something simple: a single "Hello world" screen built using the `TitleTemplate`.
Just import the template in the rule and use your `showScreen()` function to display it when the user clicks the Armory link:

```java title="rules/felix/Felix.drl"
package rules.Felix

import agents.Felix
import com.mindsmiths.armory.template.TitleTemplate
import com.mindsmiths.armory.event.UserConnectedEvent

rule "Hello world"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Felix()
   then
       agent.showScreen(new TitleTemplate("Hello world!"));
       delete(signal);
end
```

The `UserConnectedEvent()` is emitted when the user connects to Armory, so the screen with text "Hello world!" will appear every time the user enters the link. 

:::tip
You can find out more about the Armory events in the section with [Armory concepts](/docs/integrations/web).
:::

But enough talk, let's see this in action! Run the code with `forge run` and click on the Armory URL you got when running `armory-admin setup`.

:::tip
Don't worry, in case you lost it, the format is: `http://8000.YOUR-WEB-IDE-LINK` (or you can just look for it in the `.env` file in the root of your project).
:::

Cool, now that you're familiar with the basics, you are ready to start coding!

P.S. We don't need the `"Hello world"` rule, so feel free to remove it.