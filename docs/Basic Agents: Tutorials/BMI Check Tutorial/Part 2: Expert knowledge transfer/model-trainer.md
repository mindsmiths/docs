---
sidebar_position: 3
---

# Setting up Model Trainer

Let's first add the Model Trainer service to our project. Run in the Terminal:
```shell
pip install model-trainer==4.0.0a4
model-trainer setup
```

Great! You can now use the AutoML-based service in your project.

In our current flow, the smart component is fitted between the Patient’s and the Doctor’s agent, because its purpose is to ultimately filter down the requests sent to the doctor to only the borderline cases it cannot handle adequately.
This is why the Doctor agent will first try to get an answer (called "prediction") from the model, and only then notify the doctor about the newly received question from a patient.

As we have no data and no model in the beginning, this step will first return just random predictions and forward all requests to the doctor. At the same time, we will be collecting the doctor’s responses and feeding them as input data to the model, so it can learn to replicate the doctor’s decisions. As the performance of the ML component improves over time, fewer and fewer requests will need to be addressed by the doctor.

So, let’s talk data!

The input data structure is going to be the same as what the doctor sees when making a decision on whether the child is obese or not. That is, we’ll be passing the child’s age and bmi as input, and the model will return the verdict whether the child is obese (`true`) or not (`false`).
As mentioned, our input features are just two continuous numerical values, which means this is a tabular task. The model output can be either “obese” or “not obese”, so we’re dealing with a binary classification problem.

So let’s begin by defining the object the Doctor agent can use for communicating with the ML model and storing a new data point for the model to learn from later on after receiving the decision from the doctor:
```java title="java/signals/Prediction.java"
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
    private Integer modelVersion;
    private Double confidence; ///////////////!!!!!!!!!!!!!!!!!!!!!!!!!! Model trainer also offers a calculation of the estimated `confidence` - roughly how sure the model is of the prediction it made. It can be used as a reference point for the doctor to see how much to rely on the model’s response when making a decision. 
    private BMIMeasurement bmiMeasurement;
    private boolean sentToDoctor;

    public Prediction(String predictionId, BMIMeasurement bmiMeasurement) {
        this.predictionId = predictionId;
        this.bmiMeasurement = bmiMeasurement;
    }
}
```
The most important fields are the `bmiMeasurement` (the input values for the model) and the `prediction` (the model’s binary decision on obesity).
As we'll be re-training the model as we go along and collect more data, we also keep track of the version of the model that made the prediction (`modelVersion`).
If there is a newer model version available before the doctor gets around to manually checking the request, the request will be sent to this newer model first.
We keep track of which requests have been sent to the Doctor with the `sentToDoctor` flag. As the Prediction object is inserted as a fact in our knowledge base until the processing is complete (i.e. the decision about the request has been sent back to the Patient agent), the `sentToDoctor` flag also enables us to prevent the Doctor agent’s rules from re-firing for the same prediction instance.


Okay, we are now ready to set our model trainer in motion and start learning!


// TODO  private Double confidence; ///////////////!!!!!!!!!!!!!!!!!!!!!!!!!! Model trainer also offers a calculation of the estimated `confidence` - roughly how sure the model is of the prediction it made. It can be used as a reference point for the doctor to see how much to rely on the model’s response when making a decision.