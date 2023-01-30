---
sidebar_position: 8
---


# Personality switch

To top it all off, let’s have some more fun with your agent’s identity!
We’ll make things a bit more interesting by adding multiple personality options for Nola.


We first define some new personalities in a separate file, ```models/models/Personality.java```:


```java title="models/models/Personality.java"
package models;

import lombok.Getter;

@Getter
public enum Personality {
    friendlyAI(0.9, 64, "You're an AI system called Nola Brzina. You're talking to a human. You want to have an engaging and fun conversation with them. You are friendly, creative and innovative.\n",
               "AI", "Human", "You are talking to your AI assistant called Nola. Ask her anything you want to know!"),
    wiseRock(0.91, 64, "You are an all-knowing rock talking to an old man. Answer the old man's questions in a deep and profound way.\n", "Rock", "Old man",
            "You are an old man talking to a very wise rock that can answer any of your difficult questions.\nGet answers to all your deepest worries right here!"),
    simpleTesla(0.91, 64, "You are Nikola Tesla who traveled to the future and you are talking to a little boy. Answer the boy's questions in a friendly, simple and helpful way.\n", "Tesla", "Boy",
            "You are a 6-year-old boy talking to Nikola Tesla who traveled to the future to see you.\nAsk him anything you've ever wanted to know about his work!"),
    solemnStark(0.7, 64, "You are Tony Stark and you are interviewing a newbie superhero for Avengers. Answer the newbie's questions in a supportive, but strict and serious way.\n", "Stark", "Newbie",
            "You are a superhero in the making, trying to get into the secret superhero society. The only thing standing in your way is passing an interview with Tony Stark.\nTry to find out what it takes to get in!");

    private final Double temp;
    private final Integer responseLen;
    private final String instruction;
    private final String aiName;
    private final String humanName;
    private final String userPrompt;

    Personality(Double temp, Integer responseLen, String instruction, String aiName, String humanName, String userPrompt) {
        this.temp = temp;
        this.responseLen = responseLen;
        this.instruction = instruction;
        this.aiName = aiName;
        this.humanName = humanName;
        this.userPrompt = userPrompt;
    }
}
```

You’ll notice that apart from changing the intro of the prompt and stopwords, we’re now also playing with different temperatures and response lengths.

:::tip
**Temperature** controls response creativity: higher temperature gives “bolder” and less deterministic responses (value can range from 0 to 1).
:::

**Now it’s time to unleash your creativity!**
We strongly encourage you to try out different parameters and toy around with any identities for your agent that you find interesting.
You can make your agent rude, nice, funny etc. 

To add a new personality, go to ```rules/nola/Conversation.drl```, and inside ```"Switch personality"``` rule, you need to do the following:


1. Choose the identity mark for your agent's new personality (e.g. ```solemnStark```).
2. Choose the temperature (e.g. ```0.7```), and response length (e.g. ```64```).
3. Introduce the agent's new identity, explain who are they talking to,
and how they should act (e.g. ```"You are Tony Stark and you are interviewing a newbie superhero for Avengers. Answer the newbie's questions in a supportive, but strict and serious way."```).
4. Write the agent's and user's names in the dialogue (e.g. ```"Stark"``` and ```"Newbie"```).
5. Now add some instruction for the user to know the context of conversation (e.g. ```"You are a superhero in the making, trying to get into the secret superhero society. The only thing standing in your way is passing an interview with Tony Stark. \nTry to find out what it takes to get in."```).

Once you choose the personalities, you need to add the adaptations in ```Nola.java``` class:

```java title="models/agents/Nola.java"
...
// highlight-added-start
import java.util.Arrays;
import com.mindsmiths.sdk.utils.Utils;
import models.Personality;
// highlight-added-end

@Getter
@Setter
public class Nola extends Agent {
    ...
    // highlight-added-line
    private Personality personality = Personality.friendlyAI;

    ...

    // highlight-added-start
    public void changePersonality(){
        resetMemory();
        List<Personality> choices = new ArrayList<Personality>(
                Arrays.asList(Personality.values())
        );
        choices.remove(personality);
        personality = Utils.randomChoice(choices);
    }
    // highlight-added-end

    public void askGPT3() {
        // highlight-changed-start
        simpleGPT3Request(
            personality.getInstruction() + String.join("\n", memory) + personality.getAiName() + ":", personality.getTemp(),
            personality.getResponseLen(), List.of(personality.getAiName() + ":", personality.getHumanName() + ":")
        );
        // highlight-changed-end
    }

    // highlight-changed-line
    public void simpleGPT3Request(String prompt, Double temp, Integer responseLen, List<String> stop) {
        Log.info("Prompt for GPT-3:\n" + prompt);
        GPT3AdapterAPI.complete(
            prompt, // input prompt
            "text-davinci-001", // model
            // highlight-changed-start
            responseLen, // max tokens
            temp, // temperature
            // highlight-changed-end
            1.0, // topP
            1, // N
            null, // logprobs
            false, // echo
            // highlight-changed-line
            stop, // STOP words
            0.6, // presence penalty
            0.0, // frequency penalty
            1, // best of
            null // logit bias
        );
    }
}
```

Perfect. Now we just need to add a new rule to make Nola change the way in which she talks to her users after they write “switch”:

```java title="rules/nola/Conversation.drl"
...
// highlight-added-start
rule "Switch personality"
    salience 100
    when
        message: TelegramReceivedMessage(text.equalsIgnoreCase("switch")) from entry-point "signals"
        agent: Nola()
    then
        modify(agent) {changePersonality()};
        agent.sendMessage("Switched personality! " + agent.getPersonality().getUserPrompt());
        delete(message);
end
// highlight-added-end
```

And adapt the previous rules communicating with the GPT-3, to allow for a bit more flexibility in setting the parameters:

```java title="rules/nola/Conversation.drl"
rule "Handle message"
    when
        Heartbeat(ts: timestamp) from entry-point "signals"
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
   then
       modify(agent) {
            // highlight-changed-line
            addMessageToMemory(agent.getPersonality().getHumanName(), message.getText()),
            setPinged(false),
            setLastInteractionTime(ts)
       };
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
        // highlight-changed-line
        modify(agent) {addMessageToMemory(agent.getPersonality().getAiName(), response)};
        delete(gpt3Result);
end
```

Clear everything with **forge reset** and start the system again with **forge run**.

Try switching between personalities, and have fun with your new diverse conversational partners!
