---
sidebar_position: 3
---

# Telegram Adapter
This service enables you to integrate your project with Telegram, an open-source messaging app. If you aren't familiar wit Telegram, you can read more about it on their [website](https://telegram.org/).


For a quick demo of how a project with included Telegram Adapter looks like, you can check out our [Nola Brzina tutorial](docs/src/Tutorials/Nola%20Brzina%20Tutorial/intro.md).

## When to use Telegram Adapter?
If you want to include features like sending and receiving messages, perhaps you want to offer your users a possibility of responding to your Telegram texts with buttons,
or you just want to explore ways of communicating with your clients, Telegram Adapter is the service you need to include into your project.

## Core features of Telegram Adapter
- sending and receiving different kinds of Telegram messages
  - text and media (pictures, videos, stickers, etc.) messages included
- editing and deleting already sent Telegram messages
- setting a chat action like "typing..."
- adding buttons to your texts
- answering to texts with buttons
- asking/answering with a multiple choice button

## Setup
In a few easy steps, you'll quickly go through the setup process. 
### Installment
First, you'll need to pip install the Adapter with the following command:
```console
pip install "telegram-adapter[dev]==5.0.0b0"
```
### Environment variables
#### TELEGRAM_BOT_TOKEN {#tgrm-tkn}   
Next step, introducing Telegram bot - small programs that run inside Telegram and simulate a regular user's account.
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
1. `sendMessage(String chatId, String text, KeyboardData keyboardData, List[MediaData] mediaList, bool messageReanswerable)`
   - use it when you want to send text **or** media message to the user (you can't send both in a same message)
   - `chatId` needs to be defined - you always have to determine who are you sending the message to
   - you can either set the `text` or `mediaList` attribute, depending on what kind of message do you want to send (text or media) 
   - optionally, the message can contain a keyboard markup (buttons)
   - buttons represent an answear to the message you are sending
   - `messageReanswerable` is a bool variable which symbolizes if a user can answer to your message or not
   - in the following example, you can see one way of using this method: 
   ```java
     
      import com.mindsmiths.telegramAdapter.TelegramAdapterAPI;
     
      String text = "Hello, world!"
      String chatId = getConnections().get("telegram");
      TelegramAdapterAPI.sendMessage(chatId, text);
     
    ```
2. `editMessage(String chatId, String messageId, String newText, List[MediaData] newMediaList, KeyboardData keyboardData, bool messageReanswerable)`
   - edit already sent text messages
   - `chatId` and `messageId` need to be defined 
   - as before, you can edit either text or media with setting `newText` or `newMediaList`, depending on the "type" of message
   - optionally, message keyboard markup (buttons) can be edited with `keyboardData` (keep in mind that with it, you can also add new or entirely remove previously set buttons)
   - `messageReanswerable` was explained and is used in a same way in every occasion
3. `deleteMessage(String chatId, String messageId)`
    - delete a whole message sent to or by the user
    - message will vanish from chat like it was never there
    - `chatId` and `messageId` both need to be defined if you want to proceed with this action
4. sendPendingAction()
   - set a chat action (eg. "typing")

## Catching responses

There are also 4 different `event` signals that you can catch in your rules and make actions according to them. If you need more information about how signal communication
works on the platform, check out our documentation [here](this is path to signal communication) 
1. `TelegramReceivedMessage`
   - a signal which is being emitted when a user sends a message to your bot
   - if you want to take any sort of action when this happens, you should add a rule that catches this signal
2. `TelegramSentMessage`
   - a signal emmitted when platform sends  
3. `TelegramKeyboardAnswered`
4. `TelegramMultiChoiceKeyboardAnswered`

- how to use keyboard data