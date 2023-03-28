---
sidebar_position: 7
---

# Unit testing
Unit testing is a way to examine if small parts of your code work as intended.
These small parts, also called units, can work individually and independently when segregated from the rest of the code.

With writing a test for each of the separate units, you can quickly check if something isn't working as intended.

Mindsmiths Platform is providing a set of tools to help you write unit tests for your code.

## Writing unit tests

You'll need to set up your project for unit tests:
  1. create a `test` directory in your project
     - this is how the path to the test directory should look like `services/rule_engine/src/test`

  2. when in the `test` directory, you'll have to create your test classes
     - each test class needs to extend the `AgentTest class` 
     - also, every test function should be annotated with `@Test`

There's support for two types of tests: 
- from summary
- from agent and facts

### Test from summary
This type of test uses agent summary as an input.

For this you'll need to create a `.json` file in the `resources` directory and use `runFromSummary` function with the belonging signature:

```java
    public AgentTestResult runFromSummary(String path, Optional[List<Pair<Object, String>> signals]);
```

Here below you can see an example of creating a function which serves as a test from summary.
```java
package test;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import com.mindsmiths.ruleEngine.testing.AgentTest;
import com.mindsmiths.ruleEngine.testing.AgentTestResult;

import agents.Customer;

public class TestAgentIdNotNull extends AgentTest {
    
    @Test
    public void testAgentIdNotNull() {
        String path = "test.json";
        AgentTestResult<Customer> result = runFromSummary(path);
        assertNotNull(result.getAgent().getId());
    }
}
```

### Test from agents and facts
This type of test uses agents and facts as an input and for this we'll use `run` function.
```java
    public AgentTestResult run(T agent, List<Pair<Object, String>> signals, Optional[List<Object> facts]);
```

An example of creating a function which serves as a test from agent and facts:
```java
package test;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.mindsmiths.ruleEngine.testing.AgentTest;
import com.mindsmiths.ruleEngine.testing.AgentTestResult;

import agents.Customer;

import java.util.List;

public class TestCustomerIsActive extends AgentTest {

    @Test
    public void testCustomerIsActive() {
        Customer myAgent = new Customer();
        AgentTestResult<Customer> result = run(myAgent, List.of());
        assertFalse(result.getAgent().isActive());
    }
}
```

- `AgentTestResult` object has the following properties:
  - `T agent`
  - `List<Object> facts`
  - `List<String> rulesFired`

You can utilize these properties when using `assert` functions like `assertFalse`, `assertNotNull`, etc.

## Migration guide for all `forge-sdk` versions below `1.5.8`

If you are using `forge-sdk` version below `1.5.8`, you'lll need to add the following line to `pom.xml`:

```xml
    ...
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.0.0-M7</version>
            <configuration>
                <systemPropertyVariables>
                    ****<projectSlug>YOUR_PROJECT_SLUG</projectSlug>****
                    <buildDirectory>${project.build.directory}</buildDirectory>
                </systemPropertyVariables>
            </configuration>      
        </plugin>
    ...
```
