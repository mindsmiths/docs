---
sidebar_position: 6
---

# Adding images to screens

You can easily use images on screens. To try it out, you can add the media content to the `services/armory/public` directory, 
and add it normally by adding an `ImageComponent` to your screen:

```java title="models/agents/Nola.java"
public void showExampleScreen() {
        BaseTemplate newScreen = new TemplateGenerator("exampleTemplate")
            .addComponent("title", new TitleComponent("Screen Title"))
            .addComponent("description", new DescriptionComponent("Here is where we put the description."))
            .addComponent("input", new InputComponent("name", "Type in your name...", true))
            .addComponent("image", new ImageComponent("/public/image.png"))
            .addComponent("actionGroup", new ActionGroupComponent(List.of(new PrimarySubmitButtonComponent("Option 1", "opt1"), new PrimarySubmitButtonComponent("Option 2", "opt2"))));
        showScreen(newScreen);
    }
```

You can arrange the subdirectory structure inside `/public/` however you want, you only need to take care that the path to the image you added always starts with `/public/`.