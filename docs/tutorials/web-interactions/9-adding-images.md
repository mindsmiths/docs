---
sidebar_position: 9
---

# Final touches...

Lastly, let's see how you can add some final touches to your screens. We'll add images, headers and a redirecting functionality.

## Adding images
You can easily use images on screens. To try it out, you can add the media content somewhere in the `services/armory/public` directory, 
and add it to your screen using the `Image` component.You can arrange the subdirectory structure inside this directory however you want, 
you only need to take care that the path to the image you added always starts with `/public/`.

We'll add our image on the welcome screen:

```java title="java/agents/Felix.java"
...
import com.mindsmiths.armory.component.Image;

@Data
@NoArgsConstructor
public class Felix extends Agent {
    public void showStartScreens() {
            Map<String, BaseTemplate> screens = Map.of(
                    "welcome", new TemplateGenerator ("welcome")      
                    .addComponent("title", new Title("Hello! I’m Felix and I’m here to help you find the best workout plan for you. Ready?"))
                    .addComponent("image", new Image("/public/JogaPuppy.png"))  
                    .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                    "askForName", new TemplateGenerator("askForName")
                            .addComponent("title", new TitleComponent("Okay, first, tell me your name? :)"))
                            .addComponent("name", new InputComponent("name", "Type your name here", true))
                            .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "completed")));
            showScreens("welcome", screens);
        }
    }
```

## Header and backbutton

The same goes with header, but when it come to header, you need to add the media content somewhere in the `armory/src/assets` directory, 
and add it to your screen using the `Header` component. 
To allow the user to go back through the screen chain, simply set the `allowsUndo` field in the `Header` component to `true`. 
Let's see this in the onboarding screens:
We'll add different headers (with and without backbutton) to onboarding screens, but you can add it wherever you want.

```java titile="agents/Felix.java"
package agents;
...
public class Felix extends Agent {
    public void showOnboardingScreens() {
        ArmoryAPI.show(
                getConnection("armory"),
                new Screen("startOnboarding")
                        .add(new Header("logo.png", false))
                        .add(new Title(String.format("Nice to meet you, %s! To make a workout plan just for you, I have a few question.\nReady? 💪", name)))
                        .add(new SubmitButton("buttonPressed", "Let's go!", "askForWeight")),
                new Screen("askForWeight")
                        .add(new Header("logo.png", true))
                        .add(new Title("How much do you weigh in kilograms?"))
                        .add(new Input("weight", "Type your weight here", "number"))
                        .add(new SubmitButton("buttonPressed", "Next!", "askForHeight")),
                new Screen("askForHeight")
                        .add(new Header("logo.png", true))
                        .add(new Title("How tall are you in cm?"))
                        .add(new Input("height", "Type your height here", "number"))
                        .add(new SubmitButton("buttonPressed", "Next!", "finishOnboarding"))
        );
    }
}
```

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
                new Screen ("endScreen")
                        .add(new Header("logo.png", true))
                        .add(new Title("You are the best!💜"))
                        .add(new Description("If you want to join our workout group on Discord, here is a <a href='https://discord.com/invite/mindsmiths'>link</a> !"))
        )
    }
}
```

Hit `forge run` to try out your new features!

And, that's it! Have fun building new user experiences with Armory. 