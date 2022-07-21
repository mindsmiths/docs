---
sidebar_position: 4
---

# Deployment to production

## Production and sandbox environment

Production is an environment with a fully working system for real users.

Apart from production we also provide dynamic sandbox environments. Sandbox environemnt is used to test your system before deploying it to production. Sandbox is run on the same architecture as production, but it has no production data and secrets.

Both production and sandbox are deployed to our server. We use the Kubernetes architecture, but you don't have to worry about it. We manage everything regarding infrastructure.

## Deployment setup

In this part we will set everything up to enable deployment of your code on our sandbox or production directly from your Mindsmiths web IDE. For that to be possible our CI server (GitLab CI/CD) that is responsible for deployment needs access to your git project. Your Mindsmiths web IDE also has to be connected with our CI server to enable deployment directly from the web IDE.

You will need to follow this three steps below:

> 1. [Send us your git clone URL](#send-us-your-git-clone-url)
> 2. [Add Deployment key](#add-deployment-key)
> 3. [Connect your Mindsmiths web IDE with our CI server](#connect-your-mindsmiths-web-ide-with-our-ci-server)

### 1. Send us your git clone URL

For us to be able to clone and deploy your code to sandbox or productino we need your ssh git clone URL. 

1. Go to front page of your git repo
2. Click `Clone`
3. Copy the `SSH` URL and send it to our Mindsmiths developers

### 2. Add Deployment key

Deployment key is used to grant our CI server read access to your project for us to be able to clone it. Your code is stored temporarily, only for deployment purposes.

Jump to section [Set up GitHub](#setup-github) or [Set up GitLab](#setup-gitlab), depending on what you use for your repo.

#### 2.a) Adding Deployment key to your Github project

1. You should receive your Deployment key (it is public ssh key that ends with `.pub`) from us, so contact us if you haven't already
2. Open your GitHub repository and click on `Settings`
3. Under `Security` open the `Deploy keys` tab
4. Click on `Add deploy key`
5. Paste the public ssh key from step 1 in the `Key` field. For `Title` put `Mindsmiths GitLab` and add the key.
6. `Allow write access` should be unchecked

Our CI server can now pull your repo and deploy it. You can proceed to [Set up your Mindsmiths code environment](#setup-your-mindsmiths-code-environment)

#### 2b. Adding Deployment key to your Gitlab project

1. You should receive your Deployment key (it is public ssh key that ends with `.pub`) from us, so contact us if you haven't already
2. Open your GitLab project and click on `Settings`
3. On the left panel, click on settings for `Repository` and expand `Deploy keys`
4. Paste the public ssh key from step 1 in the `Key` field. For `Title` put `Mindsmiths GitLab` and add the key.
5. `Grant write permissions to this key` should stay unchecked

Our CI server can now pull your repo and deploy it. You can proceed to [Set up your Mindsmiths code environment](#setup-your-mindsmiths-code-environment)

### 3. Connect your Mindsmiths web IDE with our CI server

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
3. Run `forge deploy`. **Make sure that local changes are pushed to git before deploying**


### Deploying production

1. Switch to the default repo branch. Only the default repo branch (usually `main`) can be deployed to production.
2. [Set up deploy values](#setup-deploy-values) for the branch, if you haven't already
3. Run `forge deploy`. **Make sure that local changes are pushed to git before deploying**

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
