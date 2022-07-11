---
sidebar_position: 7
---

# Writing rules
We use the [Drools framework](https://www.drools.org/) for defining and evaluating rules.


All rules follow the same basic syntax:
```java
rule "Rule name"
    when
        // highlight-next-line
        // these conditions are met
    then
        // highlight-next-line
        // execute these actions
end
```

Rules are based on declarative programming. This gives you much more freedom in how you structure the logic, because the rules that get triggered are determined by the data.
The `when` part of the rule is implemented purely in Drools, while the then part is written in Java, except for a couple Drools functions we will introduce later on (`insert`, `modify`, `delete`).


## Rule mechanics
Each rule recognizes a specific situation (when) and does some action (then - usually triggering a procedure or modifying the knowledge base).
The knowledge base defines a set of "facts" that we reason with. In the beginning it contains only the agent...

TODO: https://git.mindsmiths.com/mindsmiths/platform/-/wikis/Using-the-Platform/Writing-rules

## Signals and facts


## Chaining rules