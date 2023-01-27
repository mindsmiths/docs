---
sidebar_position: 7
---

# Final touches...

Lastly, let's see how you can add some final touches to your screens. We'll add images to screens, and a redirecting functionality.

## Adding images

You can easily use images on screens. To try it out, you can add the media content somewhere in the `services/armory/public` directory, 
and add it to your screen using the `ImageComponent`.

We'll add our image on the welcome screen:
```java title="java/agents/Felix.java"
...
import com.mindsmiths.armory.component.ImageComponent;

@Data
@NoArgsConstructor
public class Felix extends Agent {
    public void showStartScreens() {
            Map<String, BaseTemplate> screens = Map.of(
                    "welcome", new TemplateGenerator ("welcome")      
                    .addComponent("title", new TitleComponent("Hello! I’m Felix and I’m here to help you find the best workout plan for you. Ready?"))
                    .addComponent("image", new ImageComponent("/public/JogaPuppy.png"))  
                    .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                    "askForName", new TemplateGenerator("askForName")
                            .addComponent("title", new TitleComponent("Okay, first, tell me your name? :)"))
                            .addComponent("name", new InputComponent("name", "Type your name here", true))
                            .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "completed")));
            showScreens("welcome", screens);
        }
    }
```

You can arrange the subdirectory structure inside this directory however you want, you only need to take care that the path to the image you added always starts with `/public/`.


## Redirecting from Armory

As mentioned, you can also redirect users to another location through a link on the Armory screen.
For example, after finishing the onboarding process, Felix could redirect the user to the community Discord server.

Just use the hyperlink notation (`<a href='link_placeholder'>text_placeholder</a>`) and add the hyperlink on any screen you want:
```java title="java/agents/Felix.java"
...

@Data
@NoArgsConstructor
public class Felix extends Agent {
    public void showSurveyScreens() {
        Map<String, BaseTemplate> screens = Map.of(
                ...
                "endScreen", new TemplateGenerator("endScreen")
                        .addComponent("title", new TitleComponent("You are the best!💙"))
                        .addComponent("description", new DescriptionComponent("To join our workout group on Discord, here is a <a href='https://discord.com/invite/mindsmiths'>link</a> !"))
                        );
        showScreens("waterIntake", screens);
    }
}
```

Hit `forge run` to try out your new features!

And, that's it! Have fun building new user experiences with Armory. 