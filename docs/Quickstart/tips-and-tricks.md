---
sidebar_position: 5
---

# Tips and tricks

## Naming your Telegram bot

The name you choose for your Telegram bot doesn't have anything to do with the name of the agent you use in your code. The platform will communicate with any bot you connect it to via the bot token.

However, as you're creating a conversation agent, it's more fun to keep the personality consistent. So you can go ahead and set a fitting name depending on who you want to talk to.

Good bot name examples:
- Scared Ninja
- JumpyPanda

Bad bot name examples:
- John Smith
- JANE_TestBot
- MindsmithsBot

It's good not to use a name that people will stumble upon all to easily when searching Telegram. This is also something to keep in mind when building a product: don't use your product's branding for testing bots that won't be used in production. Similarly, it's bad practice to use words such as "test" in your bot's name.

## Instructing GPT-3

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
