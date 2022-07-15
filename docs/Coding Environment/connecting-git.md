---
sidebar_position: 2
---

# Connecting your git repo

Before you begin with coding, you should connect your environment to your git repo. You can use your GitHub or GitLab account, so please create one if needed.

We'll do this in just a couple easy steps.
If you are more developers collaborating on the same project, the process differs slightly for the person setting up the project on their GitHub/GitLab, but we'll describe each process in turn.

Let's start!

## Initial repo setup

We start with connecting your GitHub account:
1. First we need to create the SSH key:
   - At the top bar, choose Terminal > New Terminal and run this command:
```commandline
    ssh-keygen -t ed25519 -C "your_email@example.com"
```
   - Make sure to adapt the email address
   - You can just press ENTER for all questions that follow
2. Next you need to add the public key you just created to your GitHub. **Don't worry, public part of the SSH key can be seen by everyone, it's not a secret!**
   - Run the following command and copy the output:
```commandline
    cat /root/.ssh/*.pub
```
    - Go to this [link](https://github.com/settings/ssh/new) and paste in the public key you copied under the "Key" section
    - Feel free to set the "Title" to whatever you want, but we recommend something intuitive, e.g. "project_name-mindsmiths"

Great! Now that your account is connected, it's time to connect your git repo.
If you don't have the repo yet, first [create](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) one for your project.
1. Run `git init` in the Terminal to initialize a git repo
2. Set the email and username: run the following command, adapting the credentials
```commandline
    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"
```
3. Now add the remote: just copy the SSH from your repository (example: git@github.com:Name/first_repo.git)
`git remote add origin git@github.com:<github_username>/<github_repo_name>`

4. As a final step, just push all the files to the repo (make sure to type "yes" when prompted after you push):
```commandline
    git add .
    git commit -m "First commit: pushed all the Mindsmiths initial repo files"
    git push --set-upstream origin master
```
That's it! Your git is now connected connected. The same process can also be applied for GitLab.

## Connecting to an existing repo
TODO

### Directory structure: quick reference
The main directories are the following:
- config: directory containing all the configuration files
- models: symlink to the directory containing the agent models
- rules: symlink to the directory divided into subdirectories with the names of the agents you define. The rules referring to each agent are inside the respective subdirectories (e.g. rules/smith/Heartbeat.drl).
- services: directory containing all services you add to the platform. In the initial phase contains only the rule engine service.
