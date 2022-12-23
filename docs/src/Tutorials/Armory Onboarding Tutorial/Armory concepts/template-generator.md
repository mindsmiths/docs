---
sidebar_position: 3
---

# Template generator

We mentioned you can always use one of the predefined templates to create screens, such as the `TitleTemplate`:
```BaseTemplate screen = new TitleTemplate("Hello, world!");```

But assuming you’ll often want to create your own layouts, we’ll now focus a bit more on the `TemplateGenerator`. Let’s look at an example of how we can use it to create a new template:

```java
new TemplateGenerator("exampleTemplate")
            .addComponent("title", new TitleComponent("Screen Title"))
            .addComponent("description", new DescriptionComponent("Here is where we put the description."))
            .addComponent("input", new InputComponent("name", "Type your name…", true))
            .addComponent("actionGroup", new ActionGroupComponent(List.of(
                        new PrimarySubmitButtonComponent("inputId1", "Option 1", "NextScreen1"),
                        new PrimarySubmitButtonComponent("inputId2", "Option 2", "NextScreen2")
)));
```

Let’s break down this code a little before writing up the actual code: when instantiating a `TemplateGenerator`, the first thing we can optionally set (```"exampleTemplate"```) 
is the screen name, and then we add the components we want our template to contain. Here we chose to have a title, description,
input field and a group of buttons. The components are added in the form of HashMap with a string identifier as key (usually “input1”, 
“input2” etc. in case of repeating components) and the component itself as value.

We'll go through the logic that gets executed in the background as we integrate the actual screens to our project.

You can combine elements like these in any order you like. Feel free to create some of your own templates a check them out when running `forge run`.