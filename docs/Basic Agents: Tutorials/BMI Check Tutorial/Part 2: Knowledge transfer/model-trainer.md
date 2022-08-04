---
sidebar_position: 3
---

# Model Trainer

In our current flow, the smart learning component is fitted between the Patient’s and the Doctor’s agent, because its purpose is to ultimately filter down the requests sent to the doctor to only the borderline cases it doesn’t know how to handle.
This is why the Doctor agent will first attempt to get an answer to the patient’s query using the model, and only then notify the doctor of the newly received question.

As we have no data and no model initially, the model will first be returning random predictions and just forwarding the requests to the doctor all the same. At the same time, we will be collecting the doctor’s responses and feeding them as input to the model so it can learn to replicate the doctor’s decisions. As the performance of the ML component improves over time, fewer and fewer requests will need to be handled by the doctor.
So, let’s talk data!

The input data structure is going to be the same as what the doctor sees when making a decision on whether the child is obese or not. That is, we’ll be passing the child’s age and bmi as input, and the model will return the verdict whether the child is obese (true) or not (false).
As mentioned, our input features are just two continuous numerical values, which means this is a tabular task. The model output can be either “obese” or “not obese”, so we’re dealing with a binary classification problem.

So let’s begin with defining the object the Doctor agent can use for communicating with the ML model and storing a new data point for the model to learn from later on after receiving the decision from the doctor:
```java title="signals/Prediction.java"
package signals;

import lombok.*;

import com.mindsmiths.sdk.core.db.PrimaryKey;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prediction {
    @PrimaryKey
    private String predictionId;
    private Boolean prediction;
    private Boolean sentToDoctor;
    private Integer modelVersion;
    private Double confidence;
    private BMIMeasurement bmiMeasurement;

    public Prediction(String predictionId, BMIMeasurement bmiMeasurement) {
        this.predictionId = predictionId;
        this.bmiMeasurement = bmiMeasurement;
    }
}
```
The most important fields are the BMI measurement itself (the input values) and the prediction (the model’s decision on obesity).
As we will be re-training the model as we go along and collect more data, we also keep track of the version of the model that made the prediction. Model trainer also offers a calculation of the estimated confidence - roughly how sure the model is of the prediction it made. It can be used as a reference point for the doctor to see how much to rely on the model’s response when making a decision. 

Lastly, as this object is inserted as a fact in our knowledge base until the processing is complete (i.e. the decision about the request is sent back to the Patient agent), we add the sentToDoctor flag to prevent the Doctor agent’s rules from re-firing.

After all that talk, we want to start utilizing every decision that doctor makes as an entry-point for our machine learning model, which means we are ready to give our model something to learn from.
Introducing the ModelTrainerAPI, an interface for adding data points, training the model and obtaining the prediction.   
There are two static methods that will be us of use - `.add_data_point()` and `.predict()`.
With `.add_data_point()` we are adding new data for our model to learn from, while `.predict()` returns a boolean representing the prediction if someone's child is obese or not. Let's see how are they being used in rules.   

```java title="rules/doctor/Doctor.drl"
...

rule "Process doctor's BMI answer"
   when
       pred: Prediction(req: bmiMeasurement, predictionId: predictionId)
       answer: TelegramKeyboardAnswered(referenceId == predictionId) from entry-point "signals"
       doctor: Doctor()
   then
       boolean isObese = answer.getAnswer().equals("YES");
       doctor.send(req.getFrom(), new BMIResponse(req, isObese));
       ModelTrainerAPI.addDataPoint(
           "train-model", Map.of("age", req.getAge(), "bmi", req.calculateBMI()), isObese ? "obese" : "not_obese"
       );
       doctor.sendMessage("Thanks!");
       delete(answer);
       delete(pred);
end

rule "Predict obesity for request"
  when
       req: BMIMeasurement() from entry-point "signals"
  then
       String predictionId = ModelTrainerAPI.predict(
               "train-model", Map.of("age", req.getAge(), "bmi", req.calculateBMI()), List.of("not_obese", "obese")
               );
       insert(new Prediction(predictionId, req));
       delete(req);
end

rule "Process model response"
   salience 100
   when
       pred: Prediction(predictionId: predictionId)
       res: PredictionResult(id == predictionId) from entry-point "signals"
       doctor: Doctor()
   then
       Boolean isObese = res.getResult().equals("obese");
       Log.info(String.format(
               "Model trainer returned label: %s\nAge: %d\nBMI: %.1f",
               res.getResult(), pred.getBmiMeasurement().getAge(), pred.getBmiMeasurement().calculateBMI()
       ));
       modify(pred) {setPrediction(isObese), setModelVersion(res.getModelVersion())};

       if(doctor.getModelVersion() != null && res.getModelVersion() > doctor.getModelVersion()) {
           doctor.sendMessage("I've upgraded my knowledge!");
       }
       modify(doctor){setModelVersion(res.getModelVersion())};
       delete(res);
end

...
```

If you look at the `"Process doctor's BMI answer"` rule, you can notice that it triggers when there is an active `Prediction` and when the doctor answers the question about patient's obesity. Regarding the answer, we need to check if the `referenceId`
is the same as the `predictionId`, so we can manipulate with the right data. 
In `then` part, first we check what is the doctor's verdict, and after that, the answer and the whole response are being sent to the same patient.
Also, doctor's verdict is added as a new data entry point for our learning model.
We then thank the doctor and delete both of the signals, because we extracted all the necessary data and we don't want them to trigger any other rules.

When the patient sends new request, that's when we should also check what our model predicts, so in the `"Predict obesity for request"` rule we catch that patient response. Next step, using `ModelTrainerAPI` for making a new prediction.
Based on `predictionId` which Model Trainer generates, we create new `Prediction`.
That same prediction is then being inserted as a fact to our knowledge base and the request signal is being deleted.

Last, but not least, we have the `"Process model response"` rule. That's where we update the data from model's prediction. This rule is triggered when there was a `Prediction` inserted as a fact in our knowledge base and when the Model Trainer sends its corresponding `PredictionResult` signal.
Here, we first check if the result is obese or not, following with modifying `Prediciton` with that result and `modelVersion`.
If model's version was updated during this process, then we notify the doctor about the knowledge update and set doctor's new `modelVersion`.
Finally, we delete the `PredictionResult` signal.

Your next move - start with **forge run** and test the Model Trainer on action. Begin with updating its knowledge data base. Soon we will be ready for that model to take over the decision making process!
