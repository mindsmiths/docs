---
sidebar_position: 3
---

# Hello world

Now, give this new service a try! 

Let's start with something simple: a single "Hello world" screen! Just create the file java/agents/Felix.java and add the following functions:

```java title="java/agents/Felix.java"
package agents;

import com.mindsmiths.ruleEngine.model.Agent;
import lombok.*;

import com.mindsmiths.armory.ArmoryAPI;
import com.mindsmiths.armory.Screen;

import com.mindsmiths.armory.component.Title;

@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Felix extends Agent {
    public void showHelloScreen() {
        ArmoryAPI.show(
            getConnection("armory"),
            new Screen ("Hello")
                .add(new Title("Hello world!"))
        );
    }
}
```
:::tip
Every armory screen is built up of multiple components. In this case, we are only using the "Title component", but you can see a breakdown of the components we have available for you [here](/docs/integrations/web).
:::

```java title="rules/felix/Felix.drl"
package agents;

import agents.Felix;

import com.mindsmiths.ruleEngine.model.Heartbeat
import com.mindsmiths.armory.event.UserConnected
import com.mindsmiths.armory.event.Submit
import com.mindsmiths.ruleEngine.util.Log

rule "Hello world"
    when
        signal: UserConnected() from entry-point "signals"
        agent: Felix()
    then
        agent.showHelloScreen();
        delete(signal);
end
```

The `UserConnected()` event is emitted when the user connects to Armory, so the screen with text "Hello world!" will appear every time the user enters the link. 

:::tip
You can find out more about the Armory events in the section with [Armory concepts](/docs/integrations/web).
:::

But enough talk, let's see this in action! Run the code with `forge run` and click on the Armory URL you got when running `armory setup`.

:::tip
Don't worry, in case you lost it, the format is: `http://8000.YOUR-WEB-IDE-LINK` (or you can just look for it in the `.env` file in the root of your project).
:::

Cool, now that you're familiar with the basics, you are ready to start coding!

P.S. We don't need the `"Hello world"` rule, so feel free to remove it.