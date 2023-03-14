---
sidebar_position: 1
---

# Getting started

:::note
This page is an overview of the Mindsmiths Platform documentation and related resources.
:::

**Mindsmiths Platform** is a platform for creating AI-first solutions.
It is a set of tools and services that allow you to create and deploy AI-powered agents.


### Try it out

Mindsmiths Platform is cloud-based and can be used from any browser. You can try it out for free
by contacting us in [Discord](https://discord.gg/mindsmiths) *#dev* channel.

The easiest way to get started is to go through our [tutorials](/docs/tutorials/getting-started).
They will guide you through the process of creating your first AI-powered agents, integrating with
state-of-the-art machine learning models, and connecting to the outside world.


### Learn about the platform

The Mindsmiths Platform documentation is divided into several sections:

1. [Main concepts](/docs/platform/main-concepts/introduction) - dig deeper into what the platform is, basic concepts, and what it's all about.
2. [Advanced concepts](/docs/platform/advanced-concepts/project-structure) - everything about the architecture and services.
3. [Guides](/docs/platform/guides/service-creation) - a collection of guides that will help you get the most out of the platform.
4. [Reference](/docs/platform/reference/faq) - FAQ, changelog, migration guide and versioning principles.

For integrations with other services, see the [Integrations](/docs/integrations/getting-started) section.


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


### Connecting it all together

Let's open our agent's rules file and add a simple rule (replace `MyAgent` with the name of your agent):

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


### Something missing?

If something is missing in the documentation or if you found some part confusing,
please let us know on [Github](https://github.com/mindsmiths/docs), [Discord](https://discord.gg/mindsmiths)
or tweet at the [@MindsmithsHQ](https://twitter.com/MindsmithsHQ) account. We love hearing from you!