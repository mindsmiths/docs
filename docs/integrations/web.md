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
            <li><code>pip install "armory[dev]~=5.0.0"</code></li>
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
* **UserConnected**: event emitted each time a user connects to an Armory screen (opens the link)
* **UserDisconnected**: event emitted when the user disconnects from an Armory screen (closes the link)
* **Submit**: event emitted when the user presses something on the screen (e.g. a button)

These signals are fairly straightforward. We should mention that e.g. refreshing the site emits the `UserDisconnected` and then the `UserConnected` event again.
Since the screens are generated dynamically, these events allow us to control what (next) gets shown to the user.

:::note
when connecting to Armory, the user has a unique `connectionId`. This id is part of that user’s Armory URL, and will be randomly generated if not set for that user in advance.
:::

## Armory components and screens

As mentioned, Armory already comes with a number of "smart defaults", in the form of predefined components and styleguide for screen design. 
We'll go over them briefly, but once you get a hang of how things work, you are welcome to add more custom implementations[TODO insert link] and play around with the styling[TODO insert link] yourself.

You can show the screens you create using `ArmoryAPI.show()`, which takes the mentioned user connection id and the screen(s) to show, for example:
```java
ArmoryAPI.show(
    getConnection("armory"),
    new Screen("HelloScreen").add(new Title("Hello there!"))
);
```

But let's first learn how to create those screens!

### Components
The components are the building blocks of screens, and there are several you can use out-of-the-box, all implementing the `BaseComponent` interface:
* BackButton: component used in Screen headers
* CloudSelect: a cool multi-select component
* Description
* Header: component that normally contains a logo and the `BackButton` (enabled by setting the `allowsBack` field to `true`)
* Image
* Input: component that roughly corresponds to the HTML input element, with the input data type specified by setting `type`
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
[TODO add screenshots + tutorial references]
All data within a linked sequence of screens[TODO insert link] is transferred via GET parameters, and you can store them in bulk when a button with a certain `buttonId` is pressed.

### Screens
But what do we do with these components, and how can we assemble them to create screens? For this we use Armory's `Screen` class, to which we simply add the components in the order we want them to appear on the screen.

We should mention that there are some default standards when it comes to spatial organization of the components on screens: all components apart from the action ones (e.g. buttons taking you to the next screen) gravitate towards top of the screen. The action components are anchored to the bottom of the screen, to avoid screens shifting in size depending on how many components they contain.

You can easily override these standard practices by using the `group()` function, which allows you to create a group of components you want to "stick closer together" on the screen. Check it out:
```java
new Screen("customerOnboarding")
        .add(new Header("logo.png", true))
        .add(new Title("Tell us about yourself"))
        .group("center")
        .add(new Description("Welcome! We would like to get to know you a bit better. Can you start by telling us your name?"))
        .add(new Input("name", "Type your name here...", "text"))
        .group("bottom")
        .add(new SubmitButton("submitName", "Next"))
```

This will group the `Description` and `Input` component around the screen center, push the button to the bottom, leaving the `Header` and `Title` by default at the top.

The last function we're going to mention here is `setTemplate()`. If you create some specific screen layout you would like to apply to multiple screens (such as content centering, the order of components on the screen), you can create a template and just set it for all screens you want by writing `.setTemplate("TemplateName")` before adding the components:

```java
new Screen("customerOnboarding")
        .setTemplate("CenteredContent")
        .add(new Header("logo.png", true))
        .add(new Title("Tell us about yourself"))
        .group("center")
        .add(new Description("Welcome! We would like to get to know you a bit better. Can you start by telling us your name?"))
        .add(new Input("name", "Type your name here...", "text"))
        .group("bottom")
        .add(new SubmitButton("submitName", "Done"))
```

We'll show you how to create these templates and custom components in the next section.

Keep in mind that you can link together sequences of multiple Armory screens by specifying the transitions between them: the easiest way to do this is by setting the name of the next screen you want to go to as the value of the `SubmitButton` (e.g. `new SubmitButton("submitName", "Done", "askAddress")` takes the user to the screen where they will be asked to set their address). You can find plenty of examples of screen linking in the Armory tutorial[TODO add link].

## Custom components and templates [TODO]

You can easily create new custom components directly from Java using `CustomComponent`. The parameters of the component are specified as a map in its `params` field:
```java
new Screen("documentUpload")
    .add(new CustomComponent("FileUpload"))
```
The Vue counterpart of the component gets generated automatically based on the parameters you set, you just need to do these steps:
1. Create the components directory in `services/armory/src/components` [TODO include by default?]
2. Add the name of your custom component in the `App.vue` file:
```java title="services/armory/src/App.vue"
...
    getCustomComponents() {
      return {FileUpload};
...
```

Templates are really easy to define using the `TemplateGenerator`, so we only provide a couple of them out-of-the-box. 
One example is the `GenericTemplate` which contains the following components (in that order of appearance, if actually used on the screen): 
back button, title, image, description text, area for text input, area for data input, and a group of action components (e.g. buttons). 
Of course, not all available components need to be used every time.

The `GenericTemplate` is quite packed, but it can be much simpler than that - for example, we also provide a `TitleTemplate` which literally only contains a TitleComponent.