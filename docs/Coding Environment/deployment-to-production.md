---
sidebar_position: 4
---

# Deployment to production

Production is an environment with a fully working system for real users. Apart from production we also provide dynamic sandbox environments.
Sandbox environemnt is used to test your system before deploying it to production.

Both production and sandbox are deployed to our server. We use Kubernetes architecture, but you don't have to worry about, as we manage everything regarding infrastructure.

## Setup

Production and sandbox are deployed by our CI server (GitLab CI/CD). This means that our CI server needs access to your git repository in order to clone it and deploy it.

Please proceed to section [Setup GitHub](#setup-github) or [Setup GitLab](#setup-gitlab), depending on what you use for your repo.

### Setup GitHub

1. You should have received public ssh key (ends with `.pub`) from us
2. Open your GitHub repository and click on `Settings`
3. Under `Security` open the `Deploy keys` tab
4. Click on `Add deploy key`
5. Paste the public ssh key from step 1 in the `Key` field. For `Title` put `Mindsmiths GitLab` and add the key.
6. Send clone URL to Mindsmiths developers
    1. Go to front page of your repo
    2. Click `Code` and then `SSH`
    3. Copy the URL and send it

Our CI server can now pull your repo and deploy it. You can proceed to [Setup your Mindsmiths code environment](#setup-your-mindsmiths-code-environment)

### Setup GitLab

1. You should have received public ssh key (ends with `.pub`) from us
2. Open your GitLab project and click on `Settings`
3. On the left panel, click on settings for `Repository` and expand `Deploy keys`
4. Paste the public ssh key from step 1 in the `Key` field. For `Title` put `Mindsmiths GitLab` and add the key.
5. Send clone URL to Mindsmiths developers
    1. Go to front page of your repo
    2. Click `Clone`
    3. Copy the `SSH` URL and send it

Our CI server can now pull your repo and deploy it. You can proceed to [Setup your Mindsmiths code environment](#setup-your-mindsmiths-code-environment)

### Setup your Mindsmiths code environment

1. In your code environment add `.credentials` file under project root. We will send you the credentials you need. It looks like this:
```bash
[DEFAULT]
MINDSMITHS_GITLAB_URL=https://git.mindsmiths.com/
MINDSMITHS_GITLAB_PROJECT_ID=123
MINDSMITHS_GITLAB_ACCESS_TOKEN=abc123
MINDSMITHS_GITLAB_PIPELINE_TOKEN=def456
```

Great, now your environment can communicate with our CI server (we use GitLab CI). You can now deploy your project.

## Deploying

### Deploying sandbox

1. Switch to `uc/` branch. Branches that are deployed to sandbox must have names that begin wih `uc/`. Every `uc/` branch has its own sandbox
2. [Setup deploy values](#setup-deploy-values) for the branch, if not already
2. Run `forge deploy`. **Make sure that local changes are pushed before deploying**


### Deploying production

1. Switch to the default repo branch. Only the default repo branch (usually `main`) can be deployed to production.
2. [Setup deploy values](#setup-deploy-values) for the branch, if not already
3. Run `forge deploy`. **Make sure that local changes are pushed before deploying**

### Setup deploy values

Deploy values are variables that are deployed with your sandbox or production. For example, one of the variables could be `TELEGRAM_BOT_TOKEN`.

Before deploying sandbox or production, you need to set these values. We store them on our CI server. Every branch has its own values. Once a user sets values for a branch, other users don't have to set them again for that branch. Of course, you can update values at any time.

To setup deploy values:
1. Make sure you are on the desired branch
2. Run `forge update-values`
3. Update values, save and exit
4. Press enter in the terminal to upload values to our CI server
5. You can now deploy the branch

