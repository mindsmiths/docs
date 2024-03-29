---
sidebar_position: 9
---

# Final touches

Lastly, let's see how you can add some final touches to your screens. We'll add images, headers and a redirecting functionality.

## Adding images
You can easily use images on screens. To try it out, you can add the media content somewhere in the `services/armory/public` directory, 
and add it to your screen using the `Image` component. You can arrange the subdirectory structure inside this directory however you want, 
you only need to take care that the path to the image you added always starts with `/public/`.

We'll add our image on the welcome screen:

```java title="java/agents/Felix.java"
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Felix extends Agent {

    public void showWelcomeScreens() {
        ArmoryAPI.show(
                getConnection("armory"),
                new Screen("welcome")
                        .add(new Title("I’m Felix and I’m here to help you get fit and healthy! Ready?"))
                        // highlight-added-line
                        .add(new Image("public/JogaPuppy.png", false))
                        .add(new SubmitButton("welcomeStarted", "Cool, let's go!", "askForName")),
                new Screen("askForName")
                        .add(new Title("Alright! What's your name? 😊"))
                        .add(new Input("name", "Type your name here", "text"))
                        .add(new SubmitButton("nameSubmitted", "Done, next!"))
        );
    }
}
```

## Header and Back button

The same goes with header, but when adding header you need to add the media content somewhere in the `armory/src/assets` directory, 
and add it to your screen using the `Header` component. 
To allow the user to go back through the screen chain, simply set the `allowsUndo` field in the `Header` component to `true`. 
Let's see this in the onboarding screens:
We'll add different headers (with and without backbutton) to onboarding screens, but you can add it wherever you want.

```java titile="java/agents/Felix.java"
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Felix extends Agent {

    public void showOnboardingScreens() {
        ArmoryAPI.show(
                getConnection("armory"),
                new Screen("startOnboarding")
                        .add(new Title(String.format("Nice to meet you %s! Now let's make a workout plan just for you!\nReady? 💪", name)))
                        // highlight-added-line
                        .add(new Image("public/GymPuppy.png", false))
                        .add(new SubmitButton("onboardingStarted", "Let's go!", "askForWeight")),
                new Screen("askForWeight")
                        // highlight-added-line
                        .add(new Header("logo.png", true))
                        .add(new Title("How much do you weigh in kilograms?"))
                        .add(new Input("weight", "Type your weight here", "number"))
                        .add(new SubmitButton("weightSubmitted", "Next!", "askForHeight")),
                new Screen("askForHeight")
                        // highlight-added-line
                        .add(new Header("logo.png", true))
                        .add(new Title("How tall are you in cm?"))
                        .add(new Input("height", "Type your height here", "number"))
                        .add(new SubmitButton("heightSubmitted", "Next!"))
        );
    }
}
```

## Redirecting from Armory

As mentioned, you can also redirect users to another location through a link on the Armory screen.
For example, after finishing the onboarding process, Felix could redirect the user to the community Discord server.

Just use the hyperlink notation (`<a href='link_placeholder'>text_placeholder</a>`) and add the hyperlink on any screen you want:

```java title="java/agents/Felix.java"
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Felix extends Agent {

    public void showGPT3Response() {
        ArmoryAPI.show(
            getConnection("armory"),
                new Screen ("gptScreen")
                        .add(new Header("logo.png", false))
                        .add(new Title (this.workoutPlan))
                        .add(new SubmitButton("planSent", "Thanks Felix!", "endScreen")),
                new Screen ("endScreen")
                        .add(new Header("logo.png", true))
                        .add(new Title("You are the best!💜"))
                        // highlight-changed-line
                        .add(new Description("To join our workout group on Discord, here is a <a href='https://discord.com/invite/mindsmiths'>link</a> !"))
        );
    }
}
```

Hit `forge run` to try out your new features!

And, that's it! Have fun building new user experiences with Armory. 

P.S. You can find the entire code on our GitHub → `https://github.com/mindsmiths/examples/tree/main/felix`!

:::note 
If you want to spare some time, here you can find `Felix.drl` file → ``https://github.com/mindsmiths/examples/tree/main/felix/services/rule_engine/src/main/resources/rules/felix``, 
and here is `Felix.java` file → ``https://github.com/mindsmiths/examples/blob/main/felix/services/rule_engine/src/main/java/agents/Felix.java``. 
Images and `scss` file can be found here → ``https://github.com/mindsmiths/examples/tree/main/felix/services/armory``.
:::

Enjoy!


