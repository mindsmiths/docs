---
sidebar_position: 1
---

# Creating services

Sometimes you simply need more flexibility, so you want to create a custom service to extract a piece of functionality or logic.
Whether it's an adapter, a dashboard, or a complex algorithm or model, you can easily create and add any service.

To create a new service simply run `forge create-service` in the terminal. You will be prompted to choose which type of service you want to create.
You can see the full list of available templates [here](https://github.com/mindsmiths/platform-resources/tree/main/create_service_templates).
Make sure you match the exact name of the directory.
```shell
root:/app$ forge create-service
Which type of service would you like to create (eg. python, django)? ... [default: python]:
```
The template documentation can help you correctly fill in the prompts that follow.
For example, if you're creating a Python service, you need to set the name for the new service. The name should be capitalized, with words separated by spaces (e.g. `New Service`).
The rest of the naming formats will be automatically generated based on the initial name you choose, so you can just press enter:
```shell
service_name: New Service
service_name_camel_case [NewService]: 
service_identifier [new_service]: 
service_artifact_name [new-service]:
New Service was successfully incorporated into your project!
```

That's it! The added service will now appear in your directory tree (under `services`), and will be automatically added at the bottom of your `config/config.yaml`, for example:
```yaml
...
  new-service:
    type: python
    db:
      mongo: true
    resources:
      cpu: 100m
      memory: 100Mi
```

You can learn more about the [config file here](../project-structure.md).
Don't forget to run `forge install` to install any new dependencies, and you're ready to start writing up the code for your new service!

### Service structure
The service structure depends on the template you use. Here we'll focus on a simple Python service as an example.

The basic structure looks like this:
- {service_identifier}/
  - api/ - contains the public API that can be used by other services (incl. models and a client)
    - api.py - data models used in the API
    - api_builder.py - a Python client that other services use to communicate with this service
  - clients/java/ - a Java client that other services use to communicate with this service
  - tests/ - service unit-tests
  - {service_identifier}.py - the service's logic

You're free to add new files and packages, but the basic structure should remain the same.

## Writing the logic
You can write the service's logic in `services/<new_service>/<new_service>.py`.

You'll see an example function that receives some data, and returns a result. This function is already exposed through an API.
Feel free to change this example and add new functions.

If you don't want to expose any functions, but want some code to be run in a loop instead, just override the `start` function:
```python
class NewService(BaseService):
    def start(self) -> None:
        while True:
            """ TODO: WRITE YOUR MAGIC HERE """
            sleep(5)
```

If you want both, just add `self.start_async_message_consumer()` before the loop in the `start` method, to enable the service to listen to requests in a separate thread.

## Defining an API
To allow other services to communicate with our new service, we'll create a client for them. The `create-service` command already generated some examples for us.

The platform will do most of the work, so all we need to do is to define the prototypes of the exposed functions in `services/<new_service>/api/api_builder.py`.
Keep in mind that if you're using additional data models in the calls or in the return (e.g. `Result` in the generated example), they *must* be defined somewhere in the `services/<new_service>/api/` package, because this is the only package other services can access.
This also means you *cannot* import any files outside this package in any file defined inside it.

Notice that there is no `self` argument, and that we specify the expected result as _Future[dataType]_ in `api_builder.py`.
This reminds us that the service doesn't wait for the result before continuing: all service communication in the platform is **asynchronous**.

## Java client
The code for handling communication with Java-based services (e.g. Rule Engine) is in the directories under the `services/<new_service>/clients/java` path. 
The generated files also contain template code for API calls. Just mirror what you defined in the Python API, but in Java.

Note that if you want the new service to communicate with the Rule Engine, you should add it as a dependency to its `pom.xml` (in `services/rule_engine/pom.xml`):
```xml
<dependencies>
    ...
		<dependency>
			<groupId>com.mindsmiths</groupId>
			<artifactId>new-service-client</artifactId>
			<version>4.0.0a0</version>
		</dependency>
    ...
</dependencies>
```

You need to run `forge install` from the terminal to finish connecting the services after adding the dependency.

## Service configuration
If you'd like to be able to configure parts of the logic, a good practice is to use settings. Settings are also great for secret values like passwords and authentication tokens.

Settings are regular Python variables, but their values are loaded from environment variables.
To define one, first create `services/<new_service>/settings.py` and add the following code:
```python
from environs import Env
env = Env()
```
Now you can add settings below, here are some examples:
```python
DEFAULT_TIMEZONE = env.str('DEFAULT_TIMEZONE', 'Europe/Zagreb')
HTTP_PORT = env.int('HTTP_PORT', 8080)
AUTH_TOKEN = env.str('AUTH_TOKEN')
USE_WEBHOOK = env.bool('USE_WEBHOOK', True)
```
To override the service defaults, or provide values for settings with no defaults, go to `config/config.yaml` and add something like this for your service:
```yaml
  new-service:
    ...
    env:
      MY_SERVICE_PORT: 8081
      AUTH_TOKEN: "{{env.NEW_SERVICE_AUTH_TOKEN}}"  # read from the system's environment (and the '.env' file when running locally) - good for secrets
    ...     
```