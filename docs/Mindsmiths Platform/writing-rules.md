---
sidebar_position: 7
---

# Writing rules
We use the [Drools framework](https://www.drools.org/) for defining and evaluating rules.

- All rule files (ending in `.drl` extension) follow the same basic layout:
```java title="rules/agent/Example.drl"
package <path.to.current.directory>;

import ...

rule "Rule name"
    when
        // these conditions are met
    then
        // execute these actions
end
```

The rule name gives a short description of what a rule does (e.g. "Send notification to user"). The rules can be specified in any order and can be distributed in any number of files 
The `when` part of the rule is implemented purely in Drools, while the `then` part is written in Java, except for a couple Drools functions we will introduce later on (`insert`, `modify`, `delete`).

## Advantages of rule engines: simplification, flexibility, readability
TODO: find a better title
- The structure of rule engines enables you to break down highly complex scenarios into sets of very simple conditions and spares you the trouble of foreseeing all specific circumstances under which certain events might occur.
- The rules themselves are written using declarative programming. This gives you much more freedom in how you structure the logic, because the rules that fire in evaluations are determined by the data.
- The declarative programming paradigm allows you to express a piece of logic without explicitly specifying the flow of execution: the order of execution governed _only_ by the conditions the rules declare.
- Each rule should be as simple as possible: they should be independent of each other, highly separable and only contain the minimal information necessary. 
- This makes rules more easily maintainable and the system more easily extendable.
- Moreover, together with the fact that rules are written in a sort of a "meta-language", this makes rules easy to read for people of different backgrounds.

## Rule mechanics
- The reasoning in the rule engine goes on via what we call **rule evaluation**.
- The conditions that get evaluated in the `when` part of the rule basically function as a constraint or filter: we check if the current data meet some defined criteria. There is an implicit `AND` operator between the lines with different conditions, so the `when` part basically implements a query.
- When such a situation is identified, some action in the `then` part is scheduled to be executed. Whether that will actually happen also depends on some other factors (see Rule chaining below).
- Since the rule conditions work as a filter, everything used in `then` part should be referenced and assigned to a variable beforehand in the `when` part to make sure it exists.
- Variable assignment is done using a colon: the expression `Agent(agentId: id)` assigns the value of the Agent's `id` field to variable name `agentId`, and can as such be used later on in the `then` part of the rule.
- Another way to access the agent's id would be to reference the agent instead `agent: Agent()` and then use the Java getter method in the `then` part: `agent.getId()`.
- Let's look at an example to make these points slightly clearer:
```java title="rules/agent/Agent.drl"
package rules.agent;

rule "Register active customers"
    when
        agent: CustomerAgent(agentId: id, active != true)
        OngoingPurchaseProcess(customerId == agentId)
    then
        modify(agent) {setActive(true)};
end
```
- As you can probably see for yourself, this rule registers if a customer is currently in the process of purchasing something. We create a reference to the customer's agent to be able to modify the value of one of its fields in the `then` part, and we assign its id to a variable to fetch the `OngoingPurchaseProcess()` for that customer in specific. (TODO remove this part? and also think of a better example)
- The rule reads as follows: when there is a `CustomerAgent()` who is currently not flagged as `active` but there is an `OngoingPurchaseProcess()` object whose `customerId` matches the agent's, set the agent's `active` flag to `true`.
- Apart from turning your attention to how the filtering syntax looks like in the Drools syntax, a very important thing to note here is that the rule engine has no way of knowing if some rule has already fired or not: that's why you need a "stopping mechanism" - a way of making sure the conditions of a rule will at some point no longer be met to prevent infinite loops.
- It sounds like an inconvenience, but the engine being agnostic of the actions that led up to the current state is actually in many situations a desireable feature (see Rule chaining TODO).
- Among other things, this means that the control over rules firing is neither determined by the order of the rules nor by the order of the incoming data, but by the conditions the rules declare. 
- Therefore, you can write any number of rules in whichever order you want and distributed over any number of files - just make sure they are all in the correct location (TODO see Creating agents).


- In short, during an evaluation cycle, a rule can recognize that a specific situation has occurred (`when`) and perform some action (`then` - usually triggering some series of procedures or modifying the knowledge base).
- The Drools rule engine uses the highly optimized Phreak algorithm (based on the Rete algorithm) in rule evaluation, and the sequence flow is determined by the engine at runtime.
- These evaluation cycles can happen periodically at a specific rate (see Heartbeat TODO: link). Alternatively they can be triggered by certain signals or updates to the knowledge base.

## Rule reasoning: Signals and facts
- While **signals** are not persisted in memory between evaluation cycles, the **knowledge base** contains "facts" persisted in memory on which we do the reasoning. 
- Rules are evaluated per agent (see Creating agents TODO: link), and by default, the only entity present in the knowledge base at the very beginning is the agent itself.
- You update the knowledge base using special reserved Drools keywords `insert`, `modify` and `delete`.
- For instance, although signals are by default discarded once they are processed, you can store them permanently by using `insert` and use it in another rule as a fact: (TODO: think of better examples)
```java title="rules/agent/Agent.drl"
rule "Store user orders"
    when
        order : Order() from entry-point "signals"
        agent: CustomerAgent()
    then
        insert(order);
end

rule "Update active order"
    when
        agent: CustomerAgent()
        order: Order(active == true, processed != true)
    then
        modify(order) {setProcessed(false)};
end
```
- Notice that signals are received by the Rule Engine from specific entry points (the default one is "signals"), while there is no entry point for retrieving facts stored in the knowledge base.
- You can also build custom objects on the fly in the `then` part, e.g. `insert(new Purchase(itemList));`.
- Once the object is in the knowledge base, you can of course modify (see example above) or delete it. Note that even though signals are not persisted after the triggered evaluation cycle is complete, we still recommend deleting them in the `then` part of the rule in which you process it once you no longer need them (see Rule chaining below).
- You can think of the `modify` function as the equivalent of Java setter method. However, if you just use a regular setter, your changes won't be persisted outside the current evaluation cycle.
- Another big group of conditions are [time-based conditions](https://access.redhat.com/documentation/en-us/red_hat_decision_manager/7.4/html/decision_engine_in_red_hat_decision_manager/cep-con_decision-engine). They closely relate to proactivity and the Heartbeat service (TODO: link). Let's look at an example:
```java title="rules/agent/Agent.drl"
rule "Re-engage inactive"
    when
        Heartbeat(ts: timestamp) from entry-point "signals"
        agent: CustomerAgent(lastActivity before[60d] ts, reengageAttempted != true)
    then
        agent.sendMessage("Hey! It's been a while 😊 Is there anything I can help you with?");
        modify(agent) {setReengageAttempted(true)};
end
```
- What's happening here is very simple: we read off the timestamp from the latest Heartbeat signal that was sent for that agent and compare to the customer's last recorded activity. If more than 60 days have passed between those two timestamps, we send the user a message to try to engage them.
- We also set the `reengageAttempted` flag to true to prevent the rule from re-firing until the user responds and potentially sets a new value for the `lastActivity` timestamp.

## Chaining rules
- salience
- Whenever the facts in the knowledge base change, rules are re-evaluated. This enables us to reason in "steps"
- order of execution not pre-supposed
- thinking of single rules: not so obvious what the advantages are
- Main strength comes from interactions, but each rule should be able to detect a particular set of circumstances and act upon it without needing anything other than the data of its domain
However, sometimes rules do depend on others in an indirect way. The assumptions we make on one rule can be used in the conditions of another one. These data creations, through assumptions that a Business Rule engine can make, are called inferences and they are of great use to extend the usability of our rules.
3. Rule chaining
simple rules!!, atomicity, rule simplicity allows for back-tracking when decisions are made + easy to read!!
- For example, let's say we want to send an alert to an office manager when a supply of something is running low. The conditions could be:
  - the paper supply is running low
  - it's working hours on a work day (because the notification is not of high priority)
  - the person hasn't already been notified of this situation
- Ideally, the code of the rule we produce should be as simple to read as this bullet points are, and we always break down the reasoning in as many steps as we can. 
- For instance, we can have separate rules setting flags for whether this is an appropriate time to contact the user (it's working hours, and the person is in office). 
- Inputs from these different rules are combined through a single rule via rule chaining.

## Best practices
- simple: minimal set of conditions met + atomicity (separability for ease of maintenance)
- put effort into readability
- avoid making rules that say this or that or that - break down into separate rules with the same then part, or that give an outcome that then triggers another rule that executes this action
- avoid having any if-else logic in the rules - more efficient to break down into separate rules