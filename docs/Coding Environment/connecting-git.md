---
sidebar_position: 2
---

# Connecting your git repo

The first thing to do should be connecting the environment to your git repo. For this you will need a GitHub account, so please create one if needed.  


Now we can connect this Mindsmiths environment with the GitHub account you have or you just created. To do that follow these steps this:
1. Open terminal and run this command to create the SSH key and just press ENTER on all of the questions: `ssh-keygen -t ed25519 -C "your_email@example.com"` (change your_email@example.com with your email)
2. Run `cat /root/.ssh/*.pub` and copy the public key you just created - **Don't worry, public part of the SSH key can be seen by everyone, it's not a secret!**
3. Go to this [link](https://github.com/settings/ssh/new) (takes you to the GitHub's page for adding new SSH key) and paste the public key you copied under the "Key" part
4. You can set the "Title" to whatever, it's just for you to know where it's from - we recommend something like "username-mindsmiths-free" (e.g. hrco-mindsmiths-free)

Now it is time to push the code to the connected repo, do this:
1. Create a new repo following instructions on this [link](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
2. Run this command in terminal of your Mindsmiths environment: `git init`
3. Set the name and email the git will know you for with commands (change values for "you@example.com" and "Your Name"):
```commandline
    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"
```
4. Add the remote with: `git remote add origin git@github.com:<github_username>/<github_repo_name>`
5. Now run these commands to push all the files to the repo:
```commandline
    git add .
    git commit -m "First commit: pushed all the Mindsmiths initial repo files"
    git push --set-upstream origin master # answer "yes"
    # It may take some time because of the big file size
```
That's it, you have your GitHub account connected. The same process can also be applied for GitLab.

### Documentation
To help you get started with the platform, you can check out the tutorials and supporting [documentation](http://docs.sandbox.mindsmiths.io/docs/intro)

### Support
If you need technical (and emotional) support, you can always reach out to us in our [Discord channel](https://discord.gg/FRUHd4eE)

For frequent issues, there is a short rundown below.

### Directory structure: quick reference
The main directories are the following:
- config: directory containing all the configuration files
- models: symlink to the directory containing the agent models
- rules: symlink to the directory divided into subdirectories with the names of the agents you define. The rules referring to each agent are inside the respective subdirectories (e.g. rules/smith/Heartbeat.drl).
- services: directory containing all services you add to the platform. In the initial phase contains only the rule engine service.

### Deployment
Once you are satisfied with your product, and you would like to deploy it to production, 
just reach out. We'll take you through a simple process and help you set up the production environment.

### FAQ
Error: Cannot access target/app.jar file.
Solution: Remove the folder in path services/rule_engine/target and run again.

