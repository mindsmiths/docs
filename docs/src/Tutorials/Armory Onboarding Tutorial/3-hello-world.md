---
sidebar_position: 2
---

# Hello world!

Now, let's start coding! 
Let's start by giving our agent the ability to show the web screens. Just create the file `java/agents/Felix.java` and add the following functions:

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

Your agent can now control how screens, either a single one or a sequence of them, are presented to the user using the ArmoryAPI.  

Every screen template is built up of multiple components we'll introduce you to later in this tutorial. For the moment we'll just build a demo screen using `TemplateGenerator`.

Just continue where you left off and add the following to the agent's java class:

```java title="java/agents/Felix.java"
...
import com.mindsmiths.armory.template.TemplateGenerator;
import com.mindsmiths.armory.component.TitleComponent;
...

@Data
@NoArgsConstructor
public class Felix extends Agent {

    ...

    public void showDemoScreen() {
       BaseTemplate screen = new TemplateGenerator()
               .addComponent("title", new TitleComponent("Hello, world!"));
       showScreen(screen);
    }
    ...
}
```

You can try this out by adding a rule that will call the `showDemoScreen()` function. First add the rule directory with your agent's name and the `.drl` file: 

```java title="rules/felix/Felix.drl"

package rules.Felix

import agents.Felix
import com.mindsmiths.armory.events.UserConnectedEvent

rule "Hello world"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Felix()
   then
       agent.showDemoScreen();
       delete(signal);
end
```

This rule just identifies the moment the user connected to the Armory link and shows the demo screen, consisting of just a single element - text "Hello, world!".

Finally, run the code with `forge run` and click on the Armory URL you got when running `armory-admin setup`.
Don't worry, in case you lost it, the format is: ```http://8000.YOUR-WEB-IDE-LINK``` (or you can just look for it in `.env` file). 

Cool! Now that you have the setup to toy around with, we can take a closer look at what Armory actually is, and what you can do with it.