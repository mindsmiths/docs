---
sidebar_position: 6
---

# Controlling conversation history

We hope you are having a lot of fun with your intelligent conversation partner!
We can now move on to implementing some more advanced features, like controlling the conversation history.


We’ll implement three forgetting mechanisms: first we will limit the amount of information retained in Nola’s memory,
then we’ll add the triggering of history clearing using a keyword.
Lastly, we’ll make Nola forget the interactions after a certain amount of time passes since the last interaction.


## Regulating old messages

Similarly to how you would expect a human to only be able to retain a certain amount of information during a conversation,
it is also unrealistic to give your agent unlimited memory.
So let’s implement the simplest way to control memory size by hardcoding the number of previous interactions we want to maintain.
Add the following to ```Nola.java```:

```java title="java/agents/Nola.java"
...
// highlight-added-line
import java.util.ArrayList;
...

@Getter
@Setter
public class Nola extends Agent {

    // highlight-changed-start
    private List<String> memory = new ArrayList<>();
    private int MAX_MEMORY = 6;
    // highlight-changed-end

    ...
    // highlight-added-start
    private void trimMemory() {
        if (memory.size() > MAX_MEMORY + 1)
            memory = memory.subList(memory.size() - 1 - MAX_MEMORY, memory.size());
    }
    // highlight-added-end

    public void addMessageToMemory(String sender, String text) {
        // highlight-changed-line
        memory.add(String.format("%s: %s\n", sender, text));
        // highlight-added-line
        trimMemory();
    }
    ...
}
```

To make things easier to maintain, we will now be building and trimming the memory with every interaction.


That’s it, just reset and run! Go ahead and experiment with the memory size until you find the optimal fit for your use case.


:::info
Keep in mind that OpenAI charges you by the size of request you send to GPT-3.
:::

## Resetting the conversation

Next thing we’ll learn is the simplest form of intent recognition: when the user writes the keyword “reset”, Nola’s memory will be cleared.
Let’s look at the new rule we need to add for Nola:

```java title="rules/nola/Conversation.drl"
rule "Reset conversation"
    salience 100
    when
        message: TelegramReceivedMessage(text.equalsIgnoreCase("reset")) from entry-point "signals"
        agent: Nola()
    then
        modify(agent) {resetMemory()};
        agent.sendMessage("I'll pretend this never happened 🤫");
        delete(message);
end
```

Another important part is the ```salience``` parameter. **Rules with higher salience have priority over the ones with lower salience**,
so you can think of it as a way of imposing order of execution on rules triggered by similar conditions. 

So, if we want our new rule to trigger before ```"Handle message"``` (which has the default salience of ``0``), we can set its salience to ``100``. 

:::tip
Salience can also be negative, which is useful for writing catch-all rules that make sure no signal stays unprocessed.
:::

All other components should already be familiar to you.
The only thing we still need to do is add the function for resetting the memory to ```Nola.java```.

```java title="java/agents/Nola.java"
@Getter
@Setter
public class Nola extends Agent {
    ...
    // highlight-added-start
    public void resetMemory() {
        memory.clear();
    }
    // highlight-added-end
    ...
}
```

Awesome! Nola can now completely forget previous interactions, and you can start your conversations afresh.
Click on **forge run** and try it out!


## Expiring the conversation

Finally, let’s also reset the conversation if the user stays idle for a certain amount of time.
We need to add a rule that uses time-based evaluations:

```java title="rules/nola/Conversation.drl"
...
// highlight-added-line
import com.mindsmiths.ruleEngine.model.Heartbeat;
...
// highlight-added-start
rule "Expire conversation"
    when
        Heartbeat(ts: timestamp) from entry-point "signals"
        agent: Nola(
            memory.isEmpty() == false,
            lastInteractionTime before[2m] ts
        )
    then
        modify(agent) {resetMemory()};
        agent.sendMessage("Talk to you some other time!");
end
// highlight-added-end
```

We read off the current time from the heartbeat - the periodic system pulse - and compare it to the last time the user sent a message.
For that we will also need to start tracking these interaction times. First we add `lastInteractionTime`:

```java title="java/agents/Nola.java"
...
// highlight-added-line
import java.time.LocalDateTime;
...

@Getter
@Setter
public class Nola extends Agent {
    private List<String> memory = new ArrayList<>();
    private int MAX_MEMORY = 6;
    // highlight-added-line
    private LocalDateTime lastInteractionTime;

    ...
}
```

And now we need to track the timestamp of every message the user sends to Nola.
We do this by adding the following change to the rule ```"Handle message"```:

```java title="rules/nola/Conversation.drl"
...
rule "Handle message"
    when
        // highlight-added-line
        Heartbeat(ts: timestamp) from entry-point "signals"
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
    then
        modify(agent) {
            // highlight-added-line
            setLastInteractionTime(ts),
            addMessageToMemory("Human", message.getText())
        };
        agent.askGPT3();
        delete(message);
end
```

:::caution
Although you could use `LocalDateTime.now()` to get the current time, it is not recommended to use it in rules.
Instead, always use the `timestamp` from the `Heartbeat`.
:::

And there we go! Nola will now automatically reset the conversation history if the user stops writing back.
Start up the system again with **forge run** to test it out!
