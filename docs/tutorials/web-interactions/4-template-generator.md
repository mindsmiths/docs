---
sidebar_position: 4
---

# Meet Felix!

So, let's see how to generate various screens in Armory.

We'll take you through creating a simple agent named Felix, who will gather information about you and your workout preferences. 
With Felix, you will build onboarding screens, create a short survey for user profiling, and try out a bunch of different components.

Let's just jump right in!

First, inside the `Felix.java` file, create the `showWelcomeScreens()` function. We'll add a screen template and add the components we want our first screen to have.  

```java title="java/agents/Felix.java"
@Data
@ToString(callSuper = true)
@NoArgsConstructor
public class Felix extends Agent {
    
    public void showWelcomeScreens() {
            ArmoryAPI.show(
                    getConnection("armory"),
                    new Screen("welcome")
                            .add(new Title("Hello! I’m Felix, your new workout buddy. I’m here to help you get fit and healthy!\nReady?"))
                            .add(new SubmitButton("welcomeStarted", "Cool, let's go!")),
        );
    }
}
```

Let's look at this code real quick: when it comes to building screens, we need to add them in the exact order we want them to appear. 
So, the first screen in sequence is the first one to appear. Adding screens is pretty straightforward: 
we can simply add a screen by writing `new Screen()` and defining the name of the screen within the parentheses.
Our first screen consists of title text, an image, and a button that will eventually take us to the next screen in the sequence. 
The second screen contains a header and an input, too. As you can see, adding new components in Armory is pretty simple; 
you just add the components you want to add inside the `new Screen()`, in the order you want them to be aligned. 

:::tip
In this tutorial, we are going to use just some of the existing components. 
If you're curious, you can find more Armory components and learn how they work [here](/docs/integrations/web).
:::

But enough with the spoilers! Let's first add a rule that will tell the agent to show the defined screens once the user connects to Armory.
Go to ```Felix.drl``` and add the following:

```java title="rules/felix/Felix.drl"
rule "Welcome new user"
   when
       signal: UserConnected() from entry-point "signals"
       agent: Felix()
   then
       agent.showWelcomeScreens();
       delete(signal);
end
```

To make sure everything is in place, you can already run the code with `forge run` and click the link. Instead of the "Hello world!", you should now see the message from Felix and a button.

As always, feel free to customize the texts to your liking! Otherwise, we are ready for the next step.