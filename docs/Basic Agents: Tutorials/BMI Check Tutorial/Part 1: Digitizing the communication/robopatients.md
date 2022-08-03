---
sidebar_position: 8
---

# Adding robopatients

To simulate the doctor’s workload, and also make the testing easier, we’ll introduce fake patients in the system: RoboPatients.
These will be fake patient users that we’ll simply use to mock real user activity and simulate the kind of workload the doctor would normally be handling.

We simulate fake patient activity through a robo_patient service we run with `forge run-service robo_patient`. 

Another motivation for introducing RoboPatients is for demonstration purposes for the model learning process later on: by controlling the distribution of the artificially generated data, we make sure our coverage is good enough to approximate the actual BMI function. 

You will notice you already have this code as well, you just need to uncomment it the rules in `rules/roboPatient/RoboPatient.drl`
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

As opposed to the real Patient Agent, RoboPatient only registers fake users, sends requests and logs responses.
Looking at RoboPatient.java class, you can see the ranges in which the fake weight data gets generated (`normalWeightRange`):

```java title="agents/roboPatient/RoboPatient.java"
package agents.roboPatient;

import agents.patient.Scenario;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;

import com.mindsmiths.roboPatient.RoboPatientAPI;
import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.ruleEngine.util.Log;


@Data
@NoArgsConstructor
public class RoboPatient extends Agent {
    private boolean robotInitialized;
    private Integer age;
    private Integer height;
    private Integer lowWeightRange;
    private Integer highWeightRange;

    public RoboPatient(String connectionName, String connectionId, Scenario scenario) {
        super(connectionName, connectionId);
        this.age = scenario.getAge();
        this.height = scenario.getHeight();
        this.lowWeightRange = scenario.getNormalWeightRange().getLeft();
        this.highWeightRange = scenario.getNormalWeightRange().getRight();
    }

    public void sendMessage(String text) {
        String chatId = connections.get("telegram");
        if (!robotInitialized) {
            RoboPatientAPI.init(chatId, age, height, lowWeightRange, highWeightRange);
            robotInitialized = true;
        } else
            Log.info("Received response for robot " + chatId + ": " + text);
    }
}
```

These ranges are determined and assigned in the form of a Scenario in Runner.java:

```java title="models/Runner.java"
...
public class Runner extends RuleEngineService {

    @AllArgsConstructor
    private static class Scenario {
        public int age, height;
    }

    private static final List<Scenario> scenarios = Arrays.asList(
            new Scenario(2, 90),
            new Scenario(3, 100),
            new Scenario(4, 105),
            new Scenario(5, 110),
            new Scenario(6, 115),
            new Scenario(7, 120),
            new Scenario(8, 125),
            new Scenario(9, 135),
            new Scenario(10, 140),
            new Scenario(11, 145),
            new Scenario(12, 150),
            new Scenario(13, 160),
            new Scenario(14, 165),
            new Scenario(15, 170)
    );
    
    private static List<Scenario> unusedScenarios = new ArrayList<>();
    
    @Override
    public void initialize() {
        Function<String, Object> getAgent = chatId -> {
            List<Agent> agents = Agents.getByConnection("telegram", chatId);
            if (!agents.isEmpty())
                return agents;

            // Create doctor agent
            if (!Agents.exists(Doctor.ID) && !chatId.startsWith("FAKE-"))
                return Agents.createAgent(new Doctor("telegram", chatId)).getId();

            // Create patient agent
            if (Agents.exists(Doctor.ID) && !chatId.startsWith("FAKE-"))
                return Agents.createAgent(new Patient("telegram", chatId)).getId();

            // Create robopatient agent with scenario
            if (unusedScenarios.isEmpty()) {
                unusedScenarios = new ArrayList<>(scenarios);
                Collections.shuffle(unusedScenarios);
            }
            int age = unusedScenarios.get(0).age,
                height = unusedScenarios.get(0).height;
            unusedScenarios.remove(0);

            Pair<Integer, Integer> normalWeightRange = Pair.of(
                    getWeightForHeightAndBMI(height, normalBMIRangeByAge.get(age).getLeft()),
                    getWeightForHeightAndBMI(height, normalBMIRangeByAge.get(age).getRight())
            );

            return Agents.createAgent(new RoboPatient(
                    "telegram", chatId, age, height, normalWeightRange)
            ).getId();
        };

        configureSignals(
                Signals.on(TelegramReceivedMessage.class).sendTo((msg) -> getAgent.apply(msg.getChatId())),
                Signals.on(TelegramKeyboardAnswered.class).sendTo((ans) -> getAgent.apply(ans.getChatId()))
        );

        // Create agent Smith
        if (!Agents.exists(Smith.ID))
            Agents.createAgent(new Smith());
    }
    
    public static void main(String[] args) {
        Runner runner = new Runner();
        runner.start();
    }
}
```
 Here you can also see how the other agents get created in the system: for simplicity, the first user that registers is the doctor, and everyone else becomes the patient. You can also see how the signals are configured to be caught by the relevant agents.

Another agent that again gets created is Smith. Since this is a slightly more complex system, we use Smith to tell us the current number of Doctors (to see if there are any) and Patients (together with RoboPatients) registered in the system.

```java title="agents/smith/Smith.java"
package agents.smith;

import com.mongodb.client.model.Filters;
import com.mindsmiths.ruleEngine.model.Agent;
import com.mindsmiths.sdk.core.db.DataUtils;


public class Smith extends Agent {
    public static String ID = "SMITH";

    public Smith() {
        this.id = ID;
    }

    public static Integer countAgents(String agentType) {
        int agents = 0;

        for(Agent __ : DataUtils.filter(Filters.eq("type", agentType), Agent.class)) {
            agents++;
        }

        return agents;
    }
}
```

Let’s try running the code! Start up the system with **forge run** and send a message on Telegram to register as a doctor. After that run robopatients in another Terminal.
Good luck finding your way through floods of requests! To help you manage it, we will add more functionalities to your Doctor agent.

Stop both the forge run and the robopatient simulation with `CTRL+C` and let’s see what we do. Get ready for part 2!
