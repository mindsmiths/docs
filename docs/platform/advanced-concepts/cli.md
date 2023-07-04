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



## Changelog


### [5.1.3] - 2023-07-04

#### Added
- support for Python 3.11 (requires `forge-sdk>=5.1.1`)


### [5.1.2] - 2023-06-26

#### Fixed
- sometimes other services would accidentally pick up environment variables from the current service


### [5.1.1] - 2023-06-20

#### Added
- `forge check` command which runs CECS checks on the project
- `cecs` is now a dependency of `forge-cli` so no need to install it separately


### [5.1.0] - 2023-06-09

#### Changed
- `https` is `True` by default (❗BREAKING)

#### Added
- `--enabled` option to `forge get-services` to get only enabled services


### [5.0.13] - 2023-05-18

#### Fixed
- bug where get_image_name function would return wrong name for specific images


### [5.0.12] - 2023-05-18

#### Fixed
- bug where ENVIRONMENT variable wouldn't get loaded in get_image_name function


### [5.0.11] - 2023-05-16

#### Changed
- saving production and sandbox images in separate folders


### [5.0.10] - 2023-04-25

#### Fixed
- hang after a failed build

#### Changed
- `build` shows a clearer result message


### [5.0.9] - 2023-04-11

#### Fixed
- specifying only `cpu` or `memory` limits in config now works
- when build fails the error message is printed to the console


### [5.0.8] - 2023-03-27

#### Fixed
- bug where `forge` could sometimes only be run from the root of the project
- correctly rebuilds Java services even when `autobuild` in VS Code is enabled
- rebuilding API clients even for disabled services because of dependencies from other services

#### Added
- defining service limits in config
- `send-heartbeat`, `delete-agent` and `remove-pending-signals` now accept multiple agent IDs


### [5.0.7] - 2023-03-02

#### Fixed
- `set-fake-now`, `reset-fake-now` and `delete-topics` commands can now be run in sandbox environments


### [5.0.6] - 2023-02-23

#### Added
- `forge remove-pending-signals` to remove pending signals from an agent


### [5.0.5] - 2023-02-10

#### Added
- `forge run` and `forge run-service` now check if there's a hanging service process and kill it before proceeding
- `forge kill` to kill all hanging processes


### [5.0.4] - 2023-01-27

#### Fixed
- `forge run` doesn't build excluded services
- build doesn't crash if there's an empty `clients/java/` folder
- logs are streamed live into `forge.log`

#### Added
- `forge run` got the `-ll/--log-level` option


### [5.0.3] - 2023-01-24

#### Changed
- config, dockerfiles and manifests are now rendered with the basic set of built-in values and filters (`project`, `env`, `os`, `json`, `read_file`, `file_hash`, `b64encode` and `b64decode`)


### [5.0.2] - 2023-01-16

#### Fixed
- `consume-message` command
- commands that send messages or events no longer need to sleep in order for messages to be flushed

#### Added
- `produce-message` now has `--num-messages` option


### [5.0.1] - 2023-01-05

#### Added
- `create-agent` command that makes it easier to create new agent types
- `new-agent`, `update-agent`, `delete-agent`, `send-heartbeat` commands that make it easier to manage agents
- `send-event`, `send-message` and `send-agent-message` commands for manual interaction with the platform
- `list` and `add-service` commands that use the central service registry (experimental)

#### Changed
- `create-project` now accepts project name as an argument
- `Secrets` utility for changing the `.env` file now handles comments correctly


### [5.0.0] - 2022-12-09

#### Changed
- releasing stable version, compatible with SDK 5.0


### [5.0.0b5] - 2022-12-08

#### Changed
- `generate_deployment` allows overriding manifests in the project


### [5.0.0b4] - 2022-11-24

#### Changed
- `get_services` command now returns the full list of services (including disabled services)  


### [5.0.0b3] - 2022-11-15

#### Fixed
- loading env variables that are in JSON form
- availability of commands inside/outside a project and in production (eg. `unlock-agents`) 

#### Added
- commands `unlock-agents` and `lock-agents` have the option `--all`


### [5.0.0b2] - 2022-11-07

#### Added
- `get_mongo_databases` command


### [5.0.0b1] - 2022-11-06

#### Changed
- django services are run by default like `<service-name> runserver` instead of `<service-name>-admin runserver`


### [5.0.0b0] - 2022-10-19

#### Changed
- compatible with SDK 5.0 beta


### [5.0.0a4] - 2022-10-17

#### Fixed
- `build` command would hang when build fails
- loading `.env` values


### [5.0.0a3] - 2022-10-11

#### Fixed
- loading settings


### [4.0.0a29] - 2022-10-14

#### Fixed
- loading `.env` values


### [4.0.0a28] - 2022-10-11

#### Fixed
- loading settings
- `.env` is loaded only when rendering config


### [4.0.0a27] - 2022-09-19

#### Changed
- `build` now intelligently detects which services to build and does so in the correct order of dependencies with
maximum concurrency
- moved preparing databases and doing migrations from the `build` stage to the `run` stage

#### Added
- `--rebuild` flag to `build` and `build-service`


### [4.0.0a26] - 2022-09-13

#### Changed
- compatible with CI v4
- database creation, migrations, and API client builds are now done in the `build` stage

#### Added
- `forge` now automatically sets the following environment variables:
  - `SERVICE_NAME`, `SERVICE_PACKAGE_NAME`, `SERVICE_VERSION`
  - `MONGO_DATABASE_NAME`, `POSTGRES_DATABASE_NAME`
  - `SERVICE_HOST` and `SERVICE_PORT`
- `--incude` and `--exclude` options in the `run` command
- `--cli` option in the `version` command

#### Fixed
- API clients are rebuilt only when their code changed
- the `shell` command now sets up the correct service environment 


### [4.0.0a25] - 2022-09-05

#### Fixed
- reverted changes from 4.0.0a24 to comply with new sdk version


### [4.0.0a24] - 2022-09-05

#### Fixed
- `reset` for Mongo databases now takes `ENVIRONMENT_NAME` into account


### [4.0.0a23] - 2022-08-26

#### Fixed
- incorrect bugfix where `run-service` wouldn't work in sandbox and production environments


### [4.0.0a22] - 2022-08-26

#### Fixed
- bug where `run-service` wouldn't work in sandbox and production environments


### [4.0.0a21] - 2022-08-20

#### Fixed
- bug where `upgrade` won't work if service isn't in `local.config.yaml`


### [4.0.0a20] - 2022-08-11

#### Added
- gitlab deployment credentials can now be specified in env or in `~/.mindsmiths/credentials`
- `deploy --reset` now also gives warning if local code isn't pushed to git

#### Fixed
- bug where `deploy` wouldn't detect non existing branch on git
- `create_service` won't crash if service in `local.config.yaml` doesn't have a port
- `create_service` won't crash if `local.config.yaml` is empty


### [4.0.0a19] - 2022-08-09

#### Changed
- `forge` now tries to find the config file recursively, which enables it to be called anywhere within the project subtree


### [4.0.0a18] - 2022-08-03

#### Added
- errors from `forge run` will now be logged in special file


### [4.0.0a17] - 2022-08-03

#### Changed
- discerning between CECs warnings (which will not cause a crash) and errors which will cause a crash


### [4.0.0a16] - 2022-08-01

#### Changed
- `deploy` now first checks if git branch exists and after if GitLab values are set
- pressing `Ctl+C` after pipeline was created in `deploy` no longer cancels the pipeline
- both `deploy` and `deployment-status` give more information about pipeline and deployment


### [4.0.0a15] - 2022-08-01

#### Changed
- when creating django services if config/local.config.yaml doesn't exist, it will be created
- when creating django services default port will be the first free port in range 8000-9000


### [4.0.0a14] - 2022-07-27

#### Added
- command `deployment-status` that shows all pods in current kubernetes namespace
- command `deployment-logs` that shows logs from the specified pod
- other deployment actions in `deploy` (suspend, remove, reset)

#### Changed
- empty Gitlab values in `deploy` are now error and not warning


### [4.0.0a13] - 2022-07-22

#### Changed
- `create-project` and `create-service` now get project templates via https instead of ssh


### [4.0.0a12] - 2022-07-20

#### Added
- fixed python imports on command `deploy` and `update-deployment-values`
- updated `deploy` to be able to detect if pipeline is pending


### [4.0.0a11] - 2022-07-19

#### Added
- command `deploy` that deploys code from git repo with our CI deployment pipeline
- command `update-deployment-values` that updates deployment values on Gitlab 


### [4.0.0a10] - 2022-07-07

#### Added
- command `run-command` that runs commands with forge env


### [4.0.0a9] - 2022-06-29

#### Fixed
- removed loggers from deployment commands to generate correct content on stdout 


### [4.0.0a8] - 2022-06-22

#### Added
- `create-project` and `create-service` accept extra fields added to cookiecutter

#### Changed
- `create-project` and `create-service` use cookiecutter from public GitHub
- upgraded dependencies


### [4.0.0a7] - 2022-05-19

#### Added
- Secret and ProjectXML utils


### [4.0.0a6] - 2022-04-13

#### Changed
- 'forge reset' now deletes databases instead of resetting them
- upgraded `forge-sdk` dependency


### [4.0.0a5] - 2022-03-29

#### Added
- added rebuilding rule engine on pom.xml change


### [4.0.0a4] - 2022-03-28

#### Added
- `forge install` installs local java APIs


### [4.0.0a3] - 2022-02-17

#### Fixed
- rule engine recompilation


### [4.0.0a2] - 2022-02-17

#### Fixed
- logs were sometimes breaking between lines


### [4.0.0a1] - 2022-02-09

#### Added
- all logs are saved by default in the `forge.log` file when using `forge run`
- logs are now colored when using `forge run`

#### Changed
- `forge run` is now responsible for doing the filtering determined by the `LOG_LEVEL` setting


### [4.0.0a0] - 2022-02-04

#### Changed
- compatible with 4.0


### [3.0.0b0] - 2022-01-17

#### Changed
- migrates to beta


### [3.0.0a41] - 2021-12-16

#### Added
- support for migration commands
- skipDependencyCheck


### [3.0.0a40] - 2021-12-21

#### Changed
- clearer error messages


### [3.0.0a39] - 2021-12-20

#### Changed
- `delete-topics` command forcefully deletes topics 


### [3.0.0a38] - 2021-12-03

#### Added
- `build` and `build-service` commands


### [3.0.0a37] - 2021-12-02

#### Changed
- `import_features` and `export_features` works only with Unleash4+


### [3.0.0a36] - 2021-12-01

#### Added
- support for https


### [3.0.0a35] - 2021-11-24

#### Fixed
- working with env variables that contain quotes and newlines


### [3.0.0a34] - 2021-11-23

#### Fixed
- working with env variables that contain quotes and newlines


### [3.0.0a33] - 2021-11-13

#### Added
- looking for service dockerfile in predefined paths
- hooks for generated dockerfiles

#### Fixed
- `reset` now sets env variables from config for each service when doing migrations


### [3.0.0a32] - 2021-11-12

#### Fixed
- django migrations now read `DJANGO_SUPERUSER_USERNAME` and `DJANGO_SUPERUSER_PASSWORD`


### [3.0.0a31] - 2021-11-11

#### Removed
- support for custom `wsgi` path in django projects in favour of command override


### [3.0.0a30] - 2021-11-11

#### Added
- support for custom `wsgi` path in django projects


### [3.0.0a29] - 2021-11-10

#### Fixed
- `run-service` in production


### [3.0.0a28] - 2021-11-10

#### Fixed
- `create_service` command


### [3.0.0a27] - 2021-11-09

#### Changed
- `forge shell` now supports service as an argument


### [3.0.0a26] - 2021-11-08

#### Changed
- use `git.mindsmiths.com`


### [3.0.0a25] - 2021-11-08

#### Fixed
- `forge upgrade` now supports subpackages


### [3.0.0a24] - 2021-11-06

#### Fixed
- `forge upgrade` now detects if user didn't define a package version


### [3.0.0a23] - 2021-11-05

#### Added
- `install` command


### [3.0.0a22] - 2021-11-05

#### Fixed
- CLI can now be used outside a project without throwing errors


### [3.0.0a21] - 2021-11-04

#### Added
- `upgrade` command

#### Changed
- `create_python_service` cookiecutter is up-to-date


### [3.0.0a20] - 2021-11-04

#### Added
- `get-services` command


### [3.0.0a19] - 2021-11-01

#### Removed
- `requirements.txt` support in cookiecutter


### [3.0.0a18] - 2021-10-31

#### Changed
- python dependency installation first resolves all packages and then does the install


### [3.0.0a17] - 2021-10-30

#### Fixed
- on problems with syntax in `.yaml` raise a descriptive error


### [3.0.0a16] - 2021-10-29

#### Removed
- cloud commands


### [3.0.0a15] - 2021-10-21

#### Fixed
- loading of settings when running services


### [3.0.0a9] - 2021-10-01

#### Added
- autocomplete for service names


### [3.0.0a8] - 2021-09-28

#### Changed
- added `click` for managing commands
- added `forge.conf.context` and `forge.conf.current_context`
- moved `Module` to project root
- removed `user_id` from message configuration
- removed dynamic loading of `settings`
- removed `SERVICE_NAME`, `PROJECT_SLUG`, `PROJECT_NAME` from `settings`

#### Added
- development environment commands for management and running


### [3.0.0a7] - 2021-09-27

#### Changed
- django services now use host `0.0.0.0` when running default runserver command


### [3.0.0a6] - 2021-09-24

#### Fixed
- `.env` not loading


### [3.0.0alpha0] - 2021-08-31

#### Added
- initial version
