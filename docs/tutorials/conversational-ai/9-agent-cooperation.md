---
sidebar_position: 9
---

# Agent cooperation

We already mentioned signals on a couple of occasions, but let’s take a closer look at how communication on the platform actually works.
This is important to understand if you want to build a more complex system, where multiple agents cooperate with each other.

## Sending signals between agents

Apart from communicating with their users, we already mentioned the agents can communicate with each other.
For example, your developer agent, Agent Smith, could be notified each time a new agent is created, to keep track of all the new users in the system.
All we need to do is have Nola send a signal to Smith whenever a new agent of this type is created. 

For this we just need to define a new signal. Signals are nothing else but Java classes that contain the data we want to communicate.
Signals directed at a particular receiver are called `Messages`.
So let's create a new directory and file in which we'll structure our message, `java/signals/AgentCreated.java`:

```java title="java/signals/AgentCreated.java"
package signals;

import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.sdk.core.api.Message;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentCreated extends Message {
    Agent agent;
}
```

Now, we’ll add some special behavior for the first message the user sends. To send the signal, we'll add a new rule to `Conversation.drl`:

```java title="rules/nola/Conversation.drl"
// highlight-added-line
import com.mindsmiths.ruleEngine.model.Initialize
// highlight-added-line
import signals.AgentCreated
...
// highlight-added-start

rule "First contact"
    when
        initialize: Initialize() from entry-point "signals"
        agent: Nola()
    then
        agent.sendMessage("Okay, turning my engines on. Let's start!");
        agent.send("SMITH", new AgentCreated(agent));
        delete(initialize);
end
// highlight-added-end
```
To pinpoint the very first contact the user makes with the platform, we make use of the ```Initialize()``` signal the platform sends when agents are created.


As mentioned, `Messages` are signals sent to a specific entity (agent or service). That's why you need to specify the id of the receiving agent (`"SMITH"`), along with the object you’re sending (the `AgentCreated` signal).
All signals are by default always sent to the entry-point `"signals"`.


Now all that's left is to process the message on Agent Smith’s end! Add a new file ```rules/smith/Agents.drl``` with the following content:

```java title="rules/smith/Agents.drl"
package rules.smith;

import com.mindsmiths.ruleEngine.util.Log

import signals.AgentCreated

rule "Register new agent"
    when
        signal: AgentCreated(agent: agent) from entry-point "signals"
    then
        Log.info("New agent: " + agent);
        delete(signal);
end
```

Notice that in this simple case, the total number of active agents will correspond to the number of registered users 
(with the exception of Agent Smith, who doesn’t have a user). In more complex scenarios, this might not be the case.

That’s it! Write **forge reset** in the Terminal first to clear the database and start **forge run** to try it out!

:::tip
If you want to learn more about signals, check out the [documentation](/docs/platform/advanced-concepts/service-communication).
:::

P.S. You can find the entire code on our GitHub → `https://github.com/mindsmiths/examples/tree/main/nola`!

:::note 
To spare you some time - here is `Nola.drl` file → ``https://github.com/mindsmiths/examples/tree/main/nola/services/rule_engine/src/main/resources/rules/nola``, 
and here is `Nola.java` file → ``https://github.com/mindsmiths/examples/blob/main/nola/services/rule_engine/src/main/java/agents/Nola.java``. 
:::