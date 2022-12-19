---
sidebar_position: 2
---

# Adding Armory to your project

Let's start by add Armory as a new service to your project:
1. First, install Armory by running ```pip install armory~=5.0.0b0``` in the Terminal
2. Next, run the ```armory-admin setup``` command, to integrate Armory into the project. 

This command will prompt you to:
* Choose the agent handling signals coming from Armory
* Provide the Armory site URL, which you'll use to access Armory

We'll name our agent Felix. In case you choose a different name, make sure to keep it consistent throughout the tutorial.
As for the URL, you just use your environment URL (e.g. http://workspace-ms-XXXXXXXXXX.sandbox.mindsmiths.io) with the `XXXXXXXXXX` being the digits you have in your web IDE link. 
The URL will automatically be saved in your `.env` file, where you can find it at any moment.

This is what adding armory looks like in the Terminal:

```console
root:/app$ armory-admin setup
What agent will handle signals? Felix
URL of your IDE (leave empty if running locally): 
http://8000.workspace-ms-0000000000.sandbox.mindsmiths.io
Service successfully integrated into the project.
```

Armory will now run on:
```http://8000.workspace-ms-0000000000.sandbox.mindsmiths.io```

3. Check that your ```Runner.java``` reads configuration from ```signals.yaml```. It should look like this:

```java title="src/main/java/Runner.java"

public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        configureSignals(getClass().getResourceAsStream("config/signals.yaml"));
        ...
    }
    ...
}
```

Otherwise, add `configureSignals(getClass().getResourceAsStream("config/signals.yaml"));` in `initialize()`.


4. Finally, run ```forge init``` to make sure all dependencies are in place. 

Congratulations, you can now use Armory in your project! Let's find out how we can actually use it and make an awesome onboarding flow.