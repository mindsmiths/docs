---
sidebar_position: 6
---

# Adding images to screens

You can easily use images on screens. To try it out, you can add the media content to the `services/armory/public` directory, 
and add it normally by adding an `ImageComponent` to your screen, for example:

```java title="models/agents/Mindy.java"
public void showOnboardingScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                "welcome", new TemplateGenerator("welcome")
                        .addComponent("title", new TitleComponent("Welcome to the Armory demo"))
                        .addComponent("description", new DescriptionComponent("We'll create a really simple onboarding process."))
                        .addComponent("image", new ImageComponent("/public/image.png"))
                        .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
        ...
    }
```

You can arrange the subdirectory structure inside `/public/` however you want, you only need to take care that the path to the image you added always starts with `/public/`.