---
sidebar_position: 5
---

# Crafting the perfect response

Now we have the onboarding in place, let’s focus on making Nola’s other responses a little more exciting. Enter: artificial intelligence models!
We’ll replace our simple echo response with a more intelligent response from OpenAI’s GPT-3 model. This model generates a text completion result for any input prompt you send it.


So let’s add an existing Forge integration for GPT-3. Start off by installing it:


```console
root:/app$ pip install "gpt3-adapter[dev]==4.0.0a8"
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
// highlight-added-line
import com.mindsmiths.gpt3.completion.GPT3Completion;
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

As you can see, the type of signal we react to in the new rule is a ```GPT3Completion()``` we receive from GPT-3. At the end of the rule, we again delete this signal. It’s as easy as that! You can create an integration with any external model in a similar way.


To make the GPT-3’s response slightly more interesting, we will add some more instructions to accompany the model input. We’ll shape the model’s responses as a conversation between a human and a friendly AI. Take a look:

```java title="models/agents/Nola.java"
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
Voilà, your touch of magic is done! Restart the system, try asking your Nola some questions, and see how she reacts!

## Tips & tricks: GPT-3 prompts

We strongly encourage you to try experimenting a bit more with the input prompt for the model. This is where your creativity can really shine! 


We have a couple of hints to get you started.


First off, we’re using the model version specifically tuned to better follow direct human instructions. You can add these instructions in the prompt which will be fed into the model for completion. Here is an example of a simple prompt (in **bold**) and GPT-3’s completion:

<pre>
<b>Write a catchy tagline for a developer workshop</b>
<br></br>
Empowering developers to build the future
</pre>

Now this is pretty neat, but you can further try giving GPT-3 an identity before asking it for a response:

<pre>
<b>You are a friendly OpenAI assistant. Complete the text in simple words: InstructGPT is a</b>
<br></br>
<b>language model</b> that allows developers to create bots that can understand and respond to
<br></br>
natural language instructions.
</pre>

Sort of true, but we’ll take it! Using the right prompt, you can simulate basically any kind of interaction, for example:

<pre>
<b>You are an all-knowing rock talking to a human. Answer the questions in a deep and profound way.</b>
<br></br>
<b>Human: What is my purpose in life?</b>
<br></br>
<b>Rock: </b>
There is no one specific purpose in life, for life is a 
journey, and not a destination.
<br></br>
<b>You are an all-knowing rock talking to a human. Answer the questions in a deep and profound way.</b>
<br></br>
Human: What is your highest peak?
<br></br>
Rock: My highest peak is not a physical place, but a state of being.
</pre>

You can play around with the prompt and other input parameters [here](https://beta.openai.com/playground)!


To get a better idea of what a powerful model GPT-3 actually is, you can also check out some cool examples and applications [here](https://beta.openai.com/examples/).
