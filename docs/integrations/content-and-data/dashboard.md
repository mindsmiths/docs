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


## How to use the Dashboard?

In the following image, you can see the main structure of the Dashboard page. The part marked with **number 1** is a side-menu bar
where you can find all your main Django models. To define and add another object to the database, you will press a button
marked with **number 2**. Finally, the area marked as **number 3** is where all objects of the selected Django model are displayed
in the side menu bar.


   ![image](/img/dashboard/dashboard-overview.png#center)


Adding a Django model through a graphical interface, as explained above, is not the only way to insert an object into a database.
A very common use case is calling one of the API functions directly from the Rule Engine (**RE**) that creates or updates Django objects. 
These API methods are usually short Python functions that use Django packages, but more about APIs and how they work in the
next section.

### APIs

APIs are an essential part of the Dashboard. They are used for communication between the Dashboard and other services,
especially the RE. 
The Dashboard API is a *set* of functions that can be called from other services to create, update, and delete objects in the Dashboard database.

Since the Dashboard is the owner of the database, it is the only service that can perform these actions. All the other services
can create, update, and delete Django objects only through the Dashboard API. 

The API structure is defined within the `api/api_builder.py` file, where all the API endpoints for communication with other services are declared. 
The implementation of these endpoints can be found in the `apps/service.py` file.

The Dashboard API, written in Python, can be directly used by any service written in Python. 
However, for services written in other languages, such as Java (which will be used in these examples), we need to define corresponding API endpoints in that particular language.
It's important to note that these API endpoints must share the same names as the Python endpoints. These are defined 
within the `clients/java/src` folder.

Let's say we want to model an Event object. We create a Django model of event in `apps/models.py` file.

```python title="apps/models.py"
class Event(BaseModel):
    EVENT_STATUS = (
        ("NEW", "New"),
        ("IN-PROGRESS", "In progress"),
        ("Done", "Done"),
    )
    name = models.CharField(max_length=256)
    status = models.CharField(max_length=256, choices=EVENT_STATUS, default='NEW')
    ...
```
In this model, the **status** field can hold one of three values - _New_, _In-progress_, and _Done_. 
Now, suppose the RE needs to update the event's status from _New_ to _In-progress_ at the start of the event. 
But as mentioned at the start, the RE is not authorized to modify the status field directly within the database
as the Dashboard is the designated owner of the object. That's why RE needs to call Dashboard API when it wants to 
change the status of the event. 

Here are the 4 steps we need to take in order to make this API calls possible:
1. Define API endpoint in `api_builder.py` file
2. Provide the implementation for this endpoint in the `service.py` file
3. Define API endpoint and payload in the chosen language
4. Call the Dashboard API from the RE

So let's start with defining API endpoint in `api_builder.py` file:

```python title="api/api_builder.py"
@api_interface
class EventDashboardAPI(BaseAPI):
    service_id = "event_dashboard"

    @staticmethod
    def set_event_status(eventId: str, status: str) -> None:
        """
        Set event status
        :param eventId: event id
        :param status: new status
        :return: None
        """

```
In this file, there's an `EventDashboardAPI` class defined and here is the place for listing all the methods that will be implemented.
Next, we need to provide the implementation for this endpoint in the `service.py` file. 

:::caution Naming convention
Keep in mind, all parameters should be in camelCase for both Python and Java.
:::


```python title="apps/service.py"
class EventDashboardListener(BaseService):

    @api
    async def set_event_status(self, eventId: str, status: str) -> None:
        def _set_event_status():
            event = Event.objects.get(id=eventId)
            event.status = status
            event.save()
        await sync_to_async(_set_event_status)()

```

This part is crucial as here is where the logic is implemented. Lastly, we need to define an API **endpoint** and **payload** in Java.

```java title="clients/java/com/mindsmiths/dashboard/EventDashboardAPI.java"
public class EventDashboardAPI {

    private static final String serviceId = "event_dashboard";

    public static void setEventStatus(String eventId, String status) {
        new SetEventStatus(eventId, status).send(serviceId);
    }

}
```

```java title="clients/java/com/mindsmiths/dashboard/api/EventDashboardAPI.java"
public class SetEventStatus extends Message {
    private String eventId;
    private String status;
}
```

Now for the final step, we can call the Dashboard API from the RE.

```java title="rule_engine/src/main/java/resources/rules/Rule.drl"

import com.mindsmiths.eventDashboard.EventDashboardAPI;

rule "Change event status"
    when
        signal: EventStarted(eventId: eventId) from entry-point "signals"
        event: Event(id == eventId, status == "new")
    then
        EventDashboardAPI.setEventStatus(eventId, "in progress");
    end
```

And that's it! We have successfully updated the status of the event from _New_ to _In progress_.

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

```python title="apps/models.py"
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
```python title="apps/models.py"
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

Since RE uses Java, and not Python, we have to write the corresponding `Customer` class using Java. 
Now follows implementations of `Customer` class in Python and Java:

```python title="dashboard/api/views.py"
class Contact(DataModel):
    id: str
    firstName: str
    lastName: str
    phone: Optional[str]
    email: Optional[str]
```

```java title="dashboard/clients/java/src/main/java/com/mindsmiths/dashboard/models/Contact.java"
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

:::info
Notice that in the Java class, we added a decorator `DataModel(emit=true)` which says that this class is emmittable.
:::

The last part that we have to do is to subscribe RE on this type of event, or simply put, we have to say to the RE to
listen to all `Customer` signals being emitted. In the `Runner.java` inside the `initialize()` method put
`registerForChanges(Customer.class)`:

```java title="rule_engine/src/main/java/Runner.java"
public class Runner extends RuleEngineService {
    @Override
    public void initialize() {
        registerForChanges(Customer.class);
    }
}
```

That's all! With following this few simple examples, it should be easy to implement your own methods and models and add the DashboardAPI to your project.
