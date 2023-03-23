---
sidebar_position: 7
---

# Unit testing
- Unit testing is a way to test your code in isolation, without having to run the whole application.
- It is a great way to make sure that your code is working as expected.
- Mindsmiths Platform provides a set of tools to help you write unit tests for your code.

## Writing unit tests
- First of all, you will need to setup your project to use unit tests.
- To do that, you will need to create a `test` directory in your project (services/rule_engine/src).
 ![](/images/unit_testing/project_structure.png)
- Inside the `test` directory, you create your test classes.
- Each test class needs to extend the  `AgentTest class` and annotate each test function with `@Test` annotation.
- We support two types of tests: from summary or from agent and facts.

### Test from summary
- This type of test uses agent summary as an input.
- For this you will need to create a `.json` file in the `resources` directory.
- For this type of test we use `runFromSummary` function.
- Here is sample code
![](/images/unit_testing/summary_test_sample.png)

### Test from agent and facts
- This type of test uses agent and facts as an input.
- For this type of test we use `run` function.
- Here is sample code
![](/images/unit_testing/agent_test_sample.png)

## AgentTest functions
- `runFromSummary(String path, Optional[List<Pair<Object, String>> signals])`
- `run(T agent, List<Pair<Object, String>> signals, Optional[List<Object> facts])`
- Both of these functions return AgentTestResult object.
- AgentTestResult object has the following properties:
  - T agent
  - T agentBefore
  - List<Object> facts
  - List<Object> factsBefore
  - List<String> rulesFired
- You can use these properties to assert your test results.

## MIGRATION GUIDE FOR ALL FORGE-SDK VERSIONS BELOW 1.5.8
- If you are using forge-sdk version below 1.5.8, you will need to add the following to pom.xml
- `<projectSlug>YOUR_PROJECT_SLUG</projectSlug>`
![](/images/unit_testing/project_slug.png)

## ERRORS

### projectSlug is not set...
- Follow migration guide instructions above.