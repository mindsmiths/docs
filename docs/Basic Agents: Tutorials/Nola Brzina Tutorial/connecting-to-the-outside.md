---
sidebar_position: 3
---

# Connecting to the outside world

Now that your instance of Forge is up and running, you need a way to communicate with it.
[Telegram Messenger](https://telegram.org/) is a great starting point because it has a free API and it’s very easy to start working with it.

## Creating a Telegram bot

We will use an existing integration with Telegram as a way for your system to communicate with the outside world. Just install the telegram adapter:

```console
root:/app$ pip install "telegram-adapter[dev]==4.0.0a9"
```

Great! You now need a Telegram bot that you can use for testing. You can create one using Telegram’s [BotFather](https://core.telegram.org/bots). To find it, just click on the contact search icon and type in "BotFather". Send the bot a message "/newbot" to create a new bot. 
Once you get the bot token, run the following code to integrate the telegram adapter with the platform:

```console
root:/app$ telegram-adapter setup
Your bot token (from BotFather): <YOUR BOT TOKEN>
What agent will handle signals? Nola
```

As you can see, you will also need to choose a name for your chatbot agent. We called our agent Nola, but this name is completely arbitrary, so feel free to choose something in line with the character you chose. Just make sure you keep the naming consistent in between the one you set when adding Telegram, the agent’s Java class and the subdirectory name containing all the rules.


You’re all set! You now have a way to communicate with the platform through your Telegram bot.

## Creating Nola - the interactive agent

Now that you have the communication channel set up between Forge and the outside world, it’s time to design your chatting agent!
We already mentioned we’ll call our agent Nola, but you can pick any name you want. Just make sure you keep the naming consistent in between the one you set when adding Telegram, the agent’s Java class and the subdirectory name containing all the rules. The only thing Nola will know how to do at first is repeat after you: whatever message you send her, she will echo the same text back. Let’s start!

We start with defining the class of the agent we want to create. Next to Smith.java, create a new file with the agent name you picked, for example ```models/agents/Nola.java``` and paste in the following, adapting the agent name:


```java title="models/agents/Nola.java"
package agents;

import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.telegramAdapter.TelegramAdapterAPI;
import lombok.*;

@Getter
@Setter
public class Nola extends Agent {

    public Nola() {
    }

    public Nola(String connectionName, String connectionId) {
        super(connectionName, connectionId);
    }


    public void sendMessage(String text) {
        String chatId = getConnections().get("telegram");
        TelegramAdapterAPI.sendMessage(chatId, text);
    }
}
```

We have created a simple helper function ```sendMessage``` to make it easier to send messages over Telegram. As each agent of class Nola communicates with exactly one user, we use that user’s Telegram ```chatId```.  Now that you’ve defined your first class, let’s write your first rule! We create a new file inside rules, with path ```rules/nola/Conversation.drl```:

```java title="rules/nola/Conversation.drl"

package rules.nola;
import com.mindsmiths.telegramAdapter.TelegramReceivedMessage;
import agents.Nola;


rule "Handle message"
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: Nola()
    then
        agent.sendMessage(message.getText());
        delete(message);
end
```
:::note
Remember, you should name your directory according to your agent's name. In general, you should change the name "Nola" wherever you see it, and put the name you have chosen for your agent.
:::

There's a lot going on, but let's break it down. There are two basic types of conditions we use in the ```when``` part:
* Conditions based on signals, which come from entry-points.
* Conditions based on facts, which are persistent and represent our knowledge base.


The first line in the ```when``` part tells us that we have received a message from the user, which is an external signal.


In the second line we’re just fetching a reference to our agent Nola. In the beginning, the agent instance is the only fact present in our knowledge base.

The syntax with colons denotes simple variable assignment: ```TelegramReceivedMessage``` and ``Nola`` are assigned to variables ```message``` and ```agent``` for later referencing in the ```then``` part.  Now, if the ```message``` comes from the entry point named ```"signals"```, and an agent named ```Nola``` exists, the ```then``` part of the rule starts executing: we just send back the same message the user sent to us.


After we’ve processed the received message, we want to remove the signal from the system and we do 
```java
delete(message)
```

so it wouldn’t trigger other rules.

Ok, time to interact! Run the system again with **FORGE RUN** and go to your Telegram bot in the Telegram app. Press on ```/start``` and write a message to Nola. She will simply repeat the content of each of your messages. Nice job creating your first interaction!

