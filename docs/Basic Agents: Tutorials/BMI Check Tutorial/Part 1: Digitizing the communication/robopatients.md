---
sidebar_position: 8
---

# Bonus feature: RoboPatients

As an optional step, you can add in another type of agent: the RoboPatient agent.
This type of agent will handle fake patient users that we’ll use to mock real user activity and simulate the kind of workload a doctor would normally be handling.

Introducing RoboPatients will also help us simulate the accumulation of data over time for model learning: 
by controlling the distribution of the artificially generated data, we make sure our coverage is good enough to approximate the actual BMI function. 

We simulate fake user activity with the `robo-patient` service you can already find in the project. 
While the platform is running, open a separate Terminal and run:
```console
forge run-service robo-patient
```
This will create a number of fake users that will send BMI requests to the doctor that are randomly generated from some value range (`normalWeightRange`) they've been assigned on creation.
You can control the number of RoboPatients you want to create by changing the value of the `NUM_PATIENTS` variable for the `robo-patient` service in the `config.yaml` file. 

When a new fake user is created, a new RoboPatient agent is created for it. This agent's role is similar as the real Patient agent's, in as much as it forwards the BMI requests to the Doctor agent. You can check out what the code looks like in `java/agents/roboPatient.java`.

We just need to add the rules for that agent, so go ahead and create the `roboPatient` directory in `rules` and add a `RoboPatient.drl` file. Now let's think about what our RoboPatient agent should be capable of in comparison to the Patient agent: 
 there is obviously no need for onboarding or re-engagement, and there is no need to send the actual doctor's responses back to the fake user requesting them.

So, we'll just create the rules for registering new fake patients in the system and sending the BMI requests to the Doctor. 
We'll also include the rule for processing the received Doctor replies, but the `sendMessage()` function will only log that a reply was received instead of forwarding it to the fake patient:

```java title="rules/roboPatient/RoboPatient.drl"
package rules.roboPatient

import com.mindsmiths.ruleEngine.model.Initialize
import com.mindsmiths.ruleEngine.util.Log
import com.mindsmiths.telegramAdapter.TelegramReceivedMessage

import agents.doctor.Doctor
import agents.roboPatient.RoboPatient
import signals.BMIMeasurement
import signals.BMIResponse
import utils.BMIUtils


rule "Register robopatient created"
    salience 100
    when
        initialize: Initialize() from entry-point "agent-created"
        message: TelegramReceivedMessage(text: text, !BMIUtils.isValidWeight(text)) from entry-point "signals"
        roboPatient: RoboPatient()
    then
        Log.info("Created a robot patient with id " + roboPatient.getId());
        roboPatient.sendMessage("Welcome, " + roboPatient.getId());
        delete(initialize);
        delete(message);
end

rule "Process weight"
    when
        message: TelegramReceivedMessage(text: text, BMIUtils.isValidWeight(text)) from entry-point "signals"
        roboPatient: RoboPatient()
    then
        double weight = Double.parseDouble(text);
        BMIMeasurement bmiMeasurement = new BMIMeasurement(roboPatient.getAge(), weight, roboPatient.getHeight());
        roboPatient.send(Doctor.ID, bmiMeasurement);
        delete(message);
end

rule "BMI request answered"
    when
        response: BMIResponse(req: request) from entry-point "signals"
        roboPatient: RoboPatient()
    then
        String text = String.format(
                                      "Child with weight (%.1f kg) is %s",
                                      req.getWeight(), response.isObese() ? "obese" : "not obese"
                                  );
        roboPatient.sendMessage(text);
        delete(response);
end
```

Cool! Now let’s try running the code. 
Start up the system with **forge run** and send a message on Telegram to register as a doctor. After that, go to a separate Terminal and run robopatients with the `run-service` command.

Good luck finding your way through floods of requests! Don't worry, we'll add more functionalities to your Doctor agent to help you manage it in the subsequent lessons 😊

You can stop both the platform run and the robopatient simulation by pressing `CTRL+C` in the Terminal. 
Remember that this is an optional feature and you don't really have to use it. 
However, as the following lessons will be focused more on the Doctor agent and what precedes its activity, it will make testing much easier for you.

Okay, that's it! Get ready for part 2 of the tutorial 💪