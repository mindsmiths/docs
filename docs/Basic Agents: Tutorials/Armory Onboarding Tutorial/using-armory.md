---
sidebar_position: 3
---

# Hello world!

Similarly as in other tutorials, create the file `java/agents/Mindy.java` and add the following:

```java title="rule_engine/src/main/java/agents/Mindy.java"
package agents;

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

Your agent now controls when the user is shown some screen or a predefined sequence of screens using ArmoryAPI. So let's create our first screen!

Every screen consists of components, and you can either use screen templates we already have pre-defined, or you can build screens yourself using the template generator. 
Let’s first use the TemplateGenerator, since you will likely use this more often.

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

This screen will only contain a single component, which will be a title.
Now we need to create a rule when this demo screen should be shown. Again, create the file `rules/mindy/Mindy.drl` and add the rule:

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

You are now ready to run! Start the platform with ```forge run``` and click on the Armory URL you got when running `armory-admin setup`.
Don't worry, in case you lost it, the format is: ```http://8000.YOUR WEB IDE LINK```. You can see this link in your `.env` file located at the root of your project. 

Cool! Now that you have the setup to toy around with, we can take a closer look at what you can do with Armory.