---
sidebar_position: 7
---
# Going places

You can also redirect the user to another location through a link on an Armory screen.
For example, after we finish the onboarding process, we can redirect the user to the company website.
Add the following to the `.java` file:

```java title="rule_engine/src/main/java/agents/Nola.java"
...
@Data
@NoArgsConstructor
public class Nola extends Agent {
    ...
    public void redirect(String redirectUrl) {
        ArmoryAPI.redirect(getConnection("armory"), redirectUrl);
    }
    ...
}

```

You can switch out our example screen for a rule that redirects the user to the company website:

```java title="rule_engine/src/main/resources/rules/nola/Nola.drl"
    ...
rule "Redirect user to Mindsmiths website"
    when
        Heartbeat() from entry-point "signals"
        agent: Nola(onboardingStage == "onboarded")
    then
        agent.redirect("https://www.mindsmiths.com/");
end
```
That's it, `forge run` and you're ready for building screens and creating flows. Have fun!