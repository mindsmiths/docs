---
sidebar_position: 4
---

# Dashboard
The dashboard is one of the most important services on our platform. It is our interface for storing
[relational data](https://www.oracle.com/database/what-is-a-relational-database/). For example, all information about
customers, managers, GPT prompts, armory screens, and much more, are stored there. Besides being very useful as a
database, Dashboard is also very practical for summarizing and displaying all the data in a user-friendly and
easily-readable way. Moreover, because Dashboard is a Django-based service, it provides a lot of customizability in the
ways how all that data can be displayed.

## Core features

* acts as a central database for the whole platform
* can emit models to other services, for example, to the Rule Engine
* can be used as a gateway to external databases, salesforces, Google Sheets tables...

## Setup

TBD

## How to use the Dashboard?

On the image below you can see the main structures of our Dashboard page. With **number 1** is marked side-menu bar.
There you can find all your main Django models. If you want to add one more object you will press **button 2**. And
finally, **area 3** displays all objects of the Django model selected in the side menu bar.
<div style={{textAlign:'center'}}>

   ![image](/img/dashboard/dashboard-overview.png)
</div>

Adding a Django model through a graphical interface, as explained above, is not the only way to insert an object into a database.
A very common use case is calling the API function from Rule Engine (RE) that creates or updates Django objects. These API
methods are usually short Python functions that use Django packages, but more about APIs and how they work in the
next section.

### APIs

Marija's part

### Emitting signals

Since Mindsmiths's platform is based on a microservice structure, communication between these services is an important 
part of the whole story. When we say communication, we primarily mean the synchronization of databases of those services.
Probably the two most important services of our platform are Dashboard and Rule Engine. As we have already said,
Dashboard is our interface for storing relational data, and summarizing all important information. We could think of
Dashboard as a central database of the whole platform. Without going into details, we will just mention what  Rule 
Engine does. This service takes care of all logic and proactivity which makes our AI agents so cool, fancy, fun,
useful... you get the idea ;) Rule Engine also has its database, non-relational
MongoDB database, and all decisions our agents make are based on this database. As we can see, the synchronization of
these two databases is pretty important. We don't want to be in a situation where we enter some information about our
clients in the Dashboard, and RE is not aware of these changes. And this is where emitting signals come into play.

So we want that every change made on Dashboard propagates to the Rule Engine. The best way to explain how to do this is
with a simple example. Let's say that we have a Django model called `Customer`. If an object is created we want RE to know
that there is a new object, if it is updated or deleted, we also want that all those pieces of information end up on RE.
To address those changes we have to write Python functions in the same file where those models are defined, `models.py`.
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