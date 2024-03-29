---
sidebar_position: 2
---

# Migration guide


## [1.5.5 -> 1.6.0] - 2023-04-11
Estimated migration time: 5 minutes

### Project template
1. Create a new empty file `services/control_panel/configuration.yaml` (create the directory)
2. Add the following lines to `config/config.yaml`:
```yaml
services:
  ...
// highlight-added-start
  control-panel:
    type: django
    version: 0.0.1
    https: true
    db:
      postgres: true
    image:
      static: true
    env:
      DJANGO_SUPERUSER_USERNAME: admin
      DJANGO_SUPERUSER_PASSWORD: '{{ env.CONTROL_PANEL_ADMIN_PASSWORD | default("admin") }}'
      SITE_URL: '{{ "control-panel." + env.get("HOST_DOMAIN", "") }}'
      INTERNAL_SITE_URL: http://control-panel
      SECRET_KEY: KiOx1YWV1AaDdXmj6PdiFdsXi9iiGUghYskxeUxAQSAEODkB4E
      REPO: 'https://commit-bot:{{ env.COMMIT_TOKEN }}@{{ env.get("CI_REPOSITORY_URL", "").split("@")[1] }}'
      BRANCH: '{{ env.CI_COMMIT_BRANCH }}'
      DATA_HASH: '{{ file_hash("services/control_panel/configuration.yaml") }}'
    resources:
      cpu: 25m
      memory: 150Mi
// highlight-added-end
```
3. Add the following lines to `config/local.config.yaml`:
```yaml
global:
  env:
    ...
    REDIS_CLIENT_HOST: {{ env.REDIS_CLIENT_HOST }}
    REDIS_CLIENT_PORT: {{ env.REDIS_CLIENT_PORT }}

// highlight-added-line
    INTERNAL_CONTROL_PANEL_URL: '{{ env.CONTROL_PANEL_URL | default("http://localhost:8100", true) }}'

...

services:

// highlight-added-start
  control-panel:
    port: 8100
    env:
      SITE_URL: '{{ env.CONTROL_PANEL_URL | default("http://localhost:8100", true) }}'
// highlight-added-end
```
4. Add the following lines to `config/production.config.yaml` **and** `config/sandbox.config.yaml`:
```yaml
// highlight-added-start
services:

  rule-engine:
    env:
      JDK_JAVA_OPTIONS: -XX:MaxHeapSize=300M
// highlight-added-end
```
5. Run `forge init`


## [1.5.4 -> 1.5.5] - 2023-03-29
Estimated migration time: 1 minute

### Project template
Add the following line to `services/rule_engine/pom.xml`:
```xml
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.0.0-M7</version>
        <configuration>
            <systemPropertyVariables>
                // highlight-added-line
                <projectSlug>YOUR_PROJECT_SLUG</projectSlug>
                <buildDirectory>${project.build.directory}</buildDirectory>
            </systemPropertyVariables>
        </configuration>      
    </plugin>
```
You can find the project slug in your `config.yaml` under `PROJECT_SLUG`.



## [1.5.0 beta -> 1.5.0] - 2022-12-21
Estimated migration time: 5 minutes

### Project template
- Update versions in `config/config.yaml` and all `pom.xml` files:
  - `forge-sdk==5.0.0` (Python)
  - `forge-sdk==5.0.0` (Java)
  - `forge-cli==5.0.0`
  - `rule-engine==5.0.0`
  - `heartbeat==5.0.0`
  - `cecs==5.0.0`
  - update other services to versions compatible with SDK 5.0 (probably also `5.0.0`)
  - you can look at the new project config template for reference (https://github.com/mindsmiths/platform-resources/blob/main/project_template/%7B%7Bcookiecutter.project_repo_name%7D%7D/config/config.yaml)
- In your `.gitlab-ci.yml` change the ref from `v4.x` to `v5.x`
- Remove `__init__.py` and `setup.cfg`
- Update the Makefile according to the newest version: https://github.com/mindsmiths/platform-resources/blob/main/project_template/%7B%7Bcookiecutter.project_repo_name%7D%7D/Makefile

### Mitems
If you're using Mitems, you'll need to update the config:
- Update the version to 5.0.1 or higher
- Change `COMMIT_TOKEN` to `DATA_HASH`
- Change `REPO` env variable from:
```yaml
  mitems:
    ...
    env:
      ...
      COMMIT_TOKEN: '{{ env.COMMIT_TOKEN }}'
      REPO: '{{ env.CI_REPOSITORY_URL }}'
...
```
to:
```yaml
  mitems:
    version: 5.0.1
    ...
    env:
      ...
      REPO: 'https://commit-bot:{{ env.COMMIT_TOKEN }}@{{ env.get("CI_REPOSITORY_URL", "").split("@")[1] }}'
      DATA_HASH: '{{ file_hash("services/mitems/data.json") }}'
...
```
Alternatively, put the URL of your repo with the appropriate credentials, so that Mitems has rights to clone and push to the repo.



## [1.4 -> 1.5.0 beta] - 2022-10-19
Estimated migration time: 1 day

### API Gateway
- rename usages of "Forge API" to "API Gateway"
- change usage of the path `/signal/{from}/{to}/{type}` to either `/message/{to}` or `/message/{to}/{type}`
- change usage of the path `/event/{from}/{type}` to either `/event` or `/event/{type}`

### Heartbeat
- remove the config for `heartbeat-sender` and rename `heartbeat-scheduler` to `heartbeat`

### Rule Engine
- add `resources/META-INF/kmodule.xml`
- replace `extends Signal` with either `extends Message` or `extends Event`, and remove `@DataModel`
- data models should implement `Serializable` and be annotated with `@DataModel`
- replace `addListener` with `registerForChanges`
- replace `Signals.on` with either `Events.on` or `DataChanges.on`
- you can remove the `(connectionName, connectionId)` constructor in your agents if you're using `getOrCreateByConnection` and just call the empty constructor
- replace `agent-created` with `signals`
- use `LocalDateTime` instead of `Date`
- replace `DataUtils` with `Database`

### Custom services
- in the `api_builder` rename `service_name` to `service_id`
- replace `DBModel` with `[Emittable]DataModel`, remove `DBView`s
- add `async` to API methods
- if you're using any global or service-level variables, make sure they are asyncio-safe
- replace `forge.core.api.BaseAPI` with `from forge.core.api.base import BaseAPI`
- replace `forge.core.api.api_interface` with `forge.core.api.decorators.api_interface`
- replace `forge.utils.datetime_helpers` with `forge.utils.datetime`

### Django services
- you may need to use `await sync_to_async(lambda: YourModel(...).save())()` or `await sync_to_async(_my_inline_function)()` - Django is still working on full async support in their ORM

### Java clients
- replace "Payload" classes with classes that extend `Message`
- replace `...BaseMessage(type, new ...Payload(...)).send()` with `new [ApiMessage](....).send(serviceId)`
- replace `topic = Messaging.getInputTopicName("{service}")` with `serviceId = "{service}"`

### Database
- in `ruleEngineDB.summary` move all facts from document root to `facts.{...}`

### If something is still not working
- try shouting "Livac!"
