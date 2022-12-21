---
sidebar_position: 2
---

# Meet agent Smith

### Agent Smith - developer's super helper

Agent Smith is here to help you get started with development on the Forge.
For a start, we’ll use Smith to showcase some basic concepts you need to know about our agents and our rule engine.

There are two core components of agents: **rules** and **models**. You can see the directories of the same name pinned in the tree on the left.

The **rules** directory contains all the logic shaping the behavior of your agents. The **models** directory contains java classes for storing the relevant facts on which the rules can reason. It also contains Runner.java, but we’ll get into that later.
First, let’s look at an example of a rule in `rules/smith/Heartbeat.drl`:

```java title="/rules/smith/Heartbeat.drl"
package rules.smith;

import com.mindsmiths.ruleEngine.model.Heartbeat;
import com.mindsmiths.ruleEngine.util.Log;
import com.mindsmiths.ruleEngine.util.Agents;

rule "Smith's Heartbeat"
    when
        Heartbeat() from entry-point "signals"
    then
        Log.info("Smith's heartbeat - num agents: " + Agents.getCount());
end
```

The **rule engine** is an expert-system service that efficiently evaluates rules implemented using the [Drools](https://www.drools.org/) framework. It enables you to quickly prototype any business logic or expert knowledge you want to work into your system.


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

Rules are based on declarative programming. This gives you much more freedom in how you structure the logic, because the rules that get triggered are determined by the data. The `when` part of the rule is implemented purely in Drools, while the then part is written in Java, except for a couple Drools functions we will introduce later on (`insert`, `modify`, `delete`).


So let’s look into what’s going on in this very basic rule! 
It says the following: 
* whenever there is a signal (Heartbeat) for an agent of some type (here Smith), 
* log the info on the number of currently active agents.


**A heartbeat** is just a mechanism for periodical evaluation of facts about an agent. It’s used for constant monitoring of the current situation in the system and taking proactive and independent actions.
Notice that all the rules referring specifically to the agent of type Smith are located in the smith subdirectory. Only those rules are evaluated when evaluating Smith. This applies to other agents as well, so make sure to watch out for this.
You can also see the agent’s class, i.e. the agent’s data model, that’s defined in `models/agents/Smith.java`:


<!----  https://github.com/facebook/docusaurus/issues/3318 ---->

```java title="models/agents/Smith.java"
package agents;

import com.mindsmiths.ruleEngine.model.Agent;

public class Smith extends Agent {
    public static String ID = "SMITH";

    public Smith() {
        id = ID;
    }
}
```

Since Smith is a special type of agent and there will always be only one `Smith`, we’ve set his `id` to a constant (`"SMITH"`).


Ok, those are the basics. You are ready to start with the real deal - building your own agent.
