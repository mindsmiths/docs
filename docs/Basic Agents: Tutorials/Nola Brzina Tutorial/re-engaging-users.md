---
sidebar_position: 9
---

# Re-engaging users

Let’s now think a bit about how we can make your agent a bit more emotionally intelligent to improve the user experience.

For instance, before forgetting the conversation, you might want to try to re-engage your inactive user first.

The logic is simple and should already be familiar to you: if more than a minute passes since the user’s last interaction in an ongoing conversation, ask GPT-3 to generate a message in an attempt to re-engage the user in a creative way.
The new rule in ```Conversation.drl``` looks like this:

```java title="rules/nola/Conversation.drl"
...
// highlight-added-start
rule "Re-engage user"
    when
        Heartbeat(ts: timestamp) from entry-point "signals"
        agent: Nola(
            memory.isEmpty() == false,
            lastInteractionTime before[1m] ts,
            pinged == false
        )
    then
        modify(agent) {
            addInstruction("Continue conversation with human because they are inactive."),
            setPinged(true)
        };
        agent.askGPT3();
end
// highlight-added-end
```

With the ```pinged``` flag you control how many times you contact the user. By setting it to ```true```, you avoid triggering the rule multiple times and spamming the user with messages.
With ```addInstruction(...)``` you explicitly instruct GPT-3 on what kind of message you want it to generate for re-engaging the user.
We also need to add ```pinged``` and ```addInstruction``` to ```Nola.java```:

```java title="models/agents/Nola.java"
...

@Getter
@Setter
public class Nola extends Agent {

    // highlight-added-line
    private boolean pinged;
    ...

    // highlight-added-start
    public void addInstruction(String text){
        memory.add(text + "\n");
        trimMemory();
    }
    // highlight-added-end
    ...
}
```

Notice that this way, re-engagement will work only once: whenever the user continues the conversation after Nola’s ping, the ```pinged``` flag needs to be set back to ```false```. This way Nola can react again next time the user is idle.


We just add the following line to ```"Handle message"```:

```java title="rules/nola/Conversation.drl"
...
rule "Handle message"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
    then
        modify(agent) {
            addMessageToMemory("Human", message.getText()),
            // highlight-added-line
            setPinged(false),
            setLastInteractionTime(new Date())
        };
        agent.askGPT3();
        delete(message);
end
```

Well done! You now have a more caring agent that proactively and creatively tries to keep the user in the conversation should she/he stop responding.


As always, you can try it with **forge reset** and **FORGE RUN**.

