---
sidebar_position: 3
---

# Adding intelligence

Now we have the onboarding in place, let’s focus on making Nola’s other responses a little more exciting. Enter: artificial intelligence models!
We’ll replace our simple echo response with a more intelligent response from OpenAI’s GPT-3 model. This model generates a text completion result for any input prompt you send it.


So let’s add an existing Forge integration for GPT-3. Start off by installing it:


```console
root:/app$ pip install gpt3-adapter[dev]==4.0.0a6
```

To use the model, you will need to get an [OpenAI account](https://beta.openai.com/account/api-keys). Once you get the API key, run the following code in your terminal:

```console
root:/app$ gpt3-adapter setup
OpenAI API key: <YOUR API KEY>
```

We can now make requests to GPT-3 and receive its responses. We just need to adapt the rule for handling the incoming message, and add one for processing the GPT-3 response. 

:::note
Notice the highlighted part in the rule ```Handle message```. It signifies that this rule is already in the file, and we highlighted the part you should change in the already existing rule. 
Every time when there is a change in an existing rule, the modified part will be highlighted, so you can easily replace it.
:::



```java title="rules/nola/Conversation.drl"
...
// highlight-next-line
import com.mindsmiths.gpt3.completion.GPT3Completion;
...
rule "Handle message"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
    then
        // highlight-next-line
        agent.askGPT3(message.getText());
        delete(message);
end

// highlight-start
rule "Send GPT3 response"
    when
        gpt3Result: GPT3Completion() from entry-point "signals"
        agent: Nola()
    then
        String response = gpt3Result.getBestResponse();
        agent.sendMessage(response);
        delete(gpt3Result);
end
// highlight-end
```

As you can see, the type of signal we react to in the new rule is a ```GPT3Completion()``` we receive from GPT-3. At the end of the rule, we again delete this signal. It’s as easy as that! You can create an integration with any external model in a similar way.


To make the GPT-3’s response slightly more interesting, we will add some more instructions to accompany the model input. We’ll shape the model’s responses as a conversation between a human and a friendly AI. Take a look:

```java title="models/agents/Nola.java"
package agents;

...
// highlight-start
import com.mindsmiths.gpt3.GPT3AdapterAPI;
import com.mindsmiths.gpt3.completion.GPT3Completion;
import com.mindsmiths.ruleEngine.util.Log;
import java.util.List;
// highlight-end

@Getter
@Setter
public class Nola extends Agent {
    ...

    // highlight-start
    public void askGPT3(String userMessage) {
        String intro = "You're an AI system called Nola Brzina talking to a human. You want to have an engaging and fun conversation. You are friendly, creative and innovative.\n";
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
    // highlight-end
}
```

Notice that we use the dialogue cues “Human” and “AI” as stop words to prevent the model from generating more than one dialogue exchange.

Voilà, your touch of magic is done! Restart the system, try asking your Nola some questions, and see how she reacts!