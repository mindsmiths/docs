---
sidebar_position: 2
---

# Telegram Adapter
This service enables you to integrate your project and platform itself with Telegram, an open-source messaging app. If you aren't familiar wit Telegram, you can read more about it on their [website](https://telegram.org/).


For a quick demo of how a project with included Telegram Adapter looks like, you can check out our [Nola Brzina tutorial](docs/src/Tutorials/Nola%20Brzina%20Tutorial/intro.md).

## When to use Telegram Adapter?
If you want to include features like sending and receiving messages or any other cool data exchange possibility that Telegram app offers, 
Telegram Adapter is the service you need.
Beside sending regular messages, you can also send questions that include buttons as an answer, you can catch that type of answer in rules and then use it in any way you need. 

## Starting with Telegram Adapter setup
In a few easy steps, you'll quickly go through the setup process. 

First, you'll need to pip install the Adapter with the following command:
```console
pip install "telegram-adapter[dev]==5.0.0b0"
```

Next step, introducing Telegram bots, small programs that run inside Telegram and simulate a regular user's account.
Telegram bots will be accountable for sending and receiving all different kinds of messages. Next move is to 
get your hands on a telegram bot token, which is pretty simple and we'll explain it to you right away.

For starters, you can use an existing bot token if you created it at some time before, or you can create a new bot specially for this purpose.
In order to creat a new bot or to find token of a previously created bot, find [BotFather](https://t.me/botfather) (username @BotFather) on Telegram. 
When contacting the BotFather, you can create new bot accounts and also manage your existing bots.

Bot tokens are used for controlling your bots, so we suggest you store it safely and keep it secure.
After you fetch the token, the only thing left to do is to do is to copy it, so you can add it to the project you want to integrate with Telegram. 

Also, one more thing you need to know in advance is the name of an agent who will handle signals.

With the token bot prepared and an agent who'll be responsible for signals in mind, you can initialize the setup process with the following command:  

```console
telegram-adapter setup
```

The setup process will look something similar to this:
```console
root:/app$ telegram-adapter setup
Your bot token (from BotFather): <YOUR BOT TOKEN>
What agent will handle signals? Nola
```

## Putting the Adapter to use

There are 4 different static methods you can utilize from `TelegramAdapterApi`:
1. sendMessage()
   - use it when you want to send text or media message to the user
   - optionally, the message can contain a keyboard markup (buttons)
   - in the following example, you can see one way of using this method 
   ```java
     
      import com.mindsmiths.telegramAdapter.TelegramAdapterAPI;
     
      String text = "Hello, world!"
      String chatId = getConnections().get("telegram");
      TelegramAdapterAPI.sendMessage(chatId, text);
     
    ```
2. editMessage()
   - edit already sent text messages to the user
   - optionally, message keyboard markup (buttons) can be edited (adding new buttons and removal  included)
   - 
3. deleteMessage()
    - delete a whole message sent to or by the user
    - message will vanish from chat like it was never there
4. sendPendingAction()
   - set a chat action (eg. "typing")

## Catching responses

There are also 4 different `event` signals that you can catch in your rules and make actions according to them:
1. `TelegramReceivedMessage`
2. `TelegramSentMessage`
3. `TelegramKeyboardAnswered`
4. `TelegramMultiChoiceKeyboardAnswered`