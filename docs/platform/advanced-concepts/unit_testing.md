---
sidebar_position: 7
---

# Unit testing
Unit testing is a way to examine if small parts of your code work as intended.
These small parts, also called units, can work individually and independently when segregated from the rest of the code.

With writing a test for each of the separate units, you can quickly check if something isn't working as intended.

Mindsmiths Platform is providing a set of tools to help you write unit tests for your code.

## Writing unit tests for agents

### Migration guide for platform versions below `1.5.5`

If you are using a platform version below `1.5.5`, you'll need to add the following line to `services/rule_engine/pom.xml`:
```xml
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.0.0-M7</version>
        <configuration>
            <systemPropertyVariables>
                // highlight-added-line
                <projectSlug>YOUR_PROJECT_SLUG</projectSlug>
                <buildDirectory>${project.build.directory}</buildDirectory>
            </systemPropertyVariables>
        </configuration>      
    </plugin>
```
You can find the project slug in your `config.yaml` under `PROJECT_SLUG`.

Make sure you're using `rule-engine` version `5.0.8` or higher.

You'll also need to create the following file structure:
```
services/
└── rule_engine/
    └── src/
        └── main/
        // highlight-added-start
        └── test/
            └── java/
                └── TestMyAgent.java   // your test class
            └── resources/
                └── test.json        // you can put summary files here
        // highlight-added-end
```

### Getting started
To write a unit test for your agent, you'll need to create a test class which extends `AgentTest` class.

There's support for two types of tests: 
- from summary
- from agent and facts

### Test from summary
This type of test uses agent's summary as an input.

For this you'll need to create a `.json` file in the `test/resources` directory, for example:
```json title="test/resources/smith/test_heartbeat.json"
{
  "agentId": "SMITH",
  "facts": {
    "agents#Smith": {
      "SMITH": {
        "id": "SMITH",
        "connections": {},
        "type": "Smith"
      }
    }
  }
}
```
We recommend creating a subdirectory with your agent's name and putting the summary file there.

You can then create a test in `test/java`, for example:
```java title="test/java/TestSmithWithSummary.java"
import agents.Smith;
import com.mindsmiths.ruleEngine.testing.AgentTest;
import com.mindsmiths.ruleEngine.testing.AgentTestResult;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestSmithWithSummary extends AgentTest {

    @Test
    public void testHeartbeat() {
        AgentTestResult<Smith> result = runFromSummary("smith/test_heartbeat.json");
        assertTrue(result.getRulesFired().contains("Heartbeat"));
    }
}
```

### Test from agents and facts
This type of test uses instances of agent, facts and signals as inputs.

For example:
```java title="test/java/TestSmith.java"
import agents.Smith;
import com.mindsmiths.ruleEngine.testing.AgentTest;
import com.mindsmiths.ruleEngine.testing.AgentTestResult;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TestSmith extends AgentTest {

    @Test
    public void testAgentId() {
        assertEquals("SMITH", new Smith().getId());
    }

    @Test
    public void testHeartbeat() {
        AgentTestResult<Smith> result = run(new Smith(), List.of());
        assertTrue(result.getRulesFired().contains("Heartbeat"));
    }
}
```

### Test result
The`AgentTestResult` object has the following properties:
  - `Agent agent`
  - `List<Object> facts`
  - `List<String> rulesFired`

You can use asserts to verify the result of your test.
