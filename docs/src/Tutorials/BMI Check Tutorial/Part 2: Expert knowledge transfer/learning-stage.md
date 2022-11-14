---
sidebar_position: 4
---

# Learning stage

Basically we need two different functions to interact with our model: adding the input data and predicting the output. We'll add these to our Doctor agent:
```java title="java/agents/Doctor.java"
...
import java.util.Map;
...
import com.mindsmiths.modelTrainer.ModelTrainerAPI;
...
import signals.Prediction;

@Data
@NoArgsConstructor
public class Doctor extends Agent {
    public static String ID = "DOCTOR";

    private Integer modelVersion;
    private String currentRequest;
    ...
    public void addInputData(BMIMeasurement bmiMeasurement, Boolean isObese) {
        ModelTrainerAPI.addDataPoint("bmi-model",
                Map.of("age", bmiMeasurement.getAge(), "bmi", bmiMeasurement.getBMI()), isObese ? "obese" : "not_obese"
        );
    }
        
    public String generatePrediction(BMIMeasurement bmiMeasurement) {
        String predictionId = ModelTrainerAPI.predict("bmi-model",
                Map.of("age", bmiMeasurement.getAge(), "bmi", bmiMeasurement.getBMI()), List.of("not_obese", "obese")
        );

        return predictionId;
    }
    ...
}    
```
The first function adds the input data: age and bmi as input variables and doctor's decision as the actual output value. 
We send in a training data point as soon as it's received. Once a sufficient number of data points has been added, the AutoML component will start the training. 
In this demo, the model re-trains every time there are at least 5 new data points.

As mentioned, predicitons are generated each time a request is received: we send the age and bmi data to the model, and ask it to label it either as "obese" or "not_obese".
Let's now look at what this process looks like in the rules:
```java title="rules/doctor/Doctor.drl"
...
import java.util.List
import java.util.Map

import com.mindsmiths.modelTrainer.PredictionResult
import signals.Prediction
...

rule "Predict obesity for BMI request"
`    when
        request: BMIMeasurement() from entry-point "signals"
        agent: Doctor()
    then
        String predictionId = agent.generatePrediction(request);
        insert(new Prediction(predictionId, request));
        delete(request);
end

rule "Process model's response"
    salience 100
    when
        result: PredictionResult(id == pred.predictionId) from entry-point "signals"
        prediction: Prediction()
        doctor: Doctor()
    then
        Boolean isObese = result.getResult().equals("obese");
        
        modify(prediction) {
            setPrediction(isObese),
            setConfidence(result.getConfidence()),
            setModelVersion(result.getModelVersion())
        };

        if (doctor.getModelVersion() == null || result.getModelVersion() > doctor.getModelVersion()) {
            doctor.sendMessage("I've upgraded my knowledge!");
            doctor.setModelVersion(result.getModelVersion());
        }

        delete(result);
end

rule "Send BMI request to doctor"
   when
       prediction: Prediction(prediction != null, sentToDoctor != true)
       doctor: Doctor()
   then
       doctor.sendBMIMeasurement(prediction);
       modify(prediction) {setSentToDoctor(true)};
end

rule "Process doctor's BMI answer"
   when
       prediction: Prediction(request: bmiMeasurement, predictionId: predictionId)
       answer: TelegramKeyboardAnswered(referenceId == predictionId) from entry-point "signals"
       doctor: Doctor()
   then
       boolean isObese = answer.getAnswer().equals("YES");
       doctor.send(request.getFrom(), new BMIResponse(request, isObese));
       doctor.addInputData(request, isObese ? "obese" : "not_obese"); // TODO test!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
       doctor.sendMessage("Thanks!");
       delete(answer);
       delete(prediction);
end
````
With the first two rules, we insert the AutoML component in our pipeline before the incoming BMI request reaches the doctor.
As you can see, the first rule we create the `Prediction` object and insert it in our knowledge session until we 
asynchronously obtain the "obese" or "not obese" verdict we can attach to it.
Once we have the model's `PredictionResult`, we can send the BMI data to the doctor to obtain the actual label for it.


Of course, the model's prediction results will at first be random picks between "obese" and "not obese".
However, as we get more labeled data, the model will learn and gradually improve.

The only missing piece now is to use the model once its predictions are good enough to start helping relieve the doctor's workload.

// TODO: test if forge run works at this point 