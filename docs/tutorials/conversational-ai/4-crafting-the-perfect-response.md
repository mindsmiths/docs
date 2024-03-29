---
sidebar_position: 4
---

# Crafting the perfect response

You now have a cute little parrot. Next step – make Nola’s responses a little more exciting.
**Enter: artificial intelligence models!**

We’ll replace our simple echo response with a more intelligent response from OpenAI’s GPT-3 model. 
This model generates a text completion result for any input prompt you send it.

:::note
If you don't know much about GPT-3, check out some [examples](https://beta.openai.com/examples/) to see what it can do.
:::

To use the model, you will need an [OpenAI account](https://beta.openai.com/account/api-keys).
There you'll get the OpenAI API key. Now add GPT-3 to your project by running the following command:

```bash title="Terminal"
pip install "gpt3-adapter[dev]"
gpt3-adapter setup
```

We can now make requests to GPT-3 and receive its responses. We just need to adapt the rule for handling the incoming message, and add one for processing the GPT-3 response.

:::info
From this point on, we will use highlighted lines to mark added or changed lines in our files: **added lines are marked in green, deleted in red, and modified in yellow**.
:::

Add the following to your rule file:
```java title="rules/nola/Conversation.drl"
...
// highlight-added-line
import com.mindsmiths.gpt3.completion.GPT3Completion
...
rule "Handle message"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
    then
        // highlight-changed-line
        agent.askGPT3(message.getText());
        delete(message);
end

// highlight-added-start
rule "Send GPT3 response"
    when
        gpt3Result: GPT3Completion() from entry-point "signals"
        agent: Nola()
    then
        String response = gpt3Result.getBestResponse();
        agent.sendMessage(response);
        delete(gpt3Result);
end
// highlight-added-end
```

As you can see, the type of signal we react to in the new rule is a ```GPT3Completion()``` we receive from GPT-3. At the end of the rule, we again delete this signal. It’s as easy as that! You can create an integration with any external AI model in a similar way.


To make the GPT-3’s response slightly more interesting, we will add some more instructions to accompany the model input. We’ll shape the model’s responses as a conversation between a human and a friendly AI. Take a look:

```java title="java/agents/Nola.java"
package agents;

...
// highlight-added-start
import com.mindsmiths.gpt3.GPT3AdapterAPI;
import com.mindsmiths.ruleEngine.util.Log;
import java.util.List;
// highlight-added-end

@Getter
@Setter
public class Nola extends Agent {
    ...

    // highlight-added-start
    public void askGPT3(String userMessage) {
        String intro = "This is a conversation between a human and an intelligent AI assistant named Nola.\n";
        simpleGPT3Request(intro + "Human: " + userMessage + "\nNola:");
    }

    public void simpleGPT3Request(String prompt) {
        Log.info("Prompt for GPT-3:\n" + prompt);
        GPT3AdapterAPI.complete(
            prompt, // input prompt
            "text-davinci-001", // model
            150, // max tokens
            0.9, // temperature
            1.0, // topP
            1, // N
            null, // logprobs
            false, // echo
            List.of("Human:", "Nola:"), // STOP words
            0.6, // presence penalty
            0.0, // frequency penalty
            1, // best of
            null // logit bias
        );
    }
    // highlight-added-end
}
```

Notice that we use the dialogue cues “Human” and “Nola” as stop words to prevent the model from generating more than one dialogue exchange.

:::tip
To get the most out of GPT-3, here are some [tips and tricks](/docs/tutorials/conversational-ai/gpt3-tips-and-tricks).
:::

Voilà, your touch of magic is done! Restart the system with **forge reset** and **forge run**, try asking your Nola some questions, and see how she reacts!

:::tip
**forge reset** and **forge run** are just some of the commands in the Mindsmiths Platform.
You can learn more about them in the [Forge CLI](/docs/platform/advanced-concepts/cli) section.