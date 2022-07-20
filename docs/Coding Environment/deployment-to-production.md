---
sidebar_position: 4
---

# Deployment to production

## Production and sandbox environment

Production is an environment with a fully working system for real users.

Apart from production we also provide dynamic sandbox environments. Sandbox environemnt is used to test your system before deploying it to production. Sandbox is run on the same architecture as production, but it has no production data and secrets.

Both production and sandbox are deployed to our server. We use the Kubernetes architecture, but you don't have to worry about it. We manage everything regarding infrastructure.

## Setup

Production and sandbox are deployed by our CI server (GitLab CI/CD). This means that our CI server needs access to your git repository in order to clone it and deploy it.

Jump to section [Set up GitHub](#setup-github) or [Set up GitLab](#setup-gitlab), depending on what you use for your repo.

### Set up GitHub

1. You should receive a public ssh key (ends with `.pub`) from us, so contact us if you haven't already
2. Open your GitHub repository and click on `Settings`
3. Under `Security` open the `Deploy keys` tab
4. Click on `Add deploy key`
5. Paste the public ssh key from step 1 in the `Key` field. For `Title` put `Mindsmiths GitLab` and add the key.
6. Send clone URL to Mindsmiths developers
    1. Go to front page of your repo
    2. Click `Code` and then `SSH`
    3. Copy the URL and send it

Our CI server can now pull your repo and deploy it. You can proceed to [Set up your Mindsmiths code environment](#setup-your-mindsmiths-code-environment)

### Set up GitLab

1. You should receive a public ssh key (ends with `.pub`) from us, so contact us if you haven't already
2. Open your GitLab project and click on `Settings`
3. On the left panel, click on settings for `Repository` and expand `Deploy keys`
4. Paste the public ssh key from step 1 in the `Key` field. For `Title` put `Mindsmiths GitLab` and add the key.
5. Send clone URL to Mindsmiths developers
    1. Go to front page of your repo
    2. Click `Clone`
    3. Copy the `SSH` URL and send it

Our CI server can now pull your repo and deploy it. You can proceed to [Set up your Mindsmiths code environment](#setup-your-mindsmiths-code-environment)

### Set up your Mindsmiths code environment

1. In your code environment add `.credentials` file under project root. We will send you the credentials you need. It looks like this:
```bash
[DEFAULT]
MINDSMITHS_GITLAB_URL=https://git.mindsmiths.com/
MINDSMITHS_GITLAB_PROJECT_ID=123
MINDSMITHS_GITLAB_ACCESS_TOKEN=abc123
MINDSMITHS_GITLAB_PIPELINE_TOKEN=def456
```

Great, now your environment can communicate with our CI server. Congrats! You can now deploy your project.

## Deploying

### Deploying sandbox

1. Switch to a `uc/` branch. Branches that are deployed to sandbox must have names that begin wih `uc/`. Every `uc/` branch has its own sandbox
2. [Set up deploy values](#setup-deploy-values) for the branch, if you haven't already
3. Run `forge deploy`. **Make sure that local changes are pushed before deploying**


### Deploying production

1. Switch to the default repo branch. Only the default repo branch (usually `main`) can be deployed to production.
2. [Set up deploy values](#setup-deploy-values) for the branch, if you haven't already
3. Run `forge deploy`. **Make sure that local changes are pushed before deploying**

### Set up deploy values

Deploy values are variables that are deployed with your sandbox or production. For example, one of the variables could be `TELEGRAM_BOT_TOKEN`. Variables are specific to the environment. This means you cannot use the same Telegram bot for local development and production deployment. In this case, you would have one bot for your local development, one for your sandbox deployment and one for production deployment. If the clashing of multiple instances running doesn't cause any issues for the variable, you can re-use them for different environments if you want to.

You need to set these values before deploying sandbox or production. We store them on our CI server. Every branch has its own values. Once a user sets values for a branch, other users don't have to set them again for that branch. Of course, you can update values at any time.

To set up deploy values:
1. Make sure you are on the desired branch
2. Run `forge update-deployment-values`
3. Update values with `export key='value'` (Every export statement has to be in a new line)
4. Save (Ctrl+o) and Exit (Ctrl+x)
5. Press ENTER in the terminal to upload values to our CI server
6. You can now deploy the branch
