---
sidebar_position: 1
---

# First steps

To allow you to jump over to the more exciting parts of the development as soon as possible, we’ve already prepared the initial steps of the implementation.
You can find everything you need on the branch [name-of-the-branch], that'll be your starting point. 
Let's break it down, your first steps should look something like this:
```console
git clone <repo-link>
git checkout <name-of-the-branch>
forge init
```
We’ll walk you through the code, so it's easier for you to get a grip on what's going on. Feel free to implement this part from scratch, or extend it in any way you want.


Otherwise, you can just continue with the implementation from the point where we leave you off at the end of the section called [Initial setup](./Initial setup/welcome-user).

:::note
Remember to set the environment variables in [.env file](../intro.md) located at the root of the project in your web IDE, so you can run the system.
```console
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN>
OPENAI_API_KEY=<YOUR API KEY>
```
:::