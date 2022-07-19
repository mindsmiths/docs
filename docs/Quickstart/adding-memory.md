---
sidebar_position: 4
---

# Creating a conversation

Right now Nola can only respond to your last message and won’t remember the previous interactions. To make the communication more human-like, we can give Nola the ability to remember your conversations.

So let’s simply add memory to Nola’s model:

```java title="models/agents/Nola.java"
@Getter
@Setter
public class Nola extends Agent {

    // highlight-added-line
    private String memory = "";
    
    ...

    // highlight-added-start
    public void addMessageToMemory(String sender, String text){
        memory += String.format("%s: %s\n", sender, text);
    }

    public void askGPT3() {
        String intro = "You're an AI system called Nola Brzina talking to a human. You want to have an engaging and fun conversation. You are friendly, creative and innovative.\n";
        simpleGPT3Request(intro + String.join("\n", memory) + "\nNola:");
    }
    // highlight-added-end

    ...
}
```

Perfect! As you can see, we are simply storing messages in memory, and feeding that as input to GPT-3. 
Let’s also reflect these changes in the rules ```"Handle message"``` and ```"Send GPT3 response"``` to store every new message from the user or GPT-3 to ```memory```: 

```java title="rules/nola/Conversation.drl"
...

rule "Handle message"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
    then
        // highlight-added-line
        modify(agent) {addMessageToMemory("Human", message.getText())};
        // highlight-changed-line
        agent.askGPT3();
        delete(message);
end


rule "Send GPT3 response"
    when
        gpt3Result: GPT3Completion() from entry-point "signals"
        agent: Nola()
    then
        String response = gpt3Result.getBestResponse();
        agent.sendMessage(response);
        // highlight-added-line
        modify(agent) {addMessageToMemory("Nola", response)};
        delete(gpt3Result);
end
```

:::note
The ```modify``` command is the equivalent of changing the value using Java’s setter method directly, but it also notifies the rule engine that the object has changed. This way the rules which use the changed object as a condition can be re-evaluated given the new state of affairs.
:::

Cool, **reset** and **run**! You can now have an actual conversation with Nola. Feel free to experiment further by tweaking the input parameters!
