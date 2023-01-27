Now that you mastered building and chaining different kinds of screens, we can add a GPT-3 response to finish the flow.

First, you should install GPT-3 adapter. 

```console
root:/app$ pip install "gpt3-adapter[dev]==5.0.0b0"
```

To use the model, you will need to get an [OpenAI account](https://beta.openai.com/account/api-keys). Once you get the API key, run the following code in your terminal:

```console
root:/app$ gpt3-adapter setup
OpenAI API key: <YOUR API KEY>
```

Now when you have GPT-3 installed, we can go on. Add the following to your rule file:

```java titile="rules/felix/Felix.drl"

rule "Ask GPT3 workout plan"
    salience 10
    when
        signal: Submit(getParamAsString("buttonPressed") == "surveyCompleted") from entry-point "signals"
        agent: Felix()
    then
        agent.askGPT3();
end

rule "Store workout plan"
    when
        gpt3Result: GPT3Completion() from entry-point "signals"
        agent: Felix()
    then
        modify(agent) {setWorkoutPlan(gpt3Result.getBestResponse())};
        agent.showGPT3Response();
        delete(gpt3Result);
end
```

So, we are making request to GPT-3 to send us a response in `"Ask GPT3 workout plan"` rule, and after Gpt3 generates that response, we are storing it in `"Store workout plan"` rule.

Now let's add screens GPT-3 response will be shown at.

```java title="rules/felix/Felix.drl"
package agents;
...
import com.mindsmiths.gpt3.GPT3AdapterAPI;
...
public class Felix extends Agent {
    public void showGPT3Response() {
        ArmoryAPI.show(
            getConnection("armory"),
                new Screen ("gptScreen")
                        .add(new Header("logo.png", true))
                        .add(new Title (this.workoutPlan))
                        .add(new SubmitButton("submitTip", "Thanks Felix!", "endScreen")),
                new Screen ("endScreen")
                        .add(new Header("logo.png", true))
                        .add(new Title("You are the best!💜"))
                        .add(new Description("If you want, you can join our workout group on Discord!"))
        );
    }
}
```
To make the GPT-3’s response slightly more interesting, we will add some more instructions to accompany the model input.

```java title="rules/felix/Felix.drl"
package agents;
...

public class Felix extends Agent {
    public void askGPT3() {
            String intro = String.format("Recommend a safe workout plan to someone who is %s kg and %s cm tall, write an advice in the second-person perspective \n", weight, height);
            simpleGPT3Request(intro);
    }

public void simpleGPT3Request(String prompt) {
            Log.info("Prompt for GPT-3:\n" + prompt);
            GPT3AdapterAPI.complete(
                prompt, // input prompt
                "text-davinci-001", // model
                70, // max tokens
                0.9, // temperature
                1.0, // topP
                1, // N
                null, // logprobs
                false, // echo
                List.of("Human:", "Felix:"), // STOP words
                0.6, // presence penalty
                0.0, // frequency penalty
                1, // best of
                null // logit bias
        );
    }
}
```

Now when you've finished the whole flow, we can focus a bit more on customizing the screen layout.