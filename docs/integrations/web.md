---
sidebar_position: 7
---

# Web

Mindsmiths Platform supports dynamically generated web pages.
You can use these pages to display content to your users, and to collect the data they input.

We call this web templating service **Armory**.

Using Armory is very simple, but there are a couple basic concepts you need to grasp before you start. We look at each of those concepts below.

<details>
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
</details>

## Armory events 

Let’s start from the basics - there are three different signals Armory as a service uses to communicate with the platform:
* **UserConnected**: event emitted each time a user connects to Armory (opens the link)
* **UserDisconnected**: event emitted when the user disconnects from Armory (closes the link)
* **Submit**: event emitted when the user presses something on the screen (e.g. a button)

:::note
Note that e.g. refreshing the site emits the `UserDisconnected` and then the `UserConnected` event again.
:::

These signals are fairly straightforward. Since the screens are generated dynamically, these events allow us to control what (next) gets shown to the user.

:::note
When connecting to Armory, the user has a unique `connectionId`. This id is part of that user’s Armory URL, and will be randomly generated if not set for that user in advance.
:::

## Armory components and screens

As mentioned, Armory already comes with a number of "smart defaults", in the form of predefined components and styleguide for screen design. 
We'll go over them briefly, but once you get a hang of how things work, you are welcome to add more [custom implementations](/docs/integrations/web#custom-components) and play around with the [styling](/docs/integrations/web#custom-templates) yourself.

You can show the screens you create using `ArmoryAPI.show()`, which takes the mentioned user connection id and the screen(s) to show, for example:
```java
ArmoryAPI.show(
    getConnection("armory"),
    new Screen("welcomeScreen")
        .add(new Title("Hello there! What's your name? 😊"))
        .add(new Input("name", "Type your name here...", "text"))
        .add(new SubmitButton("submitName", "Submit"))
);
```

But let's first learn how to create those screens!

### Components
The components are the building blocks of screens, and there are several you can use out-of-the-box:
* BackButton: component used in Screen headers
* CloudSelect: a cool multi-select component
* Description
* Header: component that normally contains a logo and the `BackButton` (enabled by setting the `allowsBack` field to `true`)
* Image
* Input: component that roughly corresponds to the [HTML input element](https://www.w3schools.com/html/html_form_input_types.asp), with the input data type specified by setting `type`
* SubmitButton: basic button component, triggers a `Submit` event
* TextArea: component for longer text input
* Title

Components that are used to collect some sort of input or activity from the user (text areas, buttons etc.) are referenced through the `inputId`. For example, here is a rule that registers the user entered their name and submitted it by pressing a button:
```java
rule "Save customer name"
    when
        signal: Submit(buttonId == "submitName", name: getParamAsString("name")) from entry-point "signals"
        agent: Customer()
    then
        modify(agent){setName(name)};
        delete (signal);
end
```
[TODO add screenshots]
All data within a [linked sequence of screens](/docs/tutorials/web-interactions/chaining-screens) is transferred via GET parameters, and you can store them in bulk when a button with a certain `buttonId` is pressed.

### Screens
But what do we do with these components, and how can we assemble them to create screens? For this we use Armory's `Screen` class, to which we simply add the components in the order we want them to appear on the screen.

We should mention that there are some default standards when it comes to spatial organization of the components on screens: all components apart from the action ones (e.g. buttons taking you to the next screen) gravitate towards top of the screen. The action components are anchored to the bottom of the screen, to avoid screens shifting in size depending on how many components they contain.

You can easily override these standard practices by using the `group()` function, which allows you to create a group of components you want to "stick closer together" on the screen. Check it out:
```java
new Screen("welcomeScreen")
        .add(new Header("logo.png", true))
        .add(new Title("Hello there!"))
        .group("center")
        .add(new Description("What's your name? 😊"))
        .add(new Input("name", "Type your name here...", "text"))
        .group("bottom")
        .add(new SubmitButton("submitName", "Submit"))
```

This will group the `Description` and `Input` component around the screen center, push the button to the bottom, leaving the `Header` and `Title` by default at the top.

The last function we're going to mention here is `setTemplate()`. Sometimes, you need a lot of custom logic relating to the screen layout. Some simpler examples of this include content centering, fixed custom order of components on the screen etc.

When you define this custom screen layout within a template, you can apply it to any screen by calling `.setTemplate("CustomTemplateName")` before adding the components:

```java
new Screen("welcomeScreen")
        // highlight-changed-line
        .setTemplate("CenteredContent")
...
```

We'll show you how to create these templates and custom components in the next section.

Keep in mind that you can link together sequences of multiple Armory screens by specifying the transitions between them: the easiest way to do this is by setting the name of the next screen you want to go to as the value of the `SubmitButton` (e.g. `new SubmitButton("submitName", "Done", "askAddress")` takes the user to the screen where they will be asked to set their address). 
You can find plenty of examples of screen linking in the Armory [tutorial](/docs/tutorials/web-interactions).

## Creating components and templates

### Custom components

Let's take a look at how you can add new custom components to your screens. Let's say you wanted to add a component for uploading a document to your screen.
The steps are as follows:
1. Create the components directory in `services/armory/src/components`
2. Add the component in vue, for example create the file:
```vue title="services/armory/src/components/FileUpload.vue"
<template>
  <div class="file is-boxed">
    <label class="file-label">
      <input class="file-input" type="file" name="resume" />
      <span class="file-cta">
        <span class="file-icon">
          <i class="fas fa-upload"></i>
        </span>
        <span class="file-label"> Choose a file… </span>
      </span>
    </label>
  </div>
</template>

<script>
import BaseValue from "armory-sdk/src/components/base/BaseValue";

export default {
  name: "FileUpload",
  extends: BaseValue,
  props: {
    placeholder: {
      type: String,
      default: "",
    },
  },
};
</script>

<style></style>
```

:::tip
The HTML you see in the `<template>...</template>` node was taken from this [website](https://bulma.io/documentation/). Keep in mind that there are plenty of such resources out there if you're not too crafty with HTML yourself!
:::

3. Finally, add your custom component to the `App.vue` file:
```java title="services/armory/src/App.vue"
...
import FileUpload from "./components/FileUpload";
...
    getCustomComponents() {
    // highlight-changed-line
      return {FileUpload};
...
```

You can now just use your custom component directly in Java using the `CustomComponent` class:
```java
new Screen("uploadDocument")
    .add(new CustomComponent("FileUpload"))
```

In case you need to pass the component some parameters, those are simply added as key-value pairs to the `CustomComponent` params field. For example, you can see that our new `FileUpload` component has an optional `placeholder` that can be passed as a param:
```java
new Screen("uploadDocument")
    // highlight-changed-line
    .add(new CustomComponent("FileUpload").addParam("placeholder", "Upload file here"))
```

### Custom templates

As mentioned, you can also quickly create custom templates, which allow you to easily reuse the formatting on multiple screens.

Let's take a look at how to create the `CenteredContent` template we mentioned in the section above. You just need to open the `skin.scss` file and add the following:
```scss title="services/armory/src/assets/css/skin.scss"
...
div.CenteredContent {
    .group#centered {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;
        padding-bottom: 55px;
    }
}
...
```

:::note
If you're looking for some scss basics, you can check out this [website](https://sass-lang.com/guide).
:::

That's it, you can now apply this template to any screen using the `setTemplate()` function!