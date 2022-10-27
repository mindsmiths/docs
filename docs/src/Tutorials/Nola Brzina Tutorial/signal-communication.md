---
sidebar_position: 7
---

# Signal communication

We already mentioned signals on a couple of occasions, but let’s take a closer look at how communication on the platform actually works.

## Part 1: Sending internal signals

Apart from communicating with their users, we already mentioned the agents can communicate with each other.
For example, your developer agent, Agent Smith, could be notified each time a new agent is created, to keep track of all the new users in the system.
All we need to do is have Nola send a signal to Smith whenever a new agent of this type is created. 

For this we just need to define a new signal. Signals are nothing else but Java classes that contain the data we want to communicate.
Signals directed at a particular receiver are called `Messages`.
So let's create a new directory and file in which we'll structure our message, `models/signals/AgentCreated.java`:

```java title="models/signals/AgentCreated.java"
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

Now, we’ll add some special behavior for the first message the user sends. To send the signal, we'll add new rule to `Conversation.drl`:

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
end
// highlight-added-end
```
To single out only the first received message, we make use of the ```Initialize()``` signal the platform sends when creating agents.


As mentioned, `Messages` are signals sent to a specific entity (agent or service), so when sending this signal 
you need to specify the id of the receiving agent (`"SMITH"`) along with the object you’re sending (the `AgentCreated` signal).
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

## Part 2: Handling external signals

The communication with the outside world also happens via signals. Earlier in the tutorial when we connected Telegram to our platform, 
the piece of code for routing the incoming Telegram signals to the appropriate agent was generated in the background.
You can check the file that gets generated in this `yaml` file:

```yaml title="services/rule_engine/resources/config/signals.yaml"
com.mindsmiths.telegramAdapter.events.TelegramReceivedMessage:
  - !GetOrCreateAgentByConnection
    connectionName: telegram
    connectionField: chatId
    agentType: agents.Nola
```

You can see the name of your agent was inserted under ```agentType```. This file is used in the Rule Engine’s ```Runner.java``` file:

```java title="models/Runner.java"
import agents.Smith;
import com.mindsmiths.ruleEngine.runner.RuleEngineService;
import com.mindsmiths.ruleEngine.util.Agents;


public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        configureSignals(getClass().getResourceAsStream("config/signals.yaml"));

        if (!Agents.exists(Smith.ID))
            Agents.createAgent(new Smith());
    }
    ...
}
```
The signal we catch from Telegram is of type ```TelegramReceivedMessage```. 
When the signal arrives, the platform tries to find the agent assigned to handle Telegram messages (`Nola()`) received 
from the user with that Telegram number (`chatId`).

The type of agent that gets assigned to handle the messages is the one you specify when adding the service.
If no such agent exists, a new one is created to handle messages coming from this communication channel.


In this part you don’t need to write any code yourself - we just wanted to show you `Runner.java` because this is the place where you will be catching and routing all incoming external signals you want the platform to handle.

