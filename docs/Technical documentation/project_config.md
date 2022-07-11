# Project config

Files specifying project configuration are located in `config` directory.

The directory consists of:
- charts
- dockerfiles
- manifests
- templates
- config.yaml
- (optional) local.config.yaml
- (optional) sandbox.config.yaml
- (optional) production.config.yaml

## Charts

This is the place for Helm charts. Every file/directory will be deployed to cluster by `Deploy charts`.

At this point all charts must be manually added to this directory.

Every directory should have the following structure:
- meta.yaml
  - `REPO_URL`
  - `REPO_NAME`
  - `CHART_NAME`
  - `CHART_VERSION`
- values.yaml
- (optional) production.values.yaml
- (optional) sandbox.values.yaml

Values files are templated before deploying. You can put `{{ env.VARIABLE }}` to read env variables from CI/CD variables.

Charts are deployed with `helm upgrade -f ${file}`.

## Dockerfiles

This is the place for Dockerfiles. `Generate manifests` will place generated Dockerfiles here.

You are free to put your custom Dockerfiles here. `Build manifests` will build images from these files.

## Manifests

This is the place for Kubernetes manifests. Every file (except README.md) will be deployed to cluster by `Deploy manifests`.

`Generate manifests` will place generated manifests here.

You are free to put your custom manifests here. They are applied with `kubectl apply -f ${file}`.

## Templates

This is the place for templates used by CI to generate manifests. Structure of this directory is:
- dockerfiles
- manifests

Forge already has templates built-in, but you can override them here.

## Config

Final project config is built depending on environment type (module). `config.yaml` is overwritten by either:
- `local.config.yaml` for local run
- `sandbox.config.yaml` for sandbox deployment
- `production.config.yaml` for production deployment

### `global`

The following keywords are applied globally accros the project and its services.

#### `dependecies`

- `python` - packages and files that will be added to all python Dockerfiles

For example:

```yaml
global:
  dependencies:
    python:
      - forge-sdk==3.0.0
      - forge-cli==3.0.0
```

#### `env`

Dictionary of variables that will be deployed to cluster as a configmap and available in all services.

In format `VARIABLE_KEY: value` like this:

```yaml
global:
  env:
    MONGO_CLIENT_USERNAME: root
```

#### `secrets`

Dictionary of secret variables that will be deployed to cluster as a secret and available in all services. At this point secrets are weakly protected with `base64`.

#### `backups`

Backups are global and available for:
- mongo
- postgres
- redis

You should also set cron expression for any backup you enable. The different projects running on the same cluster should not have backups at the same time to minimize cluster load.

Enable backups like this:

```yaml
global:
  mongo:
    enabled: true
    cron: "5 4 * * *"
```

For determining cron expressions look here: [Crontab.guru](https://crontab.guru/)

### `services`

Configurations of individual services:

```yaml
services:
  auth-handler:
    ...
  gatekeeper:
    ...
```

#### a service

Every service should have defined these keywords:
- `type` - programming language
- `resources:cpu`
- `resources:memory`

Other keywords are:
- `enabled` - either `true` or `false`
- `version`
- `image`
  - `static` - set `true` if service is built on its repo
- `env` - dictionary of variables
- `dependencies` - packages or files
- `db`
  - `mongo` - either `true` or `false`
  - `postgres:name` - setting postgres db name enables postgres
  - redis is always available
- `package`
- `subservice`
- `command`
  - `run`
- `collectstatic`
- `exposed` - set `true` if service should be open to the outside world
- `https` - set `true` if you need a secure connection
- `host`
- `port`

Here are a few examples that should clarify things better:

#### go service built on its repo
```yaml
gatekeeper:
  type: go
  version: 3.0.0
  image:
    static: true
  db:
    mongo: true
  env:
    GATEKEEPER_TARGET: intent_recognizer
  resources:
    cpu: 50m
    memory: 300Mi
```

#### pyton service built on a project repo
```yaml
intent-recognizer:
  type: python
  version: 3.0.0
  env:
    INTENT_RECOGNIZER_TARGET: gatekeeper
  dependencies:
    - user-manager
  resources:
    cpu: 50m
    memory: 80Mi
```

#### django service built on a project repo
```yaml
dashboard:
  type: django
  version: 3.0.0
  https: true
  db:
    postgres:
      name: dashboard
  dependencies:
    - user-manager
    - user-summary-handler
  env:
    DJANGO_SUPERUSER_USERNAME: admin
    DJANGO_SUPERUSER_PASSWORD: {{ env.DASHBOARD_ADMIN_PASSWORD }}
    SECRET_KEY: STILLKEYLIKENOOTHER
  resources:
    cpu: 50m
    memory: 80Mi
```

#### java service built on a project repo
```yaml
edu-bayes:
  type: java
  dependencies:
    - services/edu_bayes/
  env:
    LICENSE: '{{ env.BAYES_SERVER_LICENSE }}'
  resources:
    cpu: 250m
    memory: 750Mi

```
