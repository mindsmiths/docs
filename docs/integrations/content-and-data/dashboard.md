---
sidebar_position: 4
---

# Dashboard

The Dashboard is one of the most essential services on the Platform. It is used as an interface for storing
[relational data](https://www.oracle.com/database/what-is-a-relational-database/), and it is a central place for configuring
content shown on the screens, the persona of a specific assistant, and more. All in all, the information about
customers, managers, GPT prompts, and Armory screens is stored there and can easily be configured. Besides being very useful as a
database, Dashboard is also very practical for summarizing and displaying all the data in a user-friendly and
easily-readable way. Given that the Dashboard is a Django-based service, it is highly customizable in displaying all that data.

## Core features

* acts as a central database for the whole Platform
* emits models to other services (predominantly to the [Rule Engine](/docs/platform/advanced-concepts/rule-engine.md))
* operates as a gateway to external databases, salesforces, Google Sheets tables, etc.

## Setup

TBD

## How to use the Dashboard?

In the following image, you can see the main structure of the Dashboard page. The part marked with **number 1** is a side-menu bar
where you can find all your main Django models. To define and add another object to the database, you will press a button
marked with **number 2**. Finally, the area marked as **number 3** is where all objects of the selected Django model are displayed
in the side menu bar.


   ![image](/img/dashboard/dashboard-overview.png#center)


Adding a Django model through a graphical interface, as explained above, is not the only way to insert an object into a database.
A very common use case is calling one of the API functions directly from the Rule Engine (RE) that creates or updates Django objects. 
These API methods are usually short Python functions that use Django packages, but more about APIs and how they work in the
next section.

### APIs

Marija's part

### Emitting signals

Since the Platform is based on a microservice structure, communication between these services is crucial
to the whole story. When we say communication, we primarily mean the synchronization of databases of those services, especially for the two most important Platform services - Dashboard and Rule Engine (**RE**).

Given that the Dashboard is an interface for storing relational data and a central point for summarizing all vital information,
we could consider it a central database of the whole Platform. Without going into details, let's break down how RE works.
Here is where all the magic takes place and where AI agents get empowered to be caring, gain expertise, as well as learn
how to gather knowledge and be proactive.

RE also has its own non-relational MongoDB database, and all the decisions agents make are based on the information stored there.
If we want to work with the latest data, the synchronization of these two databases needs to work flawlessly.
That's why RE needs to be aware of any new data entrance or possible changes on the Dashboard. Otherwise, agents will encounter issues related to data consistency.
Here is where **emitting signals** come into play.

Every new input or change on Dashboard should be propagated to the RE. The best way to explain how to do this is
with a simple example. Let's say that we have a Django model called `Customer`. If a `Customer` object is created,
updated, or deleted, Dashboard should send word to the RE so that it can act accordingly.
To address those changes, we have to write Python functions in the same file where those models are defined, `models.py`.

Let's say that our model looks like this:

```python
class Customer(BaseModel):
    id = models.CharField(primary_key=True, max_length=128, default=id_generator, editable=False)
    first_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128)
    phone = models.CharField(max_length=128, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    def to_dict(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "phone": self.phone,
            "email": self.email,
         }
``` 

At the end of the file, we can add the following function:
```python
@receiver(post_save, sender=Customer)
def contact_updated(sender: Type[Customer], instance: Customer, *_, **__):
    CustomerView(**instance.to_dict()).emit(change_type=DataChangeType.UPDATED)
```

Let's break down this function. First, we add `@receiver` decorator where we define when this function will be triggered.
In this case, it is after the object is saved which is defined with the `post_save` keyword. `sender` and `instance`
parameters define the type of Django model which change will trigger this method. `CustomerView` is a Python class that
will be emitted and as we can see emit method is called with change type `UPDATED`. It is important to emphasize that
`CustomerView` is a `Customer` class imported as:
```python
from services.dashboard.api.views import Customer as CustomerView
``` 
The reason why we import the Python class `Customer` as `CustomerView` is to distinguish it from the `Customer` Django model. They are
not the same thing. First is the Python class that will be emitted from the dashboard, written in the `views.py` file, and the latter
is the Django model that is saved into the database, written in `models.py`. 

Since RE uses Java, and not Python, we have to write the corresponding `Customer` class using Java, inside
the `services/dashboard/clients/java/src/main/java/com/mindsmiths/dashboard/models/` folder. Now follows implementations of
`Customer` class in Python and Java:
```python
class Contact(DataModel):
    id: str
    firstName: str
    lastName: str
    phone: Optional[str]
    email: Optional[str]
```
```java
package com.mindsmiths.dashboard.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.mindsmiths.sdk.core.db.DataModel;

@AllArgsConstructor
@NoArgsConstructor
@Data
@DataModel(emit = true)
public class Contact {
    String id;
    String firstName;
    String lastName;
    String phone;
    String email;
}
```
Notice that in the Java class, we put decorator `DataModel(emit=true)` which says that this class is emmittable.

The last part that we have to do is to subscribe RE on this type of event, or simply put, we have to say to the RE to
listen to all `Customer` signals being emitted. In the `Runner.java` inside the `initialize()` method put
`registerForChanges(Customer.class)`:
```java
public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        registerForChanges(Customer.class);
    }
```