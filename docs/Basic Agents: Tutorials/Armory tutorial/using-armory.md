---
sidebar_position: 2
---

# Using Armory in the project

You can add the following functions to  the java file of the agent you chose for handling signals (e.g. Nola.java):

```java title="models/agents/Nola.java"
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
public class Nola extends Agent {

    public Nola(String connectionId) {
        super("armory", connectionId);
    }
    
    public Nola(String connectionName, String connectionId) {
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
```java title="rule_engine/src/main/java/agents/Nola.java"
public void showDemoScreen() {
   // Using the template generator with available components
   BaseTemplate screen = new TemplateGenerator()
           .addComponent("title", new TitleComponent("Hello, world!"));
   showScreen(screen);
}
```
Now just add a rule that will trigger this method:
``` java title="rule_engine/src/main/resources/rules/nola/Nola.drl"
package rules.nola

import com.mindsmiths.armory.events.UserConnectedEvent

import agents.Nola

rule "Hello world"
   when
       signal: UserConnectedEvent() from entry-point "signals"
       agent: Nola()
   then
       agent.showDemoScreen();
       delete(signal);
end
```

Finally, run the code with ```forge run``` and click on the Armory URL you got when running armory-admin setup
Don't worry, in case you lost it, the format is: ```https://8000.YOUR WEB IDE LINK```. In order to see the beginning of our onboarding flow, 
you need to add any text at the end of this link, which will be used as  ```connectionId``` for our agent.
For example, ```https://8000.YOUR WEB IDE LINK/randomText```. Everytime you change it, another agent with that specific ```connectiondId``` is created.

Cool! Now that you have the setup to toy around with, we can take a closer look at what Armory actually is.

