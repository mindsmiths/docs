---
sidebar_position: 6
---

# Discord

[Discord](https://discord.com/) is a free voice, video, and text chat app for wide spectre of users. 
It's a perfect tool for community building and arranging communication with your users. With it, you can build servers that are open for public, or you can create a private, invite-only servers which are intended for smaller, closer  groups.

<details>
  <summary>Setup details</summary>
  <div>
    <div><p><b>Environment variables:</b></p></div>
      <ul>
        <li>DISCORD_BOT_TOKEN</li>
        <li>DISCORD_SENDER_BOT_TOKENS</li>
      </ul>
  </div>
  <div>
    <div><p><b>Installment:</b></p></div>
      <ul>
        <li><code>pip install "discord-adapter[dev]~=5.0.1"</code></li>
      </ul>
  </div>
  <div>
    <div><p><b>Initialize setup:</b></p></div>
      <ul>
        <li><p><code>discord-adapter setup</code></p></li>
      </ul>
  </div>
</details>

## When to use Discord Adapter?

The most common use case is for the **HITL** feature implementation. HITL (_Human-in-the-loop_) feature is used when you need to include
a human to take over a part of the communication with the user. HITL taking over usually happens when the user steps away from the assumed flow
or when the user has questions that the designated intelligent agent can't answer.

Discord Adapter is an excellent tool for this use case because it allows you to create a channel for each user and assign a human to interact with them when needed.
This way, you can easily support your users and provide them with the best possible experience.

What often occurs is that your users interact with their agents via WhatsApp. Discord Adapter enables having a backup of every user's conversation history stored in a channel on a Discord server.
Moreover, a designated person who operates as a HITL can, at any time, step into the conversation and take over the interaction with the user. The best part is that this happens instantly. The user doesn't even have to be aware of the takeover.

Generally, Discord Adapter can be used for any use case where you need to **create a communication channel** which enables user-friendly and diverse interaction with your users.
Using this adapter, you can integrate the Platform with Discord, track every message, include tagging users, create unique roles, incorporate multiple bots to handle communication, add buttons, simplify communication with the users, and much more!

## Core features

- sending, editing, and deleting text messages via Discord
- receiving messages
- replying to a specific messages
- adding and managing one primary (admin) bot, as well as multiple sender bots
- creating [guilds](https://discord.com/developers/docs/resources/guild), [categories](https://discord.com/moderation/208-channel-categories-and-names), [channels](https://support.discord.com/hc/en-us/articles/115001580171-Channel-Categories-101)
- managing different [roles](https://support.discord.com/hc/en-us/articles/214836687-Role-Management-101)
- catching [button](https://discord.com/developers/docs/interactions/message-components#buttons) clicks

## Setup

### Installment
First you need to install discord adapter with the following command:
```shell
pip install "discord-adapter[dev]~=5.0"
```

### Environment variables
- `DISCORD_BOT_TOKEN`
- `DISCORD_SENDER_BOT_TOKENS`

## How to create a Discord bot
TL;DR: you'll need to create a new application, then create a bot, and finally get the bot token.

First you'll have to [register for a Discord account](https://discord.com/register). 
When you finish with your registration or if you already have a Discord account, you can begin with following these steps:

1. Visit [Dicord's developers site](https://discord.com/developers/applications) and log in with your Discord account
2. Click to the `New application` button - you need an application to create a bot
<div style={{textAlign:'center'}}>

   ![image](/img/discord/create-discord-bot1.png)
</div>

3. Give your app a name and click `Create`
<div style={{textAlign:'center'}}>

   ![image](/img/discord/create-discord-bot2.png)
</div>

4. This will lead you to the newly created app menu, where you should click to the `Bot` side-option and continue with `Add Bot` and confirm this action
<div style={{textAlign:'center'}}>

  ![image](/img/discord/create-discord-bot3.png)
</div>

5. After creating a bot, you can now specify its name (optionally, you can set an avatar and experiment with other bot options)
6. On the same menu, scroll down and toggle: 'Presence Intent', 'Server Members Intent', 'Message Content Intent'
<div style={{textAlign:'center'}}>

   ![image](/img/discord/create-discord-bot4.png)
</div>
7. You can get your bot token by clicking `View token`
<div style={{textAlign:'center'}}>

  ![image](/img/discord/create-discord-bot5.png)
</div>

:::caution Store the token somewhere safe
You can only see the API key once, so make sure to copy it and save it somewhere safe, so you can use it whenever you'll need to.

Also, make sure to keep your bot token secret, as it can be used to control your bot.
:::

## Adding a bot to a server
1. Go to the chosen app on Discord's [developers site](https://discord.com/developers/applications)
2. Click on the `OAuth2` menu and choose the `Url Generator` sub-menu
<div style={{textAlign:'center'}}>

   ![image](/img/discord/create-discord-bot6.png)
</div>

3. Select `bot` within the `SCOPES` category, go to the `BOT PERMISSIONS` category that poped up and choose what options you want to authorize
<div style={{textAlign:'center'}}>

  ![image](/img/discord/create-discord-bot7.png)
</div>

:::info Picking the right permissions

You don't have to select the ones shown on the image above, choose the ones that suit your use case

:::
4. On the bottom of the page, you'll see a `GENERATED URL`, which you need to copy and open in a new window
5. Select the server you want to add the bot to and click `Authorize`

After you have set up your bot and server, you can initialize the setup in the console with:

```shell
discord-adapter setup
```

Then you will paste your `DISCORD_BOT_TOKEN` and write the name of the agent that will handle all the signals.

## Connecting to a Channel
To establish a connection with your Discord channel, you need a `channelId`.
This is a unique identifier of the channel, which is used to send messages to the channel.

Getting this identifier is easy, you just need to go to the channel you want to connect to, and type in the mention of your channel, preceded by a backslash.
For example, if you want to connect to the channel named `general`, you need to type `\#general` and send the message.

You will get something like this: `<#123456789012345678>`. The number after the hashtag is your `channelId`.
Same goes for `chatId` and `guildId`, which is the unique identifier of the server you want to connect to.

## Incorporating multiple bots

Using more than one bot in your Discord server will simplify keeping track of the communication between users and your agents.
This also helps with the separation of concerns, as each bot can be assigned to a specific task they have.

For example, one bot can be used to send messages to the users, while other can be used to receive messages from the users. 
You can also have another bot that will notify a specific persona to take action after some unexpected event.

Also, Discord allows you to have a single bot on multiple servers, which is also one way for you to organize your client communication.


## Discord adapter supported functions
Here first import `com.mindsmiths.discordAdapter.DiscordAdapterAPI`

Then you can use the following functions for sending messages:
- `public static SendDirectMessage sendDirectMessage(String text, String chatId)`
- `public static SendChannelMessage sendChannelMessage(String text, String channelId)`

For example, a `sendMessage` function in your Agent class could look like this:

```java
  public void sendMessage(String text){
          SendChannelMessage channelMessage = DiscordAdapterAPI.sendChannelMessage(text, channelId);
          String replyMessageId = channelMessage.getId();
  }
```
:::note
- The fields `List<Button> buttons` and `String botToken` are optional
- The field `botToken` specifies which bot receives the message and it always goes last, otherwise if it is empty the Discord adapter uses your primary bot
:::

When editing, deleting or replying to messages, we need to catch its `messageId`:

```
public static EditChannelMessage editChannelMessage(String channelId, String messageId, String text)  
```
```
public static ReplyToChannelMessage replyToChannelMessage(String channelId, String messageId, String text)
```
```
public static DeleteChannelMessage deleteChannelMessage(String channelId, String messageId)
```  

The following function updates the role of a user:

```
public static UpdateRole updateRole(String guildId, Role role)
```

Lastly, we also have the following functions for creating, deleting and getting guilds:

```
public static CreateGuildCategory createGuildCategory(String guildId, String name, int position)
```
```
public static CreateGuildChannel createGuildChannel(String guildId, String categoryId, String name)
```
```
public static DeleteChannel deleteChannel(String channelId)
```
```
public static CreateGuild createGuild(String guildName, String defaultChannelName)
```
```
public static GetGuild getGuild(String guildId)
```
```
public static GetAllGuildIds getAllGuildIds()
```
```
public static DeleteGuild deleteGuild(String guildId)
```


Here is a simple example of how you could catch a signal from the Discord adapter in your project:

```java     
  import com.mindsmiths.discordAdapter.callbacks.DiscordGuildQueryResult
  
  rule "Catching query result"
  when
    signal: DiscordGuildQueryResult(success == true, guild: guild) from entry-point "signals"
  then
  // do something
  end
```

And here is a list of all the possible signals for you to incorporate into your project:

<details>
  <summary>Available signals</summary>
  <div>
    <div><p><b>Callbacks:</b></p></div>
      <ul>
        <li>DiscordGuildQueryResult</li>
        <li>DiscordAllGuildsReply</li>
        <li>DiscordGuildCreated</li>
        <li>DiscordGuildDeleted</li>
        <li>DiscordGuildCategoryCreated</li>
        <li>DiscordGuildChannelCreated</li>
        <li>DiscordChannelDeleted</li>
        <li>DiscordRoleUpdated</li>
        <li>DiscordMessageSent</li>
        <li>DiscordMessageEdited</li>
        <li>DiscordMessageDeleted</li>
        <li>DiscordMessageReplied</li>
      </ul>
  </div>
  <div>  
    <div><p><b>Messages:</b></p></div>
      <ul>
        <li>DiscordReceivedMessage</li>
        <li>DiscordSentMessage</li>
        <li>DiscordButtonPressed</li>
        <li>CreateGuild</li>
        <li>CreateGuildCategory</li>
        <li>CreateGuildChannel</li>
        <li>DeleteChannel</li>
        <li>DeleteGuild</li>
        <li>DeleteChannelMessage</li>
        <li>EditChannelMessage</li>
        <li>GetAllGuildIds</li> 
        <li>GetGuild</li>
        <li>ReplyToChannelMessage</li>
        <li>SendChannelMessage</li> 
        <li>SendDirectMessage</li>  
        <li>UpdateRole</li>
      </ul> 
  </div>
</details>


## Interactions (receiving messages, button responses)

Another thing you will need to do to enable communication with the Discord adapter is to add the following to your `Runner.java` file:

```java
...
import com.mindsmiths.discordAdapter.message.DiscordReceivedMessage
...
public void initialize() {
  ...
  configureSignals(Events.on(DiscordReceivedMessage.class).sendTo(YOUR_AGENT));
}
```

This will allow you to catch the `DiscordReceivedMessage` signal in your Agent class.

You can create a rule that triggers on key-word 'activate', which is just one of the possibilities for initializing a connection with the Discord adapter:
```java
import com.mindsmiths.discordAdapter.message.DiscordReceivedMessage
...
rule "Message received"
    when
        message: DiscordReceivedMessage(content: content, content.equalsIgnoreCase("activate")) from entry-point "signals"
    then
        // do something
        delete(message);
end
```

Same with `DiscordReceivedMessage`, you should add the same signal recognition implementation for `DiscordButtonPressed` in your `Runner.java`:

```java
...
import com.mindsmiths.discordAdapter.message.DiscordButtonPressed;
...
public void initialize() {
   ...
   configureSignals(Events.on(DiscordButtonPressed.class).sendTo(YOUR_AGENT));
  }
```
And the coresponding rule in your Agent class:
```java
import com.mindsmiths.discordAdapter.message.DiscordButtonPressed
...
rule "Button pressed"
    when
        signal: DiscordButtonPressed(button: button, (button.customId == YOUR_BUTTON_ID), message: message) from entry-point "signals"
        Message(content: content, channelId: channel.id, messageId: discordId) from message
    then
        // do something
        delete(signal);
end
```

## Cleaning up

For discord servers used in local development, it's useful to periodically clean them. That's because (dependening on implementation) `discord-adapter` creates new channels for every `forge reset` and forgets the old ones, leading to dead channels.

To do this, make sure you have `discord-adapter[dev]` installed. If not, run the following:
```shell
pip install "discord-adapter[dev]~=5.0"
```

To delete all channels and categories just run the following command:
```shell
discord-adapter delete-all-channels
```

You will be asked for the `GUILD_ID` (i.e. discord server where to delete channels and categories). Once you type the `GUILD_ID` of your discord server, all channels and categories should get deleted.

:::note
- For deletion to work, in your `.env` needs to be a `DISCORD_BOT_TOKEN` whose bot **has Administrator access to the server**
:::
