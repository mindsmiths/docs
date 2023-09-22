---
sidebar_position: 1
---

# Project structure

The basic project structure consists of the following:
- `config`: project configuration
- `services`: contains custom project-specific services (see [Platform architecture](/docs/platform/guides/service-creation)) 
- `.env`: contains secrets and developer-specific as environment variables
- [other files you can ignore]

## Project configuration

Files specifying project configuration are located in the `config` directory.

The directory consists of:
- `config.yaml` - the main project configuration (see [Config file](#configuration-files))
- (optional) `local.config.yaml` - allows overriding parts of `config.yaml` in a local development environment
- (optional) `sandbox.config.yaml` - allows overriding parts of `config.yaml` in a sandbox environment
- (optional) `production.config.yaml` - allows overriding parts of `config.yaml` in production
- `charts/` - Helm charts to deploy in production (see [Charts](#charts))
- (optional) `dockerfiles/` - allows overriding/extending dockerfile for a specific service
- (optional) `manifests/` - Kubernetes manifests to deploy in production
- (optional) `templates/` - allows overriding default templates for dockerfiles and manifests


## Configuration files
The main project configuration can be found at `config/config.yaml`.

The final project configuration depends on the current environment type - `config.yaml` is merged with:
- `local.config.yaml` for local runs
- `sandbox.config.yaml` for sandbox deployment
- `production.config.yaml` for production deployment

You can use Jinja2 template structures inside these files, and they will be rendered before running.
You can use the `env` variable which will contain the system's environment variables and everything you've specified
in the `.env` file.

### Specification

```yaml
# These settings are applied to *every* service
global:
  env: Dict[str, Optional[str]]
  secrets: Optional[Dict[str, Optional[str]]]
  dependencies:
    python: List[str]
  backups:
    [mongo|postgres|redis]:
      enabled: bool = true  # true in production, false otherwise
      cron: str = "0 0 * * * *"
  cecs:
    enabled: bool = true
    params: str = ""
  repository: str = ""  # internal dockerfile repository

services:
  service-name:
    type: python|django|go|java
    version: Optional[str]
    
    package: Optional[str]
    subservice: Optional[str]

    env: Optional[Dict[str, Optional[str]]]
    command:
      build: Optional[str]
      test: Optional[str]
      run: Optional[str]
      cwd: Optional[str]
      skipDependencyCheck: bool = False
    image:
      static: bool = False
      repository: Optional[str]
      name: Optional[str]
      tag: Optional[str]
      dockerfile: Optional[str]
    replicas: int = 1

    db:
      mongo: bool = False
      postgres: bool = False
      redis: bool = False
    dependencies: List[str] = []

    enabled: bool = True
    resources:
      cpu: str
      memory: str

    deploymentStrategy: Optional[DeploymentStrategy]
    deploymentSelectors: Optional[Dict[str, str]]
    dontDeployWith: Optional[List[str]]

    exposed: bool = False  # True for type=django
    host: Optional[str]
    port: int = 8000
    https: bool = False
  ...
```

Example:
```yaml
global:
  env:
    MY_ENV_VAR: "my_value"
  secrets:
    MY_SECRET_VAR: {{env.MY_SECRET_VAR}}
  dependencies:
    python:
      - forge-sdk==4.0.0
  backups:
    mongo:
      enabled: true
    redis:
      enabled: false
  cecs:
    params: "-e venv"
  repository: "my.nexus.net"
  
services:
  my-custom-python-service:
    type: python
    resources:
      cpu: 100m
      memory: 100Mi
  
  my-custom-django-service:
    type: django
    db:
      postgres: true
    dependencies:
      - django~=3.2.0
      - django-environ~=0.7
      - django-import-export~=2.8
      - django-jet-reboot~=1.3.1
      - psycopg2-binary~=2.9.0
      - gunicorn~=20.1.0
    env:
      DJANGO_SUPERUSER_USERNAME: admin
      DJANGO_SUPERUSER_PASSWORD: '{{ env.ADMIN_PASSWORD | default("admin") }}'
      SITE_URL: '{{ env.MY_CUSTOM_DJANGO_SERVICE_URL }}'
      INTERNAL_SITE_URL: "http://my-custom-django-service"
      SECRET_KEY: of4928ffI#UR(@#HRf923efij20r3
    resources:
      cpu: 100m
      memory: 300Mi
  
  telegram-adapter:
    type: python
    version: 4.0.0a10
    db:
      mongo: true
    env:
      TELEGRAM_BOT_TOKEN: "{{env.TELEGRAM_BOT_TOKEN}}"
    resources:
      cpu: 81m
      memory: 130Mi
```

## Charts
This is where you put the Helm charts. Every subdirectory will be deployed to production.

Every directory should have the following structure:
- `meta.yaml`
  - `REPO_URL`
  - `REPO_NAME`
  - `CHART_NAME`
  - `CHART_VERSION`
- `values.yaml`
- (optional) `production.values.yaml`
- (optional) `sandbox.values.yaml`

The values files are templated before deploying. You can put `{{ env.VARIABLE }}` to read env variables from CI/CD variables.

### Dockerfiles
🚧 Under construction 🚧

### Manifests
🚧 Under construction 🚧

### Templates
🚧 Under construction 🚧
