---
sidebar_position: 3
---

# Confidence

Now that we introduced how the transfer of knowledge will be achieved, let's determine when do we  hand over the decison making to the model and give our doctor a break.
We can safely conclude how the domain of our problem, which is determing the BMI index for children is a fairly well-defined.

Confidence score is a number between 0 and 1, and it represents the likelihood that the prediction is correct and that the same verdict will be made if the expert (in out case doctor) was ought to make these decisions.



- BMI for children a fairly well-defined problem
- Explain confidence
- Once the model is confident enough for certain decisions, it can start taking over requests
- Only asking the doctor for the data points in range where it is uncertain
- Add one rule and adapt 2 rules + Doctor Java class
