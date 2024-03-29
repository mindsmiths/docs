---
sidebar_position: 2
---

# Armory

## Wait... So what is Armory?

Armory is the Mindsmiths implementation of a templating system used for building web-applications.
If you are looking to create an app-like experience for your users, Armory is the perfect tool for you. 
With Armory, you can easily and quickly create sequences of linked screens, providing your users with a guided experience. 
The best part is that you don't need to write a lot of code to try out different components and add the necessary logic. 

## Adding Armory to your project

Let's start by adding Armory as a new service to your project:

```bash title="Terminal"
pip install armory
armory setup
```

This latter command will prompt you to:
* Choose the agent handling signals coming from Armory
* Provide the Armory site URL, which you'll use to access Armory

We'll name our agent Felix.
:::caution
In case you choose a different name, make sure to keep it consistent throughout the tutorial.
:::

As for the URL, you just use your environment URL (e.g. http://workspace-ms-XXXXXXX.msdev.mindsmiths.io/) with the `XXXXXXX` being the digits you have in your web IDE link. 
The URL will automatically be saved in your `.env` file, where you can find it at any moment.

This is what adding Armory looks like in the Terminal:

```bash title="Terminal"
root:/app$ armory setup
What agent will handle signals? Felix
URL of your IDE (leave empty if running locally): 
http://workspace-ms-XXXXXXX.msdev.mindsmiths.io/
Service successfully integrated into the project.
```

Armory will be on: ```http://workspace-ms-XXXXXXX.msdev.mindsmiths.io/```

:::note
Make sure that your `Runner.java` reads the configuration from `signals.yaml`:

```java title="java/Runner.java"
    public void initialize() {
        configureSignals(getClass().getResourceAsStream("config/signals.yaml"));
        ...
    }
```
:::

Finally, run `forge init` to make sure all dependencies are in place. 

Congratulations, you can now use Armory in your project! Let's find out how we can actually use it and make an awesome onboarding flow.