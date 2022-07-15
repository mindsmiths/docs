---
sidebar_position: 1
---

# Project structure

The basic project structure consists of the following:
- `config`: directory containing config files
- `services`: directory containing all services organized in subdirectories
- `.env`: file for specifying env variables
- `Makefile`
- `reset.sh`

You can add any custom services you want (see under Services TODO: link). Here we'll introduce you to the config.

## Project config

Files specifying project configuration are located in the `config` directory.

The directory consists of:
- charts
- dockerfiles
- manifests
- templates
- config.yaml
- (optional) local.config.yaml
- (optional) sandbox.config.yaml
- (optional) production.config.yaml

### Charts

This is where you put the Helm charts. Every file/directory will be deployed to cluster by `Deploy charts`.

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

The values files are templated before deploying. You can put `{{ env.VARIABLE }}` to read env variables from CI/CD variables.

Charts are deployed with `helm upgrade -f ${file}`.

### Dockerfiles

This is the place for Dockerfiles. `Generate manifests` will place the generated Dockerfiles here.

You are also free to put your custom Dockerfiles here. `Build manifests` will build images from these files.

### Manifests

This is the place for Kubernetes manifests. Every file (except README.md) will be deployed to cluster by `Deploy manifests`.

`Generate manifests` will place the generated manifests here.

You are free to add your custom manifests here. They are applied with `kubectl apply -f ${file}`.

### Templates

Here are the templates used by the CI to generate manifests. The structure of the directory is:
- dockerfiles
- manifests

The platform already has templates built-in, but you can override them here.

### Config files

The final project config is built depending on the environment type (module). `config.yaml` is overwritten by either:
- `local.config.yaml` for local runs
- `sandbox.config.yaml` for sandbox deployment
- `production.config.yaml` for production deployment

##### `global`

The following keywords are applied globally across the project and its services:

###### `dependecies`

- `python` - packages and files that will be added to all python Dockerfiles

For example:

```yaml
global:
  dependencies:
    python:
      - forge-sdk==4.0.0
      - forge-cli==4.0.0
```

###### `env`

Dictionary of variables that will be deployed to cluster as a configmap and available in all services.

Written in `VARIABLE_KEY: value` format, e.g.:

```yaml
global:
  env:
    MONGO_CLIENT_USERNAME: root
```

###### `secrets`

Dictionary of secret variables that will be deployed to cluster as a secret and available in all services. At this point, secrets are weakly protected with `base64`.

###### `backups`

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

You can check how to determine cron expressions here: [Crontab.guru](https://crontab.guru/)

###### `services`

Contains configurations of individual services:

```yaml
services:
  intent-recognizer:
    ...
  rule-engine:
    ...
```

###### service

Every service should have these keywords defined:
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

Here are a few examples to clarify things:

###### go service built on its repo
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

###### pyton service built on a project repo
```yaml
  telegram-adapter:
    type: python
    version: 4.0.0
    db:
      mongo: true
    env:
      TELEGRAM_BOT_TOKEN: "{{env.TELEGRAM_BOT_TOKEN}}"
    resources:
      cpu: 81m
      memory: 130Mi
```

###### django service built on a project repo
```yaml
  dashboard:
    type: django
    collectstatic: true
    exposed: true
    db:
      postgres: true
    env:
      DJANGO_SUPERUSER_USERNAME: admin
      DJANGO_SUPERUSER_PASSWORD: '{{ env.DASHBOARD_ADMIN_PASSWORD }}'
      SECRET_KEY: STILLKEYLIKENOOTHER
    dependencies:
      - django==3.2.10
      - django-environ==0.8.1
      - rule-engine-api==4.0.0
    resources:
      cpu: 146m
      memory: 184Mi
```

###### java service built on a project repo
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
