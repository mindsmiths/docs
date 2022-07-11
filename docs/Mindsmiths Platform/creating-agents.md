---
sidebar_position: 6
---

# Creating agents

To create a new type of agent, you just need to define two things:
1. Agent's data model (Java class)
2. Agent's rules

## Defining the agent's data model
The agent's data model defines the fields and methods which the agent can use in the rules. For example:

```java title="models/agents/Butler.java"
package agents;

import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.telegramAdapter.TelegramAdapterAPI;
import lombok.*;

@Getter
@Setter
public class Butler extends Agent {

    String name;
    List<String> messageHistory = new LinkedList<>();

    public Butler(String name, String telegramId) {
        this.name = name;
        addConnection("telegram", telegramId);
    }

    public void sendMessage(String text) {
        String chatId = getConnections().get("telegram");
        TelegramAdapterAPI.sendMessage(chatId, text);
    }
}
```

Here we define a new agent type `Butler`. Each "Butler" agent has a name, a connection to a Telegram number, and its own message history.
Additionally, it has a `sendMessage` method that we can call to send a Telegram message to the connected number.

Of course, you don't have to define any of these things and have an empty class, or add fields/methods that you need.


## Defining the agent's rules
First we need to create a new package for rules.
Go to `rules/` (`services/rule_engine/resources/rules/`) and create a new folder `butler/`.
The folder *must* be called the same as the agent's class (ignoring casing - camelCase is recommended).

The agent will only evaluate rules within this package (and the global package).
Within that package, you can create other subpackages to organize your rules.

Now we can create a new `.drl` file where we'll write our rules.
The name of the file is not important, but give it something meaningful so that you can find your rules easier.
You can organize your rules in multiple `drl` files, and each one can contain multiple rules.

For example:
```java title="rules/butler/Conversation.drl"
package rules.butler;

import com.mindsmiths.ruleEngine.model.Initialize;
import com.mindsmiths.telegramAdapter.TelegramReceivedMessage;
import agents.Butler;

rule "Agent created"
    when
        message: Initialize() from entry-point "agent-created"
        agent: Butler()
    then
        agent.sendMessage("Booting up!");
end

rule "Handle message"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Butler()
    then
        agent.sendMessage(message.getText());
        delete(message);
end
```

Important: always make sure the `package` statement defines the correct package.
Otherwise, your rules may not be evaluated or be evaluated by the wrong agent.

To learn more about writing rules, see "Writing rules" (TODO).


## Creating a new agent instance
There are multiple ways to create a new agent instance.

### Manually
To manually create an actual agent instance, use `Agents.createAgent()`. It accepts a single parameter - the agent's java class instance.
For example:
```java
Agents.createAgent(new Butler("Albert", "012345678"));
```

You can do this in:
- `Runner.java`
- In the `then` part of another agent's rule
- In another agent's method
- On an event (see "Connecting events" (TODO))



### Through the API



## Connecting events
In order for your agent to be able to react to external events, we need to register these events and forward them to the agent of our choice.


