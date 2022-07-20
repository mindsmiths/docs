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
3. Setting up git config
4. Pulling/pushing the code from/to the GitHub remote repository

Let's get started!


## 1. Generating SSH key on a Mindsmiths web IDE

To generate SSH key follow the instructions bellow and carefully read the directions provided with the steps.

1. Open terminal in the Mindsmiths web IDE
    > Search for "Terminal" in the upper left bar and then choose "New Terminal"

2. Run this command to create the SSH key:
    ```bash
    ssh-keygen -t ed25519 -C "Mindsmiths web IDE"
    ```
    > You can change the comment of the key ("Mindsmiths web IDE") to best describe this SSH key for you

    Press ENTER on all the prompts (we want the default directory to save the SSH key in and don't want to set the phassphrase) 

Great! We successfully generated our SSH key, and you can see it (assuming you pressed ENTER on first prompt) with:   
```bash
cat /root/.ssh/id_ed25519.pub
```


## 2. Adding SSH key to your GitHub account

The next step is to add the key we just created to your GitHub repository. To do that we will copy the public part of the 
generated SSH key and add it to GitHub using GitHub's dashboard.
Follow the instructions bellow and carefully read the directions provided with the steps.

1. Click the link: [Add GitHub SSH key](https://github.com/settings/ssh/new), which will take you to the GitHub's page for adding new SSH key
    > You must be logged in into GitHub to do this, if you are not, GitHub will automatically redirect you to the login page
    
    ![Add GitHub SSH key](/img/connecting-git-repo/add-gitlab-ssh-key.png)

    As the picture shows, you need to provide the Title, and the Key itself.

2. Let's set the title. We can use the same value we used when creating the key - **"Mindsmiths web IDE"**
    > - The title is used to recognize one key from the other and understand where it is used.
    > - Setting the title to "Mindsmiths web IDE" will help us understand exactly where this key is used for the future management needs

3. To set the Key part first go back to the terminal of the Mindsmihts web IDE and run the following command:
    ```bash
   cat /root/.ssh/id_ed25519.pub
   ```
   > - This will print out the public part of your SSH key that should be added to GitHub
   > - This part of the SSH key (public part) is not secret and can be shared, but still, share it only when you need to
   > - If for any reason key `id_ed25519.pub` doesn't exists try to generate it again. Make sure to press ENTER on all prompts. 
   [Generating SSH key on a Mindsmiths web IDE](#generating-ssh-key-on-a-mindsmiths-web-ide)

4. Copy the result of the above command and paste it into the Key box on GitHub.

5. Press the `Add SSH key` button to save the SSH key and finish the process.

Great! Now we connected our Mindsmiths web IDE with our GitHub repository. All that is left is to push/pull the code and start coding.


## 3. Setting up git config

To push to remote git repository you have to set up git in your Mindsmiths web IDE.

1. Open terminal in the Mindsmiths web IDE

2. Run these commands to set your email and name for git
    ```bash
    git config --global user.email "your-mail@example.com"
    git config --global user.name "Your Name"
    ```
    > Make sure you change *your-mail@example.com* to your real email, and *Your Name* to your real name


## 4. Pulling/pushing the code from/to the GitHub remote repository

There are two different ways you can approach this step based on your situation:
1. You want to push the code from your Mindsmiths web IDE to new GitHub repo. Jump to [Create new repo](#create-new-repo)
2. Code is already on the remote GitHub repository, and you want to pull it into your Mindsmiths web IDE. Jump to [Pull existing repo](#pull-existing-repo)

### Create new repo

1. Go to your GitHub account and [create new empty repo](https://github.com/new). You probably want to create a private repo.
    > **Do not add README or any other file to the repo!**

2. Now navigate to your Mindsmiths web IDE and run in terminal:
    ```bash
    git init
    ```
    > Make sure you are positioned the `/app` directory when running the command

3. Next up we will add the remote:
    ```bash
    git remote add origin <SSH repo url> 
    ```
    To find your SSH repo url go to your empty GitHub repo. Click `Code` and then `SSH`.
    There you will see the repository url that you need to copy and enter into the command above.
    
    > The url should begin with **git@github.com**

4. Now run these commands to push all the files to the repo:
    ```bash
    git add .
    git commit -m "First commit: pushed all the Mindsmiths initial project files"
    git branch -M "main"
    git push --set-upstream origin main 
    ```
   If prompted, type `yes` and press ENTER.

   > It may take some time because of the big file size

### Pull existing repo

For this situation Mindsmiths provide a specially prepared Mindsmiths web IDE that makes is easy to set everything up. 
You probably already have the Mindsmiths web IDE whose README led you here, and now it is time to run the prepared script that will set everything up.
> If you don't have a Mindsmiths web IDE that led you here you can ask for one on our [Discord channel](https://discord.gg/knYDVJ5Ez8).

#### Understanding the provided script

Let's quickly understand what the script does:
1. Ask you to input the remote SSH url of the repository (e.g. *git@github.com:username/repo-name.git*)
    > If you are asked for your username and password it means you provided https url instead of an SSH url for the repository

2. Pull all the code from the provided repository
3. Configure the environment and all the code in your working directory - `/app`

#### Run the provided script

Now that you understand what this script does, you can run it.

1. Run in terminal:
   ```bash
   . /root/pull_repo.sh
   ```
2. As the script pulls the code using the SSH protocol, there will probably be a prompt shown:
   ```commandline
   Are you sure you want to continue connecting (yes/no/[fingerprint])?
   ```
   You need to type `yes` and press ENTER.
3. Check if everything works as intended by running the project. You may need to set environment variables.
   ```bash
   forge run
   ```

OK, you are now ready to start developing on this enviroment. Enjoy!
