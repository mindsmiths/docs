---
sidebar_position: 4
---

# Learning stage

Basically we need two different functions to interact with our model: adding the input data and predicting the output. We'll add them to our Doctor agent:
```java title="java/agents/Doctor.java"
-insert refactored code here with some comments-
```
We send in a training data point as soon as it's received. Once a sufficient number of data points is added, the AutoML component will start the training. 
In this demo, the model re-trains every time there are at least 5 new data points. 

As mentioned, we'll always first try to get an automatic response from our model upon receiving a request. 
So, we need to add the rule that will send the incoming BMI measurements to the model instead of the doctor and processing the received prediction:

```java title="rules/doctor/Doctor.drl"
...
import java.util.List
import java.util.Map

import com.mindsmiths.modelTrainer.ModelTrainerAPI
import com.mindsmiths.modelTrainer.PredictionResult
import signals.Prediction
...

rule "Predict obesity for request"
    when
        request: BMIMeasurement() from entry-point "signals"
        doctor: Doctor()
    then
        String predictionId = ModelTrainerAPI.predict("bmi-model", Map.of("age", req.getAge(), "bmi", req.getBMI()), List.of("not_obese", "obese"));
        insert(new Prediction(predictionId, req));
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
        Log.info(String.format(
           "Model trainer returned label: %s\nAge: %d\nBMI: %.1f",
           result.getResult(), prediction.getBmiMeasurement().getAge(), prediction.getBmiMeasurement().getBMI()
        ));
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
```
As you can see, the first rule we create the `Prediction` object and insert it in our knowledge session until we 
asynchronously obtain the "obese" or "not obese" verdict we can attach to it. The second rule catches `PredictionResult`
the model returns, and stores the data on the corresponding `Prediction` object.





