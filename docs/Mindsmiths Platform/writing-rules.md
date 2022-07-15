---
sidebar_position: 7
---

# Writing rules
We use the [Drools framework](https://www.drools.org/) for defining and evaluating rules.


## Rule organization
Rules are written in `.drl` files, which are located in `rules/` (symlink to `services/rule_engine/src/main/resources/rules`).
Each agent must have its own package in this root folder, where you'll write rules specific to this agent.
Inside this package you can create additional subpackages to organize your DRL files.
Additionally, a single DRL file can contain multiple rules.
The ordering of rules is not important - they will all be evaluated.

You can also write a rule in the root package (`rules/`) which every agent will evaluate.


## Rule structure
All DRL files follow the same basic layout:
```java title="rules/agent/Example.drl"
package rules.agent;

import ...

rule "Rule name"
    when
        // these conditions are met
    then
        // execute these actions
end

...
```

The rule name gives a short description of what a rule does (e.g. "Send notification to user").
The `when` part of the rule is implemented in a special Drools language, while the `then` part is written in Java (with some Drools-specific constructs).

For example:
```java title="rules/customerAgent/CustomerAgent.drl"
package rules.customerAgent;

import ...

rule "Find available support agent"
    when
        Customer(needsHelp == true)
        SupportAgent(available == true)
    then
        Log.info("Found an available agent!");
end
```
This rule checks if there is a `Customer` who needs help, and a `SupportAgent` who is available.


## Rule mechanics
The rules for a particular agent are constantly being re-evaluated (checking if the `when` part is satisfied), and when the condition is satisfied the rule _fires_ (or is _triggered_), i.e. the `then` part is scheduled for execution.

The conditions that get evaluated in the `when` part of the rule work as a series of constraints or filters - we check if the current data in the _knowledge base_ meets some defined criteria.
There is an implicit `AND` operator between the lines with different conditions. You can also think of the `when` part as a query over the knowledge base.

### Assigning query results to variables

You can use a colon to assign results of these queries to variables which you can use in the `then` part. For example:
```java title="rules/customerAgent/CustomerAgent.drl"
package rules.customerAgent;

rule "Order completed"
    when
        order: Purchase(status == "COMPLETED") from entry-point "signals"
        agent: CustomerAgent(agentId: id, customerId == order.customerId)
    then
        Log.info(String.format("Customer %s (id=%s) made a new order (id=%s)!", agent.getName(), agentId, order.getId()));
end
```
The code in `agent: CustomerAgent(agentId: id, ...)` assigns the value of the Agent's `id` field to the variable `agentId`, and the whole `CustomerAgent` object to the `agent` variable.
We assigned `id` to `agentId` for illustrative purposes, but you can use `agent.getId()` as well.


### Working with the knowledge base
The `when` part queries the knowledge base, but how does anything end up in the knowledge base?

There are three mechanisms that influence this:
1. There is always an instance of the current agent in the knowledge base - (`CustomerAgent` in the examples above)
2. When a signal is sent to the agent, it is inserted in the knowledge base, under the entry point "signals" (see Facts and Signals TODO)
3. You can `insert`, `modify`, and `delete` data from the knowledge base from the rules

Consider the following example:
```java title="rules/customerAgent/CustomerAgent.drl"
package rules.customerAgent;

rule "Insert data"
    when
        signal: PurchaseStart() from entry-point "signals"
        not(Purchase())  // there are no orders
    then
        Log.info("Inserting data");
        insert(new Purchase("order_id", "STARTED"));
        delete(signal);
end

rule "Remove completed orders"
    when
        order: Purchase(status == "COMPLETED")
        agent: CustomerAgent()
    then
        Log.info("Removing order " + order.getId());
        modify(agent) {setCompletedAtLeastOnePurchase(true)};
        delete(order);
end

rule "Notify customer new product is available"
    when
        product: NewProduct() from entry-point "signals"
        agent: CustomerAgent(completedAtLeastOnePurchase == true)
    then
        agent.sendMessage("Hey, I have a new product for you: " + product.getName() + ". Interested?");
end
```
The output of this example would be:
```
Inserting data
Removing order order_id
```
After some time, when another service or agent sends the `NewProduct` signal to this agent, the third rule would also
fire and the agent would send a message to the user. To learn more about sending signals to other agents see "Sending signals" (TODO).

### Modify
As you can see, inserting and deleting facts from the knowledge base is pretty straightforward, but what's up with the `modify` thingy?

Another way to write the same thing without using modify would just be:
```java
agent.setCompletedAtLeastOnePurchase(true);
```
So why did we use modify instead?

The answer lies in the way the rule engine works.
It uses a highly optimized Phreak algorithm in rule evaluation, which determines which rules should be evaluated at runtime.
The `modify` keyword tells the rule engine that the agent changed, which means any rules that use it in the `when` condition should be re-evaluated.
It even goes a step further and re-evaluates only those rules that could be impacted by the change of the specific field that changed (`completedAtLeastOnePurchase`).

In other words, whenever you're changing an object, you should *always* use `modify` instead of the setter directly.


## Facts and signals
There are two types of objects that can be queried from the knowledge base: facts and signals.

Facts are persistent, while signals are not. Facts are objects that the agent chooses to remember.
Signals can be sent by other services and agents, which the current agent can choose to react to or ignore.

As already mentioned, the only fact that is present in the beginning is the object of the current agent.

Even though signals are discarded by default after the current evaluation cycle ends, you can store them with `insert` and afterward use them in another rule as a fact. For example:
```java title="rules/customerAgent/CustomerAgent.drl"
rule "Store user orders"
    when
        order : Order() from entry-point "signals"
    then
        insert(order);
end

rule "Finish order"
    when
        finishSignal: FinishOrder(orderId: orderId) from entry-point "signals"
        
        order: Order(id == orderId)  // it's now a fact
        agent: CustomerAgent()
    then
        agent.sendOrder(order);
        delete(order);
        delete(finishSignal);
end
```
Notice that signals are always received on specific entry points (the default one is "signals").


## Heartbeat
There is one special signal that is generated periodically and sent to every agent - the _heartbeat_ signal.

This signal is what makes the agents "alive". Just like any signal, it triggers the re-evaluation of all rules.
This enables the agent to be proactive, instead of waiting to be "turned on".

With the heartbeat you'll often use [time-based conditions](https://access.redhat.com/documentation/en-us/red_hat_decision_manager/7.4/html/decision_engine_in_red_hat_decision_manager/cep-con_decision-engine).
Let's look at an example:
```java title="rules/customerAgent/CustomerAgent.drl"
rule "Store user orders"
    when
        Order() from entry-point "signals"
        agent: CustomerAgent()
    then
        modify(agent) {setLastOrderAt(new Date())};
end

rule "Re-engage inactive customer"
    when
        Heartbeat(now: timestamp) from entry-point "signals"
        
        agent: CustomerAgent(lastOrderAt before[60d] now, reengageAttempted != true)
    then
        agent.sendMessage("Hey! It's been a while 😊 Is there anything I can help you with?");
        modify(agent) {setReengageAttempted(true)};
end
```
With the first rule, we just save the last order time.
With the second rule, we get the current datetime from the heartbeat signal, and check that the last order was more than 60 days ago.

A very important thing to note here is that rules can fire at any time, and even multiple times.
This means it's easy to get stuck in an infinite loop accidentally, even though the platform offers some safeguards against it.

That's why we use the `reengageAttempted` flag. It will prevent the rule from re-firing on every heartbeat and spamming the user with messages until they make a new order and change the condition for `lastOrderAt`.
The flag acts as a "stopping mechanism" - a way of making sure the conditions of a rule will no longer be met at some point.
It sounds like an inconvenience, but being agnostic of the actions that led up to the current state is actually a desirable feature in many situations (see Rule chaining TODO).


## Handling edge cases
Sometimes you may want to override a certain rule in a particular situation.
For example, let's say that you want a human to verify all orders above a certain amount.
This can be implemented as follows:
```java title="rules/customerAgent/CustomerAgent.drl"
rule "Process order"
    when
        order: Order() from entry-point "signals"
        agent: CustomerAgent()
    then
        agent.processOrder(order);
end

rule "Verify high-value orders"
    salience 100
    when
        order: Order(value > 4000) from entry-point "signals"
        agent: CustomerAgent()
    then
        agent.sendToVerification(order);
        delete(order);
end
```
The second rule defines a salience (priority) of 100, which is higher than the default (0), which means this rule is evaluated and executed before the first one.
Additionally, it removes the order signal, which prevents the first rule from firing.
This is why we generally recommend deleting signals despite them being discarded at the end of the evaluation cycle.

The same mechanism can be used to implement a "catch-all" fallback rule. For example:
```java title="rules/customerAgent/CustomerAgent.drl"
rule "Complete order"
    when
        message: TelegramReceivedMessage(text.equalsIgnoreCase("buy")) from entry-point "signals"
        agent: CustomerAgent()
    then
        agent.completeOrder();
        delete(message);
end

rule "Unrecognized message"
    salience -1
    when
        message: TelegramReceivedMessage() from entry-point "signals"
        agent: CustomerAgent()
    then
        agent.sendMessage("Sorry, didn't understand that :/");
        delete(message);
end
```


## Rule chaining
TODO: find some example
- It's difficult to see the advantages of rule engines looking just at single simple rules: their true power is most obvious interactions of the rules when handling more complex behaviours.
- As already mentioned, the order of execution of rules is not pre-imposed and whenever the facts in the knowledge base change, rules are re-evaluated.
- Therefore, although rules are in principle independent of each other, they can indirectly depend on each other in terms of the outcome of one rule bringing about triggering of another. For example, it's relatively frequent that a rule modifies a fact in memory, and another rule detects when the fact has that specific value. This is called **rule chaining**.
- Thinking of the road-crossing situation (TODO: link), rule chaining comes in handy for breaking down a complex reasoning process into a series of circumstances that need to be evaluated and whose outcomes accumulate to ultimately make the final decision whether to cross a simple one.
- It's generally advisable to try and break down the reasoning in as many steps as possible and have the sum of their outputs caught by another rule.
- Moreover, multiple rules could fire at once given some situation in the data. In this case, priority is determined using the **salience** parameter.
- The mechanism is very simple: rules with higher salience have priority over the ones with lower salience, so you can think of it as a way of imposing order of execution on rules triggered by similar conditions.
- Should the conditions for the other rules still be met afterwards, the other rule can still subsequently execute. 
- The default salience of a rule is 0, and you can also set it to a negative value. This is useful for writing "catch-all" rules, e.g. ones making sure no message from the user goes unprocessed should it trigger no other rules.

## Best practices
- The writing of rules can be slightly confusing before you get used to it, so we'll quickly summarize some good practices for rule writing.
- To improve flexibility, extendability and maintainability of the rule engine, the rules should be as simple as possible and only contain the minimal information necessary. This will also help you with rule atomicity and independence, which are desirable features.
- Use rule chaining and transparent variable naming to improve rule readability and back-tracking in how a decision was reached. Ideally, your rules should be perfectly readable to non-developers as well. Same goes for rule names: write as clearly as possible what the rule does even if it makes the rule name slightly lengthy.
- Avoid writing rules that say "condition1 or condition2 or condition3": it's better to break these down into separate rules with the same `then` part, or that have an outcome which triggers another rule that executes the desired action.
- Avoid having any if-else logic in the rules: it's more efficient to break these cases down into separate rules.
- We already mentioned that signals are not persisted between evaluation cycles, but it's good practice to still delete them once you are done processing them to avoid any unwanted behaviours as your system grows.


## Advantages of rule engines: simplification, flexibility, readability
TODO: find a better title
- The structure of rule engines enables you to break down highly complex scenarios into sets of very simple conditions and spares you the trouble of foreseeing all specific circumstances under which certain events might occur.
- The rules themselves are written using declarative programming. This gives you much more freedom in how you structure the logic, because the rules that fire in evaluations are determined by the data.
- The declarative programming paradigm allows you to express a piece of logic without explicitly specifying the flow of execution: the order of execution governed _only_ by the conditions the rules declare.
- Each rule should be as simple as possible: they should be independent of each other, highly separable and only contain the minimal information necessary. 
- This makes rules more easily maintainable and the system more easily extendable.
- Moreover, together with the fact that rules are written in a sort of a "meta-language", this makes rules easy to read for people of different backgrounds.
