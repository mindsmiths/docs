---
sidebar_position: 2
---

# Connecting your git repository

## What will this guide help you with

This guide will help you connect your git repository with Mindsmiths web IDE. The guide uses GitHub as a repository hosting 
platform, but the concepts shown here are applicable to any other git-based repository hosting platform 
(e.g. GitLab, Bitbucket, etc.).

We will use the SSH key to authenticate with the git remote repository (authenticating code pushes from Mindsmiths web IDE to 
your remote GitHub repository) instead of the basic https. This way we avoid having to repeatedly provide the username and password.

We'll do this in just 4 easy steps:
1. Generating an SSH key on a Mindsmiths web IDE
2. Adding the SSH key to your git account
3. Setting up git config
4. Pulling/pushing the code from/to the remote repository

Let's get started!


## 1. Generating an SSH key on a Mindsmiths web IDE

To generate an SSH key follow the instructions bellow. There are some additional explanations provided together with the steps.

1. Open terminal in the Mindsmiths web IDE
   > Search for "Terminal" in the upper left bar and then choose "New Terminal"

2. Run this command to create the SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "Mindsmiths web IDE"
   ```
   > You can change the comment of the key ("Mindsmiths web IDE") to best describe this SSH key for you

   Press ENTER on all prompts (we want the default directory to save the SSH key in and don't want to set the phassphrase) 

   Great! We successfully generated our SSH key, and you can see it (assuming you pressed ENTER on first prompt) with:
   ```bash
   cat /root/.ssh/id_ed25519.pub
   ```

## 2. Adding the SSH key to your git account

The next step is to add the key we just created to your git account. To do that we will copy the public part of the generated SSH key and add it to your git account. This process is slightly different depending on whether you are using GitHub or GitLab:
- To add the SSH key to a **GitHub account** jump to section [Adding SSH key to your GitHub account](#2a-adding-ssh-key-to-your-github-account).
- To add the SSH key to a **GitLab account** jump to section [Adding SSH key to your GitLab account](#2b-adding-ssh-key-to-your-gitlab-account).
 


### 2.a Adding the SSH key to your GitHub account


1. Click the link [Add GitHub SSH key](https://github.com/settings/ssh/new), which will take you to the GitHub's page for adding new SSH keys
   > You have to be logged in into GitHub to do this, otherwise GitHub will automatically redirect you to the login page
    
   ![Add GitHub SSH key](/img/connecting-git-repo/add-github-ssh-key.png)

   As you can see in the image, you need to set the Title and Key.

2. Let's first set the title. We can use the same value we used when creating the key - **"Mindsmiths web IDE"**
   > - The title is used to distinguish one key from another and understand where it's used
   > - Setting the title to "Mindsmiths web IDE" will help us understand exactly where this key is used and make future management easier

3. To set the Key, first go back to the terminal of the Mindsmihts web IDE and run the following command:
   ```bash
   cat /root/.ssh/id_ed25519.pub
   ```
   > - This will print out the public part of your SSH key that should be added to GitHub
   > - This part of the SSH key (public part) is not secret and can be shared, but it's recommendable to only share it if necessary
   > - If for any reason the key `id_ed25519.pub` doesn't exist, try to generate it again. Make sure to press ENTER on all prompts.
   [Generating SSH key on a Mindsmiths web IDE](#1-generating-ssh-key-on-a-mindsmiths-web-ide)

4. Copy the output of the above command and paste it into the Key box on GitHub.

5. Press the `Add SSH key` button to save the SSH key and finish the process.

Great! Now we connected our Mindsmiths web IDE with our GitHub repository. All that's left is to push the initial code to a new remote repo or pull the code from an existing one, and start coding.

### 2.b Adding the SSH key to your GitLab account


1. Click the link [Add GitLab SSH key](https://gitlab.com/-/profile/keys), which will take you to the GitLabs's page for adding new SSH key
   > You have to be logged in into GitLab to do this, otherwise GitLab will automatically redirect you to the login page
    
   ![Add GitLab SSH key](/img/connecting-git-repo/add-gitlab-ssh-key.png)

    As you can see in the image, you need to set the Title and Key.

2. Let's first set the title. We can use the same value we used when creating the key - **"Mindsmiths web IDE"**
   > - The title is used to distinguish one key from another and understand where it's used
   > - Setting the title to "Mindsmiths web IDE" will help us understand exactly where this key is used and make future management easier

3. To set the Key, first go back to the terminal of the Mindsmihts web IDE and run the following command:
   ```bash
   cat /root/.ssh/id_ed25519.pub
   ```
   > - This will print out the public part of your SSH key that should be added to GitLab
   > - This part of the SSH key (public part) is not secret and can be shared, but it's recommendable to only share it if necessary
   > - If for any reason the key `id_ed25519.pub` doesn't exist, try to generate it again. Make sure to press ENTER on all prompts.
   [Generating SSH key on a Mindsmiths web IDE](#1-generating-ssh-key-on-a-mindsmiths-web-ide)

4. Copy the output of the above command and paste it into the Key box on GitLab.

5. Press the `Add key` button to save the SSH key and finish the process.

Great! Now we connected our Mindsmiths web IDE with our GitLab repository. All that's left is to push the initial code to a new remote repo or pull the code from an existing one, and start coding.

## 3. Setting up git config

To push to a remote git repository you have to set up git in your Mindsmiths web IDE.

1. Open terminal in the Mindsmiths web IDE

2. Run these commands to set your email and name for git
   ```bash
   git config --global user.email "your-mail@example.com"
   git config --global user.name "Your Name"
   ```
   > Make sure you change *your-mail@example.com* to your real email, and *Your Name* to your real username


## 4. Pulling/pushing the code from/to the remote repository

Depending on what you want to do, you can connect the remote GitHub/GitLab repository in two different ways:
1. You can push the initial code from your Mindsmiths web IDE to a new git repo. [Create a new repo](#create-a-new-repo)
2. You can pull already existing code into your Mindsmiths web IDE. Jump to [Pull existing repo](#pull-an-existing-repo)

### Create a new repo

1. Create a new empty repository on your GitHub or GitLab: 
[Create a new empty GitHub repository](https://github.com/new) or [Create a new empty GitLab repository](https://gitlab.com/projects/new)
   
   > **Do not add a README or any other file to the repo!**

2. Go to the Mindsmiths web IDE and run in terminal:
   ```bash
   git init
   ```
   > Make sure you are positioned the `/app` directory when running the command

3. Next we add the remote:
   ```bash
   git remote add origin <SSH repo url> 
   ```
   To find your SSH repo url go to your empty git repo. Click `Code` (on GitHub) or `Clone` (on GitLab) and then choose `SSH`.
   There you will see the repository url that you need to copy and enter into the command above.
    
   > The url should begin with **git@** and ends with **.git**

4. Now run these commands to push all the files to the repo:
   ```bash
   git add .
   git commit -m "First commit: pushed all initial project files"
   git branch -M "main"
   git push --set-upstream origin main 
   ```
   If prompted, type `yes` and press ENTER.

   > It may take some time because of large file sizes

### Pull an existing repo

In case you want to pull the code from an exisitng repo, you should've receives a Mindsmiths web IDE that's specifically prepared to make this process as easy as possible.
> If you don't have  Mindsmiths web IDE that led you here you can ask for one on our [Discord channel](https://discord.gg/knYDVJ5Ez8).

You just need to run the script that will set everything up.

#### Understanding the script

Let's quickly go through what the script does:
1. It asks you to provide the remote SSH url of the repository (e.g. *git@github.com:username/repo-name.git*)
   > If you get asked to provide a username and password, it means you provided an https url instead of an SSH url for the repository

2. It pulls the code from the repository you provided
3. It configures the environment and the code in your working directory (`/app`)

#### Running the script

Now that you understand what this script does, you can run it.

1. Run in terminal:
   ```bash
   . /root/pull_repo.sh
   ```
2. Enter your project SSH clone URL (you can find it in your git repository under `Code` for GitHub or `Clone` for GitLab)
2. As the script pulls the code using the SSH protocol, there will probably be a prompt shown:
   ```commandline
   Are you sure you want to continue connecting (yes/no/[fingerprint])?
   ```
   You need to type `yes` and press ENTER
3. Check that everything works as intended by running the project. You may need to set environment variables.
   ```bash
   forge run
   ```

OK, you are now ready to start developing on this environment. Enjoy!
