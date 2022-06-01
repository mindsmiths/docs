---
sidebar_position: 10
---


# Personality switch

To top it all off, let’s have some more fun with your agent’s identity! We’ll make things a bit more interesting by adding multiple personality options for Nola.


We first define some new personalities in a separate file, ```models/models/Personality.java```:


```java title="models/models/Personality.java"
package models;

import lombok.Getter;

@Getter
public enum Personality {
    friendlyAI(0.9, 64, "You're an AI system called Nola Brzina. You're talking to %1$s. You want to have an engaging and fun conversation with them. You are friendly, creative and innovative.\n",
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
Simply put, temperature controls response creativity: the higher the temperature, the “bolder” and less deterministic the responses will be. Response length just limits the number of words agent's response can have.


Now it’s time to unleash your creativity! We strongly encourage you to try out different parameters and toy around with any identities for your agent that you find interesting. You can make your agent rude, nice, funny etc. 
If you want to add a new personality, you need to define the following:


1. Choose the name for your agent's new personality (e.g. solemnStark)
2. Choose the temperature (e.g. 0.7), and length (e.g. 64)
3. Introduce agent's new personality, explain to whom he/she is talking to, and how is he/she acting (e.g. "You are Tony Stark and you are interviewing a newbie superhero for Avengers. Answer the newbie's questions in a supportive, but strict and serious way.").
4. Write a name of agent's new personality inside the quotation marks (e.g. "Stark"), 
5. Put the name of a person you want to be (the person your agent will talk to) inside the quotation marks (e.g. "Newbie")
6. Introduce the personality agent will be talking to (in other words, choose who you want to be in this conversation) and explain the context (e.g.  "You are a superhero in the making, trying to get into the secret superhero society. The only thing standing in your way is passing an interview with Tony Stark.")
7. Introduce your mission - so the mission of the person agent is talking to  (e.g. Try to find out what it takes to get in.").
P.S. don't forget to put each instruction inside the quotation marks, and separate all instruction by comma!

Once you choose the personalities, you need to add the adaptations in Nola’s java class:

```java title="models/agents/Nola.java"
...
// highlight-start
import java.util.Arrays;
import com.mindsmiths.ruleEngine.util.Util;
import models.Personality;
// highlight-end

@Getter
@Setter
public class Nola extends Agent {
    ...
    // highlight-next-line
    private Personality personality = Personality.friendlyAI;

    ...

    // highlight-start
    public void changePersonality(){
        resetMemory();
        List<Personality> choices = new ArrayList<Personality>(
                Arrays.asList(Personality.values())
        );
        choices.remove(personality);
        personality = Util.randomChoice(choices);
    }
    // highlight-end

    public void askGPT3() {
        simpleGPT3Request(
            // highlight-start
            personality.getInstruction() + String.join(“\n”, memory) + personality.getAiName() + ":", personality.getTemp(),
            personality.getResponseLen(), List.of(personality.getAiName(), personality.getHumanName())
            // highlight-end
        );
    }

    // highlight-next-line
    public void simpleGPT3Request(String prompt, Double temp, Integer responseLen, List<String> stop) {
        Log.info("Prompt for GPT-3:\n" + prompt);
        GPT3AdapterAPI.complete(
            prompt, // input prompt
            "text-davinci-001", // model
            // highlight-start
            responseLen, // max tokens
            temp, // temperature
            // highlight-end
            1.0, // topP
            1, // N
            null, // logprobs
            false, // echo
            // highlight-next-line
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
// highlight-start
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
// highlight-end
```

And adapt the previous rules communicating with the GPT-3, to allow for a bit more flexibility in setting the parameters:

```java title="rules/nola/Conversation.drl"
rule "Handle message"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
   then
       modify(agent) {
            // highlight-next-line
            addMessageToMemory(agent.getPersonality().getHumanName(), message.getText()),
            setPinged(false),
            setLastInteractionTime(new Date())
       };
       agent.askGPT3();
       delete(message);
End

rule "Send GPT3 response"
    when
        gpt3Result: GPT3Completion() from entry-point "signals"
        agent: Nola()
    then
        String response = gpt3Result.getBestResponse();
        agent.sendMessage(response);
        // highlight-next-line
        modify(agent) {addMessageToMemory(agent.getPersonality().getAiName(), response)};
        delete(gpt3Result);
end
```

Clear everything with **forge reset** and start the system again with **FORGE RUN**. Try switching between personalities, and have fun with your new diverse conversational partners!
