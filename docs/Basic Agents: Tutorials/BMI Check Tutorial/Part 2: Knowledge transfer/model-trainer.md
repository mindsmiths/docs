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
```java title="signals/ModelPrediction.java"
package signals;

import lombok.*;

import com.mindsmiths.sdk.core.db.PrimaryKey;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelPrediction {
    @PrimaryKey
    private String predictionId;
    private Boolean prediction;
    private Boolean sentToDoctor;
    private Integer modelVersion;
    private Double confidence;
    private BMIMeasurement bmiMeasurement;

    public ModelPrediction(String predictionId, BMIMeasurement bmiMeasurement) {
        this.predictionId = predictionId;
        this.bmiMeasurement = bmiMeasurement;
    }
}
```
The most important fields are the BMI measurement itself (the input values) and the prediction (the model’s decision on obesity).
As we will be re-training the model as we go along and collect more data, we also keep track of the version of the model that made the prediction. Model trainer also offers a calculation of the estimated confidence - roughly how sure the model is of the prediction it made. It can be used as a reference point for the doctor to see how much to rely on the model’s response when making a decision. 

Lastly, as this object is inserted as a fact in our knowledge base until the processing is complete (i.e. the decision about the request is sent back to the Patient agent), we add the sentToDoctor flag to prevent the Doctor agent’s rules from re-firing.

So, when we become ready and decide to make our model smarter, we will be using the ModelTrainerAPI and its perks. There are two static methods that will be us of use - `.add_data_point()` and `.predict()`.
With `.add_data_point()` we are adding a new point for our model to learn from, while `.predict()` returns a boolean representing the prediction if someone's child is obese or not. Let's see how are they being used in rules.   

```java title="nesto"
rule "Process doctor's BMI answer"
   when
       pred: ModelPrediction(req: bmiMeasurement, predictionId: predictionId)
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
       insert(new ModelPrediction(predictionId, req));
       delete(req);
end
```

Add drl with ML rules (Predict obesity for request, Process model's response)
Modify the two rules (Predict obesity for request, Process doctor's BMI answer)
Modify Doctor.java
