---
sidebar_position: 5
---

# Model taking over

Now that we have the learning mechanism in place, we need to create some relatively reliable way to integrate the model's predictions,
as well as estimate when the model has learned enough to take over some of the doctor's workload.
There are different factors to consider. 
Obviously you don't want models making inaccurate predictions to substitute the doctor. To estimate the model performance, 
you can use some standard (evaluation metrics)[https://medium.com/ml-cheat-sheet/machine-learning-evaluation-metrics-b89b8832e275] 
used for classification problems in machine learning, such as accuracy, F-score, ROC AUC etc.
Here we just opted to use the most basic measure: accuracy. This measure is simply calculated by dividing the number of correct predictions by the total number of predictions.


However, we don't want to base our trust in the model solely on that: what if our model randomly predicted "not obese" for the data that the doctor also marked as "not obese", say for the very first case.
Based on accuracy alone, this would look like impressive performance: the model got 100% of the cases correct! 
However, of course this information has little to do with actual reality.

To better estimate the model's actual performance, we constructed a simple confidence measure, which also weighs the score based on the number of data points the model has seen so far.
The confidence score we obtain is a number between 0 and 1 that represents how "sure" the model is of the prediction it made.
Calculating confidence far from being a solved issue in machine learning, so you should of course take this implementation with a grain of salt. 


However, since in this demo we're handling a very low-risk scenario, and a relatively straight-forward use case, we can make do with such simplified implementations of confidence.
We just need to add the calculation of the confidence score every time the model makes a prediction. First we add the confidence score as another field on the Prediction object:
```java title="java/signals/Prediction.java"
...
import com.mindsmiths.modelTrainer.PredictionResult;
...
public class Prediction {
    ...
    private Double confidence;
    ...
    public void setPredictionResult(Boolean isObese, PredictionResult predictionResult) {
        this.prediction = isObese;
        this.confidence = predictionResult.getConfidence();
        this.modelVersion = predictionResult.getModelVersion();
    }
}
```
Now that we have this information, the Doctor agent can use it when deciding whether to forward the request to the doctor, or just use the prediction returned by the model.
For this we need to set some threshold for the model's confidence score, above which we estimate it would be safe to trust the model and just go with its prediction.
For the purposes of this demo, we accept any prediction for which the model is over 75% "confident" it got it right:
```java title="rules/doctor/Doctor.drl"
...
rule "Predict obesity with newer model"
    salience 200
    when
        doctor: Doctor(currentRequest != null)
        req: Prediction(modelVersion != null, modelVersion < doctor.modelVersion, sentToDoctor != true)
    then
        String predictionId = ModelTrainerAPI.predict("bmi-model", Map.of("age", req.getBmiMeasurement().getAge(), "bmi", req.getBmiMeasurement().getBMI()), List.of("not_obese", "obese"));
        modify(req) {
            setPredictionId(predictionId),
            setPrediction(null),
            setConfidence(null),
            setModelVersion(null)
        };
end

rule "Process model's response"
    salience 100
    when
        pred: Prediction()
        res: PredictionResult(id == pred.predictionId) from entry-point "signals"
        doctor: Doctor()
    then
        Boolean isObese = res.getResult().equals("obese");

        modify(pred) {
            setPrediction(isObese),
            setConfidence(res.getConfidence()),
            setModelVersion(res.getModelVersion())
        };

        if (doctor.getModelVersion() == null || res.getModelVersion() > doctor.getModelVersion()) {
            doctor.sendMessage("I've upgraded my knowledge!");
            doctor.setModelVersion(res.getModelVersion());
        }

        delete(res);
end

rule "Answer BMI request with high confidence prediction"
    when
        pred: Prediction(prediction != null, req: bmiMeasurement, confidence >= 0.75, sentToDoctor != true)
        doctor: Doctor()
    then
        Log.info("Confident in prediction, handling automatically");
        modify(doctor) {setHandledAutomatically(doctor.getHandledAutomatically() + 1)};
        doctor.send(req.getFrom(), new BMIResponse(req, pred.getPrediction()));

        delete(pred);
end
...
```
As you can see, the doctor's agent will now no longer forward to the doctor the requests for which the model was confident enough, just send the reply directly to the patient.
We effectively allow the model to gradually take over as it gets better, but we do this in a smart way, with the process being moderated by the level of confidence about a particular model prediction.
In real life, this means that the doctor will no longer need to handle the clear-cut, "boring" cases. Instead, the human expert can focus on the trickier, more interesting cases:

```java title="rules/doctor/Doctor.drl"
...
rule "Calculate pending requests"
    salience 1000
    no-loop // prevents the rule from re-firing upon execution
    when
        doctor: Doctor()
        pending: Number() from accumulate(Prediction(), count(1))
    then
        modify(doctor) {setPendingRequests(pending.intValue())};
end

rule "Ask doctor for help with BMI request"
    when
        pred: Prediction(prediction != null, sentToDoctor != true, predictionId: predictionId, confidence < 0.75)
        doctor: Doctor(currentRequest == null)
    then
        doctor.sendMessage("Pending requests: " + doctor.getPendingRequests() +
                          ", handled automatically since last time: " + doctor.getHandledAutomatically());
        doctor.sendBMIMeasurement(pred);
        modify(doctor) {setCurrentRequest(predictionId), setHandledAutomatically(0)};
        modify(pred) {setSentToDoctor(true)};
end
```
To keep track of the pending workload (and see it reduce as the model improves), we also added the rule that sums up all the requests still awaiting the doctor's evaluation (`"Calculate pending requests"`). 
We'll also share the information about the model's prediction and confidence about it with the doctor when sending the BMI requests for evaluation:

```java title="java/agents/Doctor.java"
...
public class Doctor extends Agent {
    public static String ID = "DOCTOR";
    private Integer modelVersion;
    private String currentRequest;
    private int handledAutomatically;
    
    ...
    
    public void sendBMIMeasurement(ModelPrediction modelPrediction) {
        BMIMeasurement bmi = modelPrediction.getBmiMeasurement();

        String predictionResult = modelPrediction.getPrediction() ? "obese" : "not obese";

        double confidence = modelPrediction.getConfidence() * 100;
        String confidenceText = String.format("I would say %s, but I'm not very sure.", predictionResult);
        if (confidence >= 60) {
            confidenceText = String.format("I would say %s, but I'm only %.0f%% sure.",
                    predictionResult, confidence);
        }

        String text = "Can you help me with this case?\n" +
                String.format("Age: %d\nBMI: %.1f\n", bmi.getAge(), bmi.calculateBMI()) +
                confidenceText;


        TelegramAdapterAPI.sendMessage(
                connections.get("telegram"),
                text,
                new KeyboardData(
                        modelPrediction.getPredictionId(),
                        Arrays.asList(
                                new KeyboardOption("YES", "Obese"),
                                new KeyboardOption("NO", "Not obese")
                        )
                )
        );
    }
}
```

That's it, you can now start the system! Once the model gets good enough, all that will be left for you to do is sit back and enjoy, only sporadically answering some more demanding requests 😉

:::note
> Bonus feature alert!
>
> To simulate the passing of time in real life, you can also use the shortcut of loading in a training data set, to quickly boost your model's performance.
> Just open a new Terminal and run:
> `python import_data.py`
> This will load in 115 data points from the `model_trainer/bmi_data.csv` file. You can additionally pass a different number of data points to import.
> 
> Have fun!
:::