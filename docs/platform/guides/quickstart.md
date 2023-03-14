---
sidebar_position: 1
---

# Quick start

### Create a project

It's really easy to create a new project. Just open a terminal and write:

```shell
pip install forge-cli
```

This will install the Forge CLI tool. Then, create a new project:

```shell
forge create-project my-project
```

This will create a new project in the `my-project` directory. Open the terminal in that directory and continue with the next steps.

### Initial setup

The first thing you need to do is to run the initial setup. This will install all the dependencies and create the initial databases.

```shell
forge init
```

Now, you should be able to run the project:

```shell
forge run
```

It might take a minute or two to run everything. Once it's done, you should see `Smith's heartbeat - num agents: 1` in the terminal.

To exit, press `Ctrl+C`.


### Creating an agent

Now that we have a running project, let's create our first agent. Agents are the core of the Mindsmiths Platform.
They contain the business logic of your system. They also handle the communication with the outside world.

```shell
forge create-agent MyAgent
```

This will create a new agent in the `agents` directory of the rule engine (both the Java and Drl versions).


### Connecting to the outside world

In this example we'll connect to the [Web](/docs/integrations/web) integration. This will allow us to serve dynamic web-pages to our users.

:::tip Integrations
For more integrations, check out the [Integrations](/docs/integrations/getting-started) section.
:::

First, install the integration:

```shell
pip install armory
```

Then, add it to the project:

```shell
armory setup
```

You will be prompted to enter the name of the agent that will handle the signals. Enter the agents name from the last step and press `Enter`.
Next prompt will ask you to provide Armory site URL. Here just enter your IDE's URL, which will automatically be saved in your .env file, and you can find it at any moment.

:::note Entering the Armory site URL

For example, you should enter `http://workspace-ms-XXXXXXX.msdev.mindsmiths.io/` with the `XXXXXXX` being the digits you have in your web IDE link.

:::


### Connecting it all together

Let's open agent's rules file (`resources/rules/myAgent/MyAgent.drl`) and add a simple rule (replace `MyAgent` with the name of your agent):

```java title="services/rule_engine/src/main/resources/rules/myAgent/MyAgent.drl"
import com.mindsmiths.armory.event.UserConnected;
// ...
rule "Handle new user connection"
    when
        UserConnected()
    then
        Log.info("User connected!");
end
```

Now, execute `forge run` in terminal. Once everything is up and running, visit `http://8000.<your-web-ide-url>` (if running locally, visit `http://localhost:8000`).
You should see a message in the terminal saying `User connected!`.
