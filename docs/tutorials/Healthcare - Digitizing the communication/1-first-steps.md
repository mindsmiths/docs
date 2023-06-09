---
sidebar_position: 2
---

# First steps

To allow you to jump over to the more exciting parts of the development as soon as possible, we’ve already prepared the initial steps of the implementation. 
Of course, you can always try to implement this part from scratch, or extend it in any way you want!

Your starting point is on the branch [name-of-the-branch], so go ahead and check out to it from the Terminal in your Web IDE:

```console
git clone <repo-link>
git checkout <name-of-the-branch>
forge init
```

:::note
You need at least two users to test this demo.
:::

We’ll walk you through the prepared code, so it's easier for you to get a grip on what's going on. If you've got this part covered, 
you can just continue with the implementation from the point where we leave you off at the end of the section called [Initial setup](./Initial%20setup/welcome-user).

:::note
Remember to set the environment variables in *.env file* located at the root of the project in your web IDE, so you can run the system.
```console
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN>
OPENAI_API_KEY=<YOUR API KEY>
```
:::