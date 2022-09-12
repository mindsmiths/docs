---
sidebar_position: 2
---

# Using Armory in the project

You can add the following functions to the `Mindy.java`:

```java title="rule_engine/src/main/java/agents/Mindy.java"
package agents;

import java.util.List;
import java.util.Map;

import com.mindsmiths.armory.ArmoryAPI;
import com.mindsmiths.armory.templates.BaseTemplate;
import com.mindsmiths.armory.templates.TemplateGenerator;
import com.mindsmiths.armory.components.TitleComponent;
import com.mindsmiths.ruleEngine.model.Agent;
import lombok.*;

@Data
@NoArgsConstructor
public class Mindy extends Agent {

    public Mindy(String connectionId) {
        super("armory", connectionId);
    }
    
    public Mindy(String connectionName, String connectionId) {
        super(connectionName, connectionId);
    }

    public void showScreen(BaseTemplate screen) {
        ArmoryAPI.showScreen(getConnection("armory"), screen);
    }

    public void showScreens(String firstScreenId, Map<String, BaseTemplate> screens) {
        ArmoryAPI.showScreens(getConnection("armory"), firstScreenId, screens);
    }
}
```

Your agent can now show the user a screen, or a predefined list of screens. So let’s look at how we create those.

Every screen consists of components, and you can either use screen templates we already pre-defined, or you can build screens yourself using the template generator. Let’s first use the TemplateGenerator, since you will likely use this more often.

Add the following to your agent class:
```java title="rule_engine/src/main/java/agents/Mindy.java"
...
@Data
@NoArgsConstructor
public class Mindy extends Agent {
    ...
    public void showDemoScreen() {
       // Using the template generator with available components
       BaseTemplate screen = new TemplateGenerator()
               .addComponent("title", new TitleComponent("Hello, world!"));
       showScreen(screen);
    }
    ...
}
```

Now just add a rule that will trigger this method:

``` java title="rule_engine/src/main/resources/rules/mindy/Mindy.drl"
package rules.mindy

import com.mindsmiths.armory.events.UserConnectedEvent

import agents.Mindy

rule "Hello world"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Mindy()
   then
       agent.showDemoScreen();
       delete(signal);
end
```

Finally, run the code with ```forge run``` and click on the Armory URL you got when running armory-admin setup.
Don't worry, in case you lost it, the format is: ```http://8000.YOUR WEB IDE LINK```. 

Cool! Now that you have the setup to toy around with, we can take a closer look at what Armory actually is.

