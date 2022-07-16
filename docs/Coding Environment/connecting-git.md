---
sidebar_position: 2
---

# Connecting your git repository

## What will this guide help you with

This guide will help you connect your git repository with Mindsmiths web IDE. The guide uses GitHub as a repository hosting 
platform but the concepts shown here are applicable to any other git based repository hosting platform 
(e.g. GitLab, Bitbucket, etc.).

We will use SSH key to authenticate with git remote repository (authenticating code pushes from Mindsmiths web IDE to 
your remote GitHub repository) instead of basic https to remove the need of constant username and password prompt.

We will achieve this in 3 easy steps:
1. Generating SSH key on a Mindsmiths web IDE
2. Adding SSH key to your GitHub account (or other repository hosting platform)
3. Initialising git repository on a Mindsmiths web IDE and pushing the code to the GitHub remote repository

Let's get started!


## Generating SSH key on a Mindsmiths web IDE
To generate SSH key follow the instructions bellow and carefully read the directions provided with the steps.

1. Open terminal in the Mindsmiths web IDE
   > - Search for "Terminal" in the upper left bar and then choose "New Terminal"
2. Run this command to create the SSH key:
    ```commandline
    ssh-keygen -t ed25519 -C "Mindsmiths web IDE"
    ```
    > - ! Press ENTER on all the prompts (we want the default directory to save the SSH key in and don't want to set the phassphrase) 
    > - You can change the comment part of the command (`Mindsmiths web IDE`) to best describe this SSH key for you

Great! We successfully generated our SSH key, and you can see it with:   
```commandline 
cat /root/.ssh/*.pub
```


## Adding SSH key to your GitHub account
The next step is to add the key we just created to your GitHub repository. To do that we will copy the public part of the 
generated SSH key and add it to GitHub using GitHub's dashboard.
Follow the instructions bellow and carefully read the directions provided with the steps.

1. Click the link: [Add GitHub SSH key](https://github.com/settings/ssh/new), which will take you to the GitHub's page for
adding new SSH key 
    > - ! You must be logged in so if you get any error please make sure you are logged in
2. and paste the public key you copied under the "Key" part
3. You can set the "Title" to whatever, it's just for you to know where it's from - we recommend something like "username-mindsmiths-free" (e.g. hrco-mindsmiths-free)



---
---
---
---
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