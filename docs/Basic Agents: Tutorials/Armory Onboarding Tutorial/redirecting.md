---
sidebar_position: 7
---
# Redirecting users to other locations

You can also redirect the user to another location through some action on an Armory screen.
For example, after we finish the onboarding process, we can redirect the user to the company website.
Add the following to the `java` file:

```java title="rule_engine/src/main/java/agents/Mindy.java"
...
@Data
@NoArgsConstructor
public class Mindy extends Agent {
    ...
    public void redirect(String redirectUrl) {
        ArmoryAPI.redirect(getConnection("armory"), redirectUrl);
    }
    ...
}

```

You can switch out our "Thank you" screen for a rule that redirects the user to the company website:

```java title="rule_engine/src/main/resources/rules/mindy/Mindy.drl"
    ...
rule "Redirect user to Mindsmiths website after onboarding"
    when
        Heartbeat() from entry-point "signals"
        agent: Mindy(onboardingStage == "onboarded")
    then
        agent.redirect("https://www.mindsmiths.com/");
end
```

That's it! You now have all the tools you need to start building screens and creating web-app experiences for your users.