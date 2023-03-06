---
sidebar_position: 6
---

# Discord

## When to use Discord Adapter?
- HITL
- When u need easy to use communication channel

## Core features

- one primary bot, multiple sender bots
- just list them here
- creating guilds, categories, channels
- sending, editing, deleting messages
- replying to messages
- managing roles
- catching button clicks
- receiving messages

### Installment
```shell
pip install "discord-adapter[dev]~=5.0"

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

## Discord adapter supported functions
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