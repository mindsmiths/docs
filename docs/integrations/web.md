---
sidebar_position: 7
---

# Web

Mindsmiths Platform supports dynamically generated web pages.
You can use these pages to display content to your users, and to collect the data they input.

We call this web templating service **Armory**. Using Armory is very simple, but there are a couple basic concepts you need to grasp before you start. 
We look at each of those concepts below.

<details>
  <summary>Setup details</summary>
<div>
    <div><p><b>Environment variables:</b></p>
        <ul>
            <li>ARMORY_SITE_URL</li>
        </ul>
    </div>
    <div>
        <p><b>Installation:</b></p>
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

## When to use Armory?

Armory allows you to create an app-like experience for your users quickly and easily, with sequences of linked screens. 
This provides the feeling of user guidance through the process you are modeling. One of its biggest perks is that it 
allows you to smoothly build in the logic you need and try out various components, with minimum code.

## Core features


- Build web applications using an intuitive templating system
- Create different flows - sequences of linked screens 
- Add various different components quickly and easily
- Provide guided user experience


## Differentiating user flows

A flow is a sequence of screens that are linked together. 
You can build different flows and trigger them in the situation that seems right.

When going through the flow, users can make progress in their own pace, finish it all at once or take a pause and finish it later if possible.
All this is achievable because every user has unique **connection id**.
This id is used to identify the user and helps to keep track of the users' progress in the specific flow.

:::tip When to use different flows?

Let's say you want to build an app that allows users to make orders.

In that case, you can define an Onboarding flow and an Order flow. When users connect with the app for the first time, they'll go through the Onboarding flow.
After that, when they'll want to make a new Order, they'll go through the Order flow. 

User can go over a certain flow multiple times or just once, as well as continue from the last screen they were on or start all over again, which ever suits them best.

:::

## Armory screens and components

As mentioned, Armory already comes with a number of "smart defaults", in the form of predefined components and styleguide for screen design. 
We'll go over them briefly, but once you get a hang of how things work, you are welcome to add more [custom implementations](/docs/integrations/web#custom-components) and play around with the [styling](/docs/integrations/web#custom-templates) yourself.

### Building and representing the screens

Let's start with building the screens. There are two ways to build screens - manually or through a configuration file.

If you want to build screens **manually**, you need to use the `Screen` class, which takes the screen name as a parameter. After you define a Screen, you can gradually build up components on it.
For forming a flow, you just put all the screens in a list and connect them with the `SubmitButton` component.

:::tip First screen

The flow's starting point can be defined with setting the `firstScreen` parameter. Else, the screen you specify first will be the one that's first shown to the user.

:::

On the other hand, when you're building the screens using a **configuration file**, then you'll put all the screens' specification inside a `.yaml` file.
This configuration file can be defined in a separate file, or within the [Control Panel](../platform/advanced-concepts/control-panel.md) service through the Configuration editor.
Another option is to define the configuration through the Dashboard. 

In each of these cases, you'll need to build the screens first before showing them. You'll use the `ArmoryAPI.buildScreens()` method for that. 
This method takes the first screen name and the configuration file as parameters, and returns a list of screens.

If you want to fill some of the components with personalized data, you can pass the `context` parameter to the `buildScreens()` method. 
In the `context`, which is actually a dictionary, you can define the key-value pairs that will be used to fill parts of the components text parameter.

<details>
  <summary>How to use <code>ArmoryAPI.buildScreens()</code> </summary>
<div>
    <div><p><b>ArmoryAPI.buildScreens()</b></p>
        <ul>
            <li><code>public static List&lt;Screen&gt; buildScreens(String firstScreen, JsonNode screensSpec)</code></li>
            <li><code>public static List&lt;Screen&gt; buildScreens(String firstScreen, Map&lt;String, Object&gt; context, JsonNode screensSpec)</code></li>
            <li><code>public static List&lt;Screen&gt; buildScreens(String firstScreen, JsonNode screensSpec, List&lt;HistoryItem&gt; history)</code></li>
            <li><code>public static List&lt;Screen&gt; buildScreens(String firstScreen, Map&lt;String, Object> context, JsonNode screensSpec, List&lt;HistoryItem&gt; history)</code></li>
        </ul>
    </div>
  </div>
</details>

Once you've prepared the screens, it's time to showcase your flows to the users.
You can show the screens you create using `ArmoryAPI.show()`, which takes the user connection id and the screen(s) to show, for example:

<details>
  <summary>How to use <code>ArmoryAPI.show()</code> </summary>
    <div><p><b>ArmoryAPI.show()</b></p>
        <ul>
            <li><code>public static Show show(String connectionId, Screen... screens)</code></li>
            <li><code>public static Show show(String connectionId, String firstScreen, Screen... screens)</code></li>
            <li><code>public static Show show(String connectionId, Map&lt;String, Object&gt; configuration, Screen... screens)</code></li>
            <li><code>public static Show show(String connectionId, String firstScreen, Map&lt;String, Object&gt; configuration, Screen... screens)</code></li>
            <li><code>public static Show show(String connectionId, List&lt;Screen&gt; screens)</code></li>
            <li><code>public static Show show(String connectionId, Map&lt;String, Object> configuration, List&lt;Screen&gt; screens)</code></li>
            <li><code>public static Show show(String connectionId, String firstScreen, Map&lt;String, Object&gt; configuration, List&lt;Screen&gt; screens)</code></li>
            <li><code>public static Show show(String connectionId, List&lt;HistoryItem> history, Screen... screens)</code></li>
            <li><code>public static Show show(String connectionId, String firstScreen, List&lt;HistoryItem&gt; history, Screen... screens)</code></li>
            <li><code>public static Show show(String connectionId, List&lt;HistoryItem> history, Map&lt;String, Object&gt; configuration, Screen... screens)</code></li>
            <li><code> public static Show show(String connectionId, String firstScreen, List&ltHistoryItem&gt; history, Map&lt;String, Object&gt; configuration, Screen... screens)</code></li>
            <li><code>public static Show show(String connectionId, List&lt;HistoryItem> history, List&lt;Screen&gt; screens)</code></li>
            <li><code>public static Show show(String connectionId, String firstScreen, List&lt;HistoryItem&gt; history, List&lt;Screen&gt; screens)</code></li>
            <li><code>public static Show show(String connectionId, List&lt;HistoryItem> history, Map&lt;String, Object> configuration, List&lt;Screen> screens)</code></li>
            <li><code>public static Show show(String connectionId, String firstScreen, List&lt;HistoryItem&gt; history, Map&lt;String, Object> configuration, List&ltScreen&gt; screens)</code></li>
        </ul>
    </div>
</details>


Finally, here are some examples that show how the two different ways of building screens are used in rules. First one is covering the manual way, while the other is covering the configuration file way.

```java
rule "Show onboarding flow"
        when
            signal: UserConnected() from entry-point "signals"
            agent: Agent(onboarded == false)
        then
            Log.info("Showing onboarding flow to user " + agent.getId());
            ArmoryAPI.show(
                agent.getConnection("armory"),
                new Screen("welcome")
                    .add(new Title("Hello there!"))
                    .add(new Description("Are you ready to get started?"))
                    .add(new SubmitButton("start", "Let's go!", "ask-for-name")),
                new Screen("ask-for-name")
                    .add(new Title("What's your name? 😊"))
                    .add(new Input("first-name", "Type your first name here..."))
                    .add(new Input("last-name", "Type your last name here..."))
                    .add(new SubmitButton("submit-name", "Submit"))
            );
end
```

It's easy to notice how the manual build-up can instantly get messy. This approach is fitting if you have a minimal number of screens or are trying to test something out.
The better way is to build the screens through the configuration file, which is shown below.

```java
rule "Show onboarding flow"
        when
            signal: UserConnected() from entry-point "signals"
            agent: Agent(onboarded == false)
        then
            Log.info("Showing onboarding flow to user " + agent.getId());
            ArmoryAPI.show(
                    agent.getConnection("armory"),
                    ArmoryAPI.buildScreens("welcome", Config.get("screens"))
            );
end
```

Here you can take a look how will the config look like, in comparison with the manual build-up.

```yaml
screens:
  welcome:
    - Title:
        text: "Hello there!"
    - Description:
        text: "Are you ready to get started?"
    - SubmitButton:
        inputId: "start"
        text: "Let's go!"
        nextScreen: "ask-for-name"
  ask-for-name:
    - Title:
        text: "What's your name? 😊"
    - Input:
        inputId: "first-name"
        placeholder: "Type your first name here..."
        type: "text"
        required: true
        label: "First name"
    - Input:
        inputId: "last-name"
        placeholder: "Type your last name here..."
        type: "text"
        required: true
        label: "Last name"
    - SubmitButton:
        inputId: "submit-name"
        text: "Submit"
```

Next step - exploring all the different components that come predefined with Armory!

### Components
The components are the building blocks of screens, and there are several you can use out-of-the-box:
* **Header**: component that normally contains a logo and the `BackButton` (enabled by setting the `allowsBack` field to `true`)
* **Title**
* **Description**
* **Input**: component that roughly corresponds to the [HTML input element](https://www.w3schools.com/html/html_form_input_types.asp), with the input data type specified by setting `type`
* **TextArea**: component for longer text input
* **Select**: choose one option from a list
* **CloudSelect**: a cool multi-select component
* **QuantitySelect**: component for specifying quantities
* **RadioSelect**: component for choosing one option from a list, but with radio buttons
* **Toggle**: component that imitates a switch
* **NestedToggle**: you guessed it, it's a toggle that shows/hides other components
* **Image**
* **SubmitButton**: basic button component, triggers a `Submit` event
* **QrcodeScanner**: component that allows the user to scan a QR code

Components that are used to collect some sort of input or activity from the user (text areas, buttons, select components etc.) are referenced through the `inputId`.
You can even make all of these components obligatory by setting its default value of the `required` field to `true`.
If a component is set to required, users can only progress within the flow if they interact with it accordingly.  

If you're wondering how to access the input user submitted, the next rule will serve as an example.

```java
rule "Save user name"
    when
        signal: Submit(buttonId == "submit-name", firstName: getParamAsString("first-name")) from entry-point "signals"
        agent: Customer()
    then
        modify(agent){setFirstName(firstName)};
        delete (signal);
end
```

The previous rule registers users entering their name and submitting it by pressing a button.
With each press of a `SubmitButton`, a `Submit` event is triggered. You can catch a specific `Submit` event inside a rule using the defined `buttonId`, as seen in the example above.
This type of event also contains values of all the components that have been previously filled out. You can access them 
by using the `getParamAs____()` functions, which all take the `inputId` of the component as a parameter.

:::info Type of the `getParamAs____()` functions

- `public String getParamAsString(String param)`
- `public Boolean getParamAsBool(String param)`
- `public Integer getParamAsInteger(String param)`
- `public Double getParamAsDouble(String param)`
- `public <T> List<T> getParamAsList(String param, Class<T> cls)`
- `public <T> Map<String, T> getParamAsMap(String param, Class<T> valueCls)`
- `public <T, U> Map<T, U> getParamAsMap(String param, Class<T> keyCls, Class<U> valueCls)`
- `public <T> T getParamAs(String param, Class<T> cls)`
- `public JsonNode getParam(String param)`

:::

All data within a [linked sequence of screens](/docs/tutorials/web-interactions/chaining-screens) is transferred via GET parameters, and you can store them in bulk when a button with a certain `buttonId` is pressed.

But now, let's break it down for every component, so you can get a better idea of when and how to use them, as well as how they look like.
For this case, let's create an onboarding flow and try to use all the available components, and maybe even a few custom ones.
We will demonstrate the components by groups, with the corresponding example of the screen they are used in provided in the end.

Let's start with the components that are most frequently used. On the next image, you can see a screen with the following components:
Header, Title, Description, Input and SubmitButton.

<img src="/img/armory/components/basic-components.png#center" alt="basic component" tag="image-basic" id="image-basic"/>

#### Header

This component is used for displaying a logo and a back button. It's always  placed at the top of the screen.

On the previous image, you can see how it looks like when the logo is set, and the back button is enabled.

```yaml
- Header:
    src: "logo.png"
    allowsBack: true
```

- OPTIONAL
  - `src` is used for setting the path to logo image. If not set, the logo won't be shown
  - `allowsBack` is used for setting whether the back button is shown or not. If not set, the back button won't be shown

#### Title

Title component is used for displaying a text that you want to emphasize in a way on the screen.
Titles have text bolded, and the font size is on the larger side.

```yaml
- Title:
    text: "Hi, there 🫣"
```

- REQUIRED
    - `text` is used for setting the text which will be shown in the title

#### Description

This component is used for displaying a text with a slighter less accentuated look. Compared to a `Title`, 
it has a smaller font, and it isn't bolded.

```yaml
- Description:
    text: "Let's get to know each other"
```
- REQUIRED
  - `text` is used for setting the description text

#### Input

This component is used for collecting user's input, especially in cases where you need users to enter a short amount of text.

```yaml
- Input:
    label: "First name"
    inputId: "first-name"
    type: "text"
    placeholder: "Jane"
    value: "{{ user.firstName}}"
    required: true
```

- REQUIRED
  - `inputId` is an identifier used for referencing the component in the code
- OPTIONAL
  - `placeholder` is used for setting the placeholder text, this will be shown as an example of what the user should enter and will disappear once the user starts typing
  - `type` is used for setting the input type, different versions can be found [here](https://www.w3schools.com/tags/att_input_type.asp)
  - `value` is used for setting the default value of the input and can be additionally edited from the user's side
  - `required` is used for setting whether the input is required or not
  - `label` is used for setting the label text, which will be shown directly above the input and serves as an description of the specific input field

#### SubmitButton

SubmitButton component enables users to progress through the flow and allows them to submit their various input. 
Once the user clicks on it, this will automatically trigger a `Submit` event.
This way, it can easily be addressed in the code and used for redirecting the user to another screen, or for storing the data they entered.

```yaml
- SubmitButton:
    inputId: "start"
    text: "Continue"
    nextScreen: "onboarding-description"
    customClasses:
      - "highlighted"
```

- REQUIRED
  - `inputId` is an identifier used for referencing the component in the code
- OPTIONAL
  - `text` is used for setting the button's text
  - `nextScreen` is used for setting the next screen that will be shown after the button is pressed
  - `customClasses` is used for setting custom css classes for the button

Also, if you look again at the [image above](#image-basic), SubmitButton on the left screen is inactive at first, because user hasn't entered any input yet.
As soon as the users starts with entering the data, the button becomes active and can be pressed, which is demonstrated on the right screen.

Besides the classic input components, Armory comes with many different solutions ready for users to interact with and enabling them to enter requested information
in different occasions. Let's take a look at some of them. 

#### TextArea

This component is used in cases where you need users to enter a longer text, such as a comment or a description.

![image](/img/armory/components/text-area.png#center)

```yaml
- TextArea:
    inputId: "user-bio"
    label: "Write your bio here 🤩"
    placeholder: "I'm Jane, junior software developer who just started here at Mindsmiths..."
    required: true
    value: "{{ user.bio }}"
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
- OPTIONAL
  - `placeholder` is used for setting the placeholder text
  - `value` is used for setting the default value of the text area
  - `required` is used for setting whether the text area is required or not
  - `label` is used for setting the label text

There are a few different ways users can select one or more items from the given options, so get ready because we're about 
to go through each one.

#### Select

This component is used in cases where you need users to select one value from predefined options, and you don't want all 
the options to be straightly listed. Instead, they'll be listed as a part of a dropdown menu.

![image](/img/armory/components/select.png#center)

```yaml
- Select:
    inputId: "language"
    placeholder: "Pick one"
    value: "{{ user.language }}"
    required: true
    options:
      - "Python"
      - "Java"
      - "Rust"
      - "C++"
      - "Javascript"
      - "Other"
    label: "Which of these are you most familiar with?"
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
  - `options` is used for setting the options that will be shown in the select
- OPTIONAL
  - `placeholder` is used for setting the placeholder text
  - `value` is used for setting the default value of the select
  - `required` is used for setting whether the select is required or not
  - `classes` is used for setting custom css classes for the select
  - `label` is used for setting the label text

#### CloudSelect

This component is used in cases where you need users to select multiple values from predefined options.

![image](/img/armory/components/cloud-select.png#center)

```yaml
- CloudSelect:
    inputId: "preferencesSelect"
    required: true
    label: "You can select more than one"
    options:
      - text: "Proactivity"
        value: "proactivity"
      - text: "Reliability"
        value: "detail"
      - text: "Problem solver"
        value: "solver"
      - text: "Flexible"
        value: "flexible"
      - text: "Collaborative"
        value: "collaborative"
      - text: "Dedicated"
        value: "dedicated"
      - text: "Teamwork"
        value: "teamwork"
      - text: "Creativity"
        value: "creativeity"
      - text: "Detail oriented"
        value: "flexible"
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
- OPTIONAL
  - `required` is used for setting whether the select is required or not
  - `options` is used for setting the options that will be shown in the select, for each option, you have to 
  - `label` is used for setting the label text

#### RadioSelect

This component is used in cases where you need users to select one value from predefined options, and you need all of them 
to be listed on the screen.

![image](/img/armory/components/radio-select.png#center)

```yaml
- RadioSelect:
    inputId: "position"
    required: true
    options:
      - value: "backend-dev"
        text: "Backend developer"
      - value: "frontend-dev"
        text: "Frontend developer"
      - value: "cloud-engineer"
        text: "Cloud engineer"
      - value: "fullstack-developer"
        text: "Fullstack developer"
    classes:
      - "highlighted"
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
  - `options` is used for setting the options that will be shown in the select
- OPTIONAL
  - `value` is used for setting the default value of the select
  - `classes` is used for setting custom css classes for the select
  - `required` is used for setting whether the select is required or not

#### QuantitySelect

This component is used in cases where you need users to select a quantity from a predefined range.

![image](/img/armory/components/quantity-selector.png#center)

```yaml
- QuantitySelect:
    inputId: "quantity-select"
    label: "Preferred working hours: "
    value: "8"
    minValue: 4
    maxValue: 12
    step: 1
    required: false
    classes:
      - "highlighted"
    format: "{value}h"
    type: "is-primary"
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
  - `label` is used for setting the label text
  - `value` is used for setting the default value of the select
- OPTIONAL
  - `minValue` is used for setting the minimum value of the select
  - `maxValue` is used for setting the maximum value of the select
  - `step` is used for setting the step of the select
  - `required` is used for setting whether the select is required or not
  - `classes` is used for setting custom css classes for the select
  - `format` is used for setting the format of the select
  - `type` is used for setting whether the select corresponds to the primary color scheme

#### RangeSlider

Range slider component is used in cases where you need users to select a scope from a predefined range.

![image](/img/armory/components/range-slider.png#center)

```yaml
- RangeSlider:
    inputId: "workload-hours"
    minValue: 20
    maxValue: 60
    value: "{{ user.workloadHours }}"
    step: 2
    required: true
    label: "Somewhere between ${lowerValue} and ${upperValue} hours"
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
  - `minValue` is used for setting the minimum value of the slider
  - `maxValue` is used for setting the maximum value of the slider
- OPTIONAL
  - `value` is used for setting the default values of the slider
  - `step` is used for setting the step of the slider
  - `required` is used for setting whether the slider is required or not

#### ImageUpload

This component is used in cases where you need users to upload an image in  your flow.

![image](/img/armory/components/image-uploader.png#center)

```yaml
- ImageUpload:
    inputId: "image-upload"
    uploadText: "Upload image"
    uploadedText: "Image uploaded"
    value: "{{ user.defaultImage }}"
    required: true
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
- OPTIONAL
  - `uploadText` is used for setting the text that will be shown on the button until the image is uploaded
  - `uploadedText` is used for setting the text that will be shown on the button when the image is uploaded
  - `value` is used for setting the default value of the image
  - `required` is used for setting whether the image is required or not


#### Image

This component is used in cases where you need to display an image.

![image](/img/armory/components/image.png#center)

```yaml
- Image:
    src: "discord-logo.png"
    classes: 
      - "highlighted" 
```

- REQUIRED
  - `src` is used for setting the path to the image source
- OPTIONAL
  - `classes` is used for setting custom css classes for the image

#### Toggles

Toggles are used in scenarios where you need users to select either true of false value for a specified field.
Armory supports two version of toggles - regular and a nested one. The following image demonstrates both.

<img src="/img/armory/components/toggles.png#center" alt="toggles" tag="toggles" id="toggles"/>

```yaml
- Toggle:
    inputId: "toggle"
    label: "Toggle example"
    value: "{{user.previousToggleChoice}}"
    leftLabel: false
    type: "is-primary"
    classes:
      - "highlighted"
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
  - `label` is used for setting the label text
- OPTIONAL
  - `value` is used for setting the default value of the toggle
  - `leftLabel` is used for setting whether the label is on the left or right side of the toggle
  - `type` is used for setting whether the toggle corresponds to the primary color scheme
  - `classes` is used for setting custom css classes for the toggle

#### NestedToggle

This component is used in cases where you need users to select either true of false for a specified field, and show/hide other components based on the chosen value.

```yaml
- NestedToggle:
    inputId: "nested-toggle"
    label: "Want to leave your repo?"
    value: "{{ user.previousNestedToggleChoice }}"
    leftLabel: true
    type: "is-primary"
    classes:
      - "highlighted"
    childComponents:
      - Input:
          type: "url"
          placeholder: "https://github.com/mindsmiths/docs"
          value: "{{ user.repoUrl }}"
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
  - `label` is used for setting the label text
  - `childComponents` is used for setting the components that will be shown/hidden based on the toggle's value
- OPTIONAL
  - `value` is used for setting the default value of the toggle
  - `leftLabel` is used for setting whether the label is on the left or right side of the toggle
  - `type` is used for setting whether the toggle corresponds to the primary color scheme
  - `classes` is used for setting custom css classes for the toggle

Once the toggle is set to true, the child component will be shown, as it is demonstrated on the [image above](#toggles).

#### QrcodeScanner

This component is used in cases where you need users to scan a QR code.

```yaml
- QrcodeScanner:
    inputId: "qrcode-scanner"
    notAllowedError: "Camera access not allowed"
    notFoundError: "QR code not found"
    notSupportedError: "QR code scanning not supported"
    notReadableError: "QR code not readable"
    overconstrainedError: "Camera access not allowed"
    streamApiNotSupportedError: "QR code scanning not supported"
    insecureContextError: "QR code scanning not supported"
    timeoutMs: 5000
```

- REQUIRED
  - `inputId` is used for referencing the component in the code
- OPTIONAL
  - `notAllowedError` is used for setting the error message that will be shown if the camera access is not allowed
  - `notFoundError` is used for setting the error message that will be shown if the QR code is not found
  - `notSupportedError` is used for setting the error message that will be shown if the QR code scanning is not supported
  - `notReadableError` is used for setting the error message that will be shown if the QR code is not readable
  - `overconstrainedError` is used for setting the error message that will be shown if the camera access is not allowed
  - `streamApiNotSupportedError` is used for setting the error message that will be shown if the QR code scanning is not supported
  - `insecureContextError` is used for setting the error message that will be shown if the QR code scanning is not supported
  - `timeoutMs` is used for setting the timeout in milliseconds


### Templates and screen's layout
How do we organize different components, and how can we assemble them to create a great user experience?

Now is the right time to mention that there are some default standards when it comes to spatial organization of the components on screens, and we refer to it as **default template**.
The default template manifests in a way that all components apart from the action ones (e.g. buttons taking you to the next screen) gravitate towards top of the screen.
The action components are anchored to the bottom of the screen, to avoid screens shifting in size depending on how many components they contain.

It's convenient to organize your screens this way when you want to fill the entire screen with the components.

Another template that comes predefined is the **centered template**. It's used when you want to group components around the center of the screen.
Centered template looks best when there's only a few components on the screen - most commonly a header, title and a button. On the following scheme you can see compare these two different screens' layouts:

![image](/img/armory/default-template.png#left)
![image](/img/armory/centered-content-template.png#right)

If you are interested in how would one apply a template to a screen, check out the following example:

![image](/img/armory/default-screen-preview.png#left)
![image](/img/armory/centered-screen-preview.png#right)


![image](/img/armory/default-content-config.png#center)
![image](/img/armory/centered-content-config.png#center)

If the predefined templates don't work well for your case, there's an option of creating your own templates, [here](#custom-components) you can learn how to do it.
But if you want another quick solution, you can easily override these standard practices by using the `group()` function, 
which allows you to create a group of components you want to "stick closer together" on the screen. 

Check out our next example:

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
Here you can see how it looks. The first screen is the default screen, while the second screen includes the `group` component.

![graphic](/img/web/Screen.png#center)

## Creating components and templates

### Custom components

Let's take a look at how you can add new custom components to your screens. Let's say you wanted to add a component for uploading a document to your screen.

The steps are as follows:
1. Create the components directory in `services/armory/src/components`
2. Add the component in Vue by creating a `.vue` file in the directory:
```javascript title="services/armory/src/components/FileUpload.vue"
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
```javascript title="services/armory/src/App.vue"
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

Let's take a look at how to create the custom template. For simplicity's sake, let's call it `CustomTemplate`. You just need to open the `skin.scss` file and add the following:
```scss title="services/armory/src/assets/css/skin.scss"
...
div.CenteredContent {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;
        padding-bottom: 55px;
        background: ghostwhite;
}
...
```

:::note
If you're looking for some scss basics, you can check out this [website](https://sass-lang.com/guide).
:::

The last function we're going to mention here is `setTemplate()`. Sometimes, you need a lot of custom logic relating to the screen layout. Some simpler examples of this include content centering, fixed custom order of components on the screen etc.

When you define this custom screen layout within a template, you can apply it to any screen by calling `.setTemplate("CustomTemplateName")` before adding the components:

```java
new Screen("welcomeScreen")
        // highlight-changed-line
        .setTemplate("CustomTemplate")
...
```

Here you can see how it looks like.

![graphic](/img/web/Screen2.png#center)

Keep in mind that you can link together sequences of multiple Armory screens by specifying the transitions between them: the easiest way to do this is by setting the name of the next screen you want to go to as the value of the `SubmitButton` 
(e.g. `new SubmitButton("submitName", "Done", "askAddress")` takes the user to the screen where they will be asked to set their address). 
You can find plenty of examples of screen linking in the Armory [tutorial](/docs/tutorials/web-interactions/introduction).

That's it, you can now apply your custom template to any screen you want!