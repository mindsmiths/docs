---
sidebar_position: 3
---

# Sharing objects between agents

Sometimes you'll find yourself in a situation where you want to make some facts available to all agents.
Here, we'll show you best practices in doing that, and how to avoid pitfalls.

For example, you might work on a project in retail and want to make `Product` objects available to all agents.
There are 2 options:

1. Have all `Product` objects inserted in the knowledge-base of all agents that might need them.

2. Have a central storage of `Product` objects, and have all agents reference them.


Approach 1 is the most common, but it has a few drawbacks:

- It's not very efficient, as you'll have to send the same `Product` object to all agents.
This can be a lot of data.
- It's not very scalable, as you'll have to send the same `Product` object to all agents.
This can be very expensive to process when you have a lot of agents.

The benefit of this approach is that it follows the standard agent-based data storage strategy,
which makes every agent the owner of all data relevant to them.
It also allows the agents to be proactive based on the data changes because they will be processing
all incoming signals themselves.


Approach 2 is a bit more complex, but it has some advantages:

- It's very efficient and scalable, as you'll only have to send and store the `Product` object once.
- It reduces the amount of code needed for handling the `Product` objects.

The downside of this approach is that it doesn't allow the agents to be proactive based on the 
data changes (unless you implement that yourself),
and agents aren't allowed to change the `Product` object themselves.

Here, we'll show you how to implement approach 2.

## Storing data in a shared database collection

Let's say we have a `Product` class whose objects we want to make available to all agents.

```java
// Product.java
// ...
@DataModel
public class Product implements Serializable {
    private String id;
    private String name;
    private Double price;
    // ...
}
```

The simplest solution is to have rule engine auto-update a shared database collection 
whenever a `Product` object is created, updated or deleted.
```java
// Runner.java
// ...
public class Runner extends RuleEngineService {
    public void initialize() {
        // ...
        registerForChanges(Product.class);
        // ...
    }
}
```

Now, when we want to make the `Product` objects available to our agent through an entry-point.
```java
// ProductImport.drl
// ...
rule "Insert products"
    salience 10000 // high salience to make sure this rule is executed first
    when
    then
        for (Product product : Database.all(Product.class)) {
            drools.getEntryPoint("signals").insert(product);
        }
end
```

Finally, we can access the `Product` objects in that same agent.
```java
// MyRule.drl
// ...
rule "My rule"
    when
        product: Product() from entry-point "signals"
    then
        // ...
end
```

And that's it!

## Keeping proactivity through the use of a central agent

To support proactivity on `Product` change, we configure our signal so it sends any `Product` changes
to our agent `ProductManager`. This will make any `Product` changes available to the `ProductManager` agent.

```java
// Runner.java
// ...
public class Runner extends RuleEngineService {
    public void initialize() {
        // ...
        configureSignals(
            // ...
            DataChanges.on(Product.class).sendTo("ProductManager")
        );
        // ...
    }
}
```

Now, we save the product changes in a shared database collection.

```java
// ProductManagement.drl
import com.mindsmiths.sdk.core.db.Database;
// ...
rule "Save product changes in shared database collection"
    when
        product: Product() from entry-point "signals"
        DataChangeType(this != DELETED) from entry-point "signals"
    then
        Database.save(product);
        // custom logic that supports proactivity
        delete(product);
end

rule "Delete product in shared database collection"
    when
        product: Product() from entry-point "signals"
        DataChangeType(this == DELETED) from entry-point "signals"
    then
        Database.delete(product);
        // custom logic that supports proactivity
        delete(product);
end
```