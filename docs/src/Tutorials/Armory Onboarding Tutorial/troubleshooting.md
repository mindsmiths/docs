---
sidebar_position: 8
---

# Troubleshooting

We've gathered some of the most common issues that can occur while setting up Armory to your project. 
Here's how to handle them: 
1. Check that your ```Runner.java``` reads configuration from ```signals.yaml```. It should look something like this:
```java title="java/Runner.java"
public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        configureSignals(getClass().getResourceAsStream("config/signals.yaml"));
        ...
    }
    ...
}
```

If not, add ```configureSignals(getClass().getResourceAsStream("config/signals.yaml"));``` in ```initialize()```.
