---
sidebar_position: 4
---

# Polishing the user experience

You now have a cute little parrot, and we can start building up from that.
Let’s begin by making our agent a bit more polite! We’ll add some special behavior for the first message the user sends.

All we need to do is add a new rule in the ```Conversation.drl``` file:

```java title="rules/Nola/Conversation.drl"
// highlight-added-line
import com.mindsmiths.ruleEngine.model.Initialize;
...
// highlight-added-start
rule "First contact"
    salience 100
    when
        initialize: Initialize() from entry-point "agent-created"
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
    then
        agent.sendMessage("Ok, turning my engines on. Let's start!");
        delete(message);
end
// highlight-added-end
```

:::info
From this point on, we will use highlighted lines to mark added or changed lines in our files. 
:::

There are only a couple new concepts we need to introduce compared to the last rule.
To single out only the first received message, we make use of a special signal ```Initialize()``` the platform sends to the entry point ```"agent-created"```  when creating agents.


Another important part is the ```salience``` parameter. Rules with higher salience have priority over the ones with lower salience, so you can think of it as a way of imposing order of execution on rules triggered by similar conditions. So, if we want our new rule to trigger before ```"Handle message"``` (which has the default salience of ``0``), we can set its salience to ``100``. Saliences can also be negative, which is useful for writing catch-all rules that make sure no signal stays unprocessed.


Since an agent for your Telegram number already exists, stop the system with ```Ctrl+C ``` and write **forge reset** to clear the database.
Start everything again with **forge run** to try out your new rule by sending a hello message!
