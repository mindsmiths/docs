---
sidebar_position: 6
---

# Discord

[Discord](https://discord.com/) is a free voice, video, and text chat app for wide spectre of users. 
It's a perfect tool for community building and arranging communication with your users. With it, you can build servers that are open for public, or you can create a private, invite-only servers which are intended for smaller, closer  groups.
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
After this, we've prepared the setup command which will arrange everything for you:
```shell
discord-adapter setup
```
### Environment variables
- `DISCORD_BOT_TOKEN`
- `DISCORD_SENDER_BOT_TOKENS`

## How to create a Discord bot
- go to https://discord.com/developers/applications
- click `New application`
- name the bot
- go to the `Bot` menu and click `Add Bot`
- u can get your bot token by clicking `View token`
- copy bot token into .env file of project
- on same scroll down and toggle: 'Presence Intent', 'Server Members Intent', 'Message Content Intent'

## How to add Discord bot to your discord server
- go to your bot on discord developers site
- go to `OAuth2` menu -> `Url Generator`
- press `bot` and `add permissions` that your bot will have in channel
- on the bottom of site u will see url, open it in new window
- select your server and click `authorize`

## Why would you want to incorporate multiple bots?
- TO DO
- explain the purpose of using multiple bots, what are the benefits of using them
- if there are any things a dev should be aware of when using multiple bots, mention them here
- give an example of a use case
- it would be great to provide a picture/screenshot of a communication, so it's easier to understand how this feature works

## Discord adapter supported functions
Here 
- first import `com.mindsmiths.discordAdapter.DiscordAdapterAPI`
-     public static SendDirectMessage sendDirectMessage(String text, String chatId)
-     public static SendChannelMessage sendChannelMessage(String text, String channelId)
    - ```java
      public void sendMessage(String text){
              SendChannelMessage channelMessage = DiscordAdapterAPI.sendChannelMessage(text, channelId);
              String replyMessageId = channelMessage.getId();
      }

    - optional fields are `List<Button> buttons`, `String botToken`
    - `botToken` always goes last, if it is empty  discod adapter uses primary bot, otherwise it uses bot with that bot token
-     public static EditChannelMessage editChannelMessage(String channelId, String messageId, String text)
  - optional fields are `String text`, `List<Button> buttons`
  - to edit message u first need to catch message and save it`s id
-     public static UpdateRole updateRole(String guildId, Role role)
-     public static CreateGuildCategory createGuildCategory(String guildId, String name, int position)
-     public static CreateGuildChannel createGuildChannel(String guildId, String categoryId, String name)
-     public static DeleteChannelMessage deleteChannelMessage(String channelId, String messageId)
-     public static DeleteChannel deleteChannel(String channelId)
-     public static ReplyToChannelMessage replyToChannelMessage(String channelId, String messageId, String text)
  - to reply to message u first need to catch message and save it`s id
  - ```java
      public void replyToMessage(String replyMessageId, String text){
              DiscordAdapterAPI.replyToChannelMessage(hitlChannelId, replyMessageId, text);
      }
-     public static CreateGuild createGuild(String guildName, String defaultChannelName)
-     public static GetGuild getGuild(String guildId) 
   -    to catch guild u write something like this
   - ```java
      import com.mindsmiths.discordAdapter.callbacks.DiscordGuildQueryResult
     
      rule "example"
      when
        signal: DiscordGuildQueryResult(success == true, guild: guild) from entry-point "signals"
      then
      // do something
      end
-     public static DeleteGuild deleteGuild(String guildId)
-     public static GetAllGuildIds getAllGuildIds()
  - ```java
        import com.mindsmiths.discordAdapter.callbacks.DiscordAllGuildsReply
         
        rule "example"
        when
           signal: DiscordAllGuildsReply(success == true, guildIds: guildIds) from entry-point "signals"
        then
        // do something
        end
## Interactions (receiving messages, button responses)
- RECEIVING MESSAGES
  - in `Runner.java` add following
    - ```java
      ...
      import com.mindsmiths.discordAdapter.message.DiscordReceivedMessage
      ...
      public void initialize() {
          ...
          configureSignals(Events.on(DiscordReceivedMessage.class).sendTo(YOUR_AGENT));
      }
  - in `something.drl` file of agent u want to handle event
    - next rule triggers on word 'activate' if u want to receive all messages remove `content.equalsIgnoreCase("activate")` 
    - ```java
      import com.mindsmiths.discordAdapter.message.DiscordReceivedMessage
      ...
      rule "Recieved message"
      when
          message: DiscordReceivedMessage(content: content, content.equalsIgnoreCase("activate")) from entry-point "signals"
      then
      //  do something
          delete(message);
      end
- BUTTON RESPONSES
  - in `Runner.java` add following
    - ```java
      ...
      import com.mindsmiths.discordAdapter.message.DiscordButtonPressed;
      ...
      public void initialize() {
         ...
         configureSignals(Events.on(DiscordButtonPressed.class).sendTo(YOUR_AGENT));
        }
  - in `something.drl` file of agent u want to handle event
    - ```java
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