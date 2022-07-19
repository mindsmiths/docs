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
3. Pulling/pushing the code from/to the GitHub remote repository

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
    > - You must be logged in into GitHub to do this, if you are not GitHub will automatically redirect you to the login page
    > - The picture bellow shows the interface for adding GitHub's SSH key
    
    ![Add GitHub SSH key](/img/connecting-git-repo/add-gitlab-ssh-key.png)

As the picture shows, you need to provide the Title, and the Key itself.
2. Let's set the title. We can use the same value we used when creating the key - **Mindsmiths web IDE**
   > - The title is used to recognize one key from the other and understand where it is used.
   > - Setting the title to "Mindsmiths web IDE" will help us understand exactly where this key is used for the future 
management needs
3. To set the Key part first go back to the terminal of the Mindsmihts web IDE and run the following command:
   ```commandline
   cat /root/.ssh/*.pub
   ```
   > - This will print out the public part of your SSH key that we need to set to the GitHub
   > - This part of the SSH key (public part) is not secret and can be shared, but still, share it only when you need to
4. Copy the result of the above command and paste it into the Key box on GitHub.
5. Press the "Add SSH key" button to save the SSH key and finish the process.

Great! Now we connected our Mindsmiths web IDE with our GitHub repository. All that is left is to push/pull the code and 
start coding.


## Pulling/pushing the code from/to the GitHub remote repository
There are two different ways you can approach this step based on where your code is:
1. Code is already on the remote GitHub repository, and you want to pull it into your Mindsmiths web IDE
2. Your remote GitHub repository is empty, and you want to push the code from the new Mindsmiths web IDE

## Code is already on the remote GitHub repository, and you want to pull it into your Mindsmiths web IDE
For this situation Mindsmiths provide a specially prepared Mindsmiths web IDE that makes is easy to set everything up. 
You probably already have the Mindsmiths web IDE whose README led you here, and now it is time to run the prepared script 
that will set everything up.
> If you don't have a Mindsmiths web IDE that led you here you can ask for one on our [Discord channel](https://discord.gg/knYDVJ5Ez8).

### Understanding the provided script 

Let's quickly understand what the script does:
1. Ask you to input the remote SSH url of the repository (e.g. *git@github.com:username/repo-name.git*)
    > If you are asked for your username and password it means you provided https url instead of an SSH url for the 
      repository
2. Pull all the code from the provided repository
3. Configure the environment and all the code in your working directory - /app

### Run the provided script
> - As the script pulls the code using the SSH protocol, there will be a prompt shown:
> ```commandline
> Are you sure you want to continue connecting (yes/no/[fingerprint])?
> ```
> You need to answer with a full word `yes` here!
> - You can check if everything works as intended, after running the script by running forge in terminal and checking if 
> your code behaves as you expect it to:
>```commandline
>    forge run
>```

OK, now we are ready to run the script and start developing:
```commandline
. /root/pull_repo.sh
```

## Your remote GitHub repository is empty, and you want to push the code from the new Mindsmiths web IDE
We first start with initializing git repository on your Mindsmiths web IDE:
```commandline
    git init
```
> - Make sure you are positioned the app/ folder when running the command

After the initialisation lets make git understand who we are by setting our email and name. These will be "packed" 
with every commit you make to help understand who committed what.
```commandline
    git config --global user.email "your-mail@example.com"
    git config --global user.name "Your Name"
```
> - ! Make sure you change *your-mail@example.com* to your real email, and *Your Name* to your real Name

Next up we will add the remote:
```commandline
git remote add origin <SSH repo url> 
```
> - To find your SSH repo url go to your empty GitHub repo where GitHub's guide for connecting the repo will await you. 
> There you will see the repository url that you need to copy and enter into the command above.
> - Make sure you chose the SSH option for the url! SSH url will begin with the: **git@github.com**

5. Now run these commands to push all the files to the repo:
```commandline
    git add .
    git commit -m "First commit: pushed all the Mindsmiths initial project files"
    git push --set-upstream origin master # answer "yes"
    # It may take some time because of the big file size
```
That's it, you have your GitHub account connected. The same process can also be applied for GitLab.