---
sidebar_position: 4
---

# CLI

Forge CLI is a tool that allows you to interact with your project. It is used to create, initialize, run, test and deploy your project, among other things.


## Installation

Just run this command in your terminal:
```shell
pip install forge-cli
```

You can also install autocomplete with:
```shell
forge install-autocomplete
```
Pssst, if you're a hardcore smith, also create a shell alias `alias f="forge"` 😉


## Usage

To see the full list of available commands, run:
```shell
forge
```

To see the list of available options for a specific command, for example the `run` command, run:
```shell
forge run --help
```

### Standard workflow

The usual workflow is as follows:

1. Create or clone a project
```shell
forge create-project
OR
git clone ...
```

2. Initialize the project
```shell
forge init
```
This will install all project dependencies and build the project (same as running `forge install` and `forge build`).

3. Configure secrets

Look at the `.env.example` file and create a similar `.env` file with the required secrets.

4. Run the project
```shell
forge run
```

5. Reset, fix bugs, and run again
```shell
forge reset
forge run
```


## CLI and config.yaml
The CLI will automatically load the config file, set the environment variables and register the defined services.

If you see `Error while trying to load project config` when running any `forge` command, it means that the config file is not valid.
The CLI will usually print out a list of possible fixes.

You may also encounter an error with a stack trace (eg. `SyntaxError` or a `jinja2` exception).
It usually means that the config rendering failed (there's a bug in the `{{ ... }}` thingies). 
You should also get a (hopefully) helpful error message.


## Custom commands
You can also create your own commands by putting them in the `services/commands/` folder.

Here's an example:
```python
from time import sleep

import forge
from click import echo
from forge.core.api.base import Event
from forge.utils import random_generator
from forge_cli.admin import cli


@cli.command()
def create_fake_user():
    forge.setup('cli')

    user = {
        'userId': random_generator(),
        'name': 'Felix Felicis',
        'age': 30
    }

    echo(f"Creating {user=}")
    Event(eventType='User', **user).emit()
    sleep(1)  # just to make sure the event is sent
```
Make sure to name the file and the function the same way (`create_fake_user.py`).


## Tips and tricks

### Producing and listening to messages
To produce a custom message to any topic, run:
```shell
forge produce-message
```
and follow instructions. You can use multiple lines to format the message nicely.
Hit the enter key twice to send the message.

To listen to messages on a topic, run:
```shell
forge consume-messsage -t topic
```

### Running custom Python code
```shell
forge shell
```
This will open a Python shell with all the necessary environment variables set up.

You can also run:
```shell
forge shell my-service
```
This will open a Python shell with the environment variables of `my-service` service set up.
You can also send messages to other services pretending to be that service.

### Running custom shell commands
```shell
forge run-command some shell command
```
This will run "some shell command" as a shell command, with all the necessary environment variables set up.
