---
sidebar_position: 7
---

# Web

Mindsmiths Platform supports dynamically generated web pages.
You can use these pages to display content to your users, or to collect data from them.

The service for this is called **Armory**.

## When to use Armory?

Armory allows you to create an app-like experience for your users quickly and easily, with sequences of linked screens. 
This provides the feeling of user guidance through the process you are modeling. One of its biggest perks is that it 
allows you to smoothly build in the logic you need and try out various components, with minimum code.

<!-- <details>
  <summary>Setup details</summary>
<div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li>SECRET_KEY</li>
            <li>DEBUG</li>
            <li>ALLOW_EVERYONE</li>
            <li>SITE_URL</li>
            <li>INTERNAL_SITE_URL</li>
        </ul>
    </div>
    <div>
        <p><b>Installment:</b></p>
        <ul>
            <li><code>pip install "armory"</code></li>
        </ul>
    </div>
    <div>
        <p><b>Initialize setup:</b></p>
        <ul><li><p><code>armory setup</code></p></li></ul>
    </div>
  </div>
</details> -->

## Core features

Let’s start from the basics: there are three different Armory signals that are caught by the Rule engine:
* **UserConnected**: emitted each time a user connects to Armory (opens the link)
* **UserDisconnected**: emitted when the user disconnects from Armory (closes the link)
* **Submit**: emitted when the user presses something on the screen (e.g. a button)

The signals are fairly straightforward. We should mention that e.g. refreshing the site emits the UserDisconnectedEvent and then the UserConnectedEvent again.

To connect to Armory, the user needs a unique `connectionId`. This id is part of that user’s URL, and will be randomly generated if not set in advance. 

## Armory templates and components 

As mentioned, Armory already comes with a number of predefined templates and components for building screens. Once you get a hang of how they work, you are welcome to add more custom implementations.

The `GenericTemplate` is quite packed, but it can be much simpler than that - for example, we also provide a `TitleTemplate` which literally only contains a `Title` component.

The components are the building blocks of screens, and there are several of them predefined in the service, all implementing the `BaseComponent` interface:
* ActionGroup (groups together buttons into a list of options out of which only one can be selected)
* BackButton
* CloudSelect (allows user to select multiple elements from a list)
* Description
* Image
* Input (roughly corresponds to HTML input element, with the data type specified by setting `type`)
* SubmitButton (basic button which triggers a `SubmitEvent`)
* TextArea
* Title

Each component is referenced through its `componentId`. We’ll use this id later on for getting the data the user provided on a screen off the `SubmitEvent`.

## Setup

Adding Armory to your project is pretty straightforward. Let's jump right to it.   

### Installment

```bash title="Terminal"
root:/app$ pip install armory
root:/app$ armory setup
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

## How to use?

You can find the Armory tutorial [here](/docs/tutorials/Armory-tutorial). 