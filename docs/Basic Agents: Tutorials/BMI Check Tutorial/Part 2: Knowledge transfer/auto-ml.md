---
sidebar_position: 2
---

# AutoML

AutoML frameworks are designed to aid you in exploring different models and parameters in order to find the best setup for your particular problem. Different kinds of ML algorithms are better or worse suited for different situations, and even if you know which algorithms to start from, it’s still relatively difficult to find the optimal model parameters or model combinations.

AutoML frameworks enable you to skip the tedious work of searching for the optimal setup by searching the model and parameter space for you and creating an ensemble of models best suited for the problem you need to solve.
This means that, as an engineer, you only need to care about your data (collecting, pruning and maintaining it), which makes things easier.

We use AutoGluon for tabular prediction. This AutoML framework is quite powerful and for our use case should already perform well enough out-of-the-box. In more complex scenarios, it can also be extremely useful as a starting point (i.e. giving you a sense of which ML algorithms and  parameter settings you want to focus on) for more focused tuning and experimenting before you choose the best solution for your problem.

Note that in most cases, AutoGluon will actually return an ensemble (a combination of multiple algorithms whose joint prediction is then given as output), but for simplicity’s sake we’ll be referring to the resulting model combination just as “model”.