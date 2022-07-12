---
sidebar_position: 7
---

# Signal communication

We already mentioned signals on a couple occasions, but let’s take a closer look at how communication on the platform actually works.

## Part 1: Sending internal signals

Apart from communicating with their users, we already mentioned the agents can communicate with each other.
For example, your developer agent, Agent Smith, could be notified each time a new agent is created, to keep track of all the new users in the system.
All we need to do is have Nola send a signal to Smith whenever a new agent of this type is created. Just add the following line to ```"First contact"``` rule:

```java title="rules/nola/Conversation.drl"
rule "First contact"
    salience 100
    when
        initialize: Initialize() from entry-point "agent-created"
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
    then
        agent.sendMessage("Okay, turning my engines on. Let's start!");
        // highlight-next-line
        agent.send("SMITH", initialize, "new-agent");
        delete(message);
end
```

To send the signal, you need to specify the id of the agent you’re sending the signal to (```"SMITH"```), the object you’re sending (the initialize signal) and optionally the entry point you want to send it to (```"new-agent"```, default is ```"signals"```).


We now need to process the signal on Agent Smith’s end. Add a new file ```rules/smith/Agents.drl``` with the following content:

```java title="rules/smith/Agents.drl"
package rules.smith;

import com.mindsmiths.ruleEngine.model.Initialize;
import com.mindsmiths.ruleEngine.util.Log;


rule "Register new agent"
    when
        initAgent: Initialize(agent: agent) from entry-point "new-agent"
    then
        Log.info("New agent: " + agent);
        delete(initAgent);
end
```

Notice that in this simple case, the total number of active agents will correspond to the number of registered users (with the exception of Agent Smith, who doesn’t have a user). In more complex scenarios, this might not be the case.


That’s it! Write **forge reset** in the Terminal first to clear the database and start **FORGE RUN** to try it out!

## Part 2: Handling external signals

The communication with the outside world also happens via signals. Earlier in the tutorial when we connected Telegram to our platform, the piece of code for routing the incoming Telegram signals to the appropriate agent was generated in the background.
You can check the file that gets generated in this YAML file:

```yaml title="services/rule_engine/src/main/resources/config/signals.yam"
com.mindsmiths.telegramAdapter.TelegramReceivedMessage:
  - !GetOrCreateAgentByConnection
    connectionName: telegram
    connectionField: chatId
    agentType: agents.Nola
```

You can see the name of your agent under ```agentType```. This file is used in the Rule Engine’s ```Runner.java``` file:

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
The signal we catch from Telegram is of type ```TelegramReceivedMessage```. When the signal arrives, the platform tries to find the agent (```findAgentsWithConnection(...)```) assigned to handle Telegram messages received from the user with that ```chatId```.


The type of agent that gets assigned to handle the messages is the one you specify when adding the service (Nola).
If no such agent exists, a new one is created to handle messages coming from this communication channel.


This time you don’t need to write any code yourself, but we’re showing you ```Runner.java``` because this is the place where you will be catching and routing all incoming external signals you want the platform to handle.

