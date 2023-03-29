---
sidebar_position: 1
---

# First steps

To allow you to jump over to the more exciting parts of the development as soon as possible, we’ve already prepared the initial steps of the implementation.
Of course, you can always try to implement this part from scratch, or extend it in any way you want!

Your starting point is on the branch [name-of-the-branch], so go ahead nad check out to it from the Terminal:
```console
git clone <repo-link>
git checkout <name-of-the-branch>
forge init
```

We’ll walk you through the code, so it's easier for you to get a grip on what's going on. If you think you've got it, 
you can just continue with the implementation from the point where we leave you off at the end of the section called [Initial setup](./Initial%20setup/welcome-user).

:::note
Remember to set the environment variables in *.env file* located at the root of the project in your web IDE, so you can run the system.
```console
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN>
OPENAI_API_KEY=<YOUR API KEY>
```
:::

# Doctor and Patient Agents

We already mentioned that each agent cares only for the needs of the user it is assigned to, 
instead of being concerned with searching for optimal solutions at system level.

Looking at the principles behind the implementation, there is nothing especially new you will learn from the process of onboarding patients compared to the user communication
you implemented in the Nola Brzina Tutorial.


So instead of guiding you through typing out the code yourself, we want to draw your attention to some principles of developing smart and emotionally intelligent agents.
The key moment is shifting the focus to the users themselves: what would a patient want from their agent in order to feel comfortable and cared for?
As opposed to that, would the doctor need from their agent? Their roles in real life are different, so the logic implemented by the agents necessarily differ as well.

Generally speaking, we argue that there are three key components the users look for and appreciate in this kind of digital relationships:
- _I KNOW YOU_ (personalized approach)
- _I CARE ABOUT YOU_ (proactive care)
- _I HAVE THE EXPERTISE_ (relevant expert knowledge)

We'll demonstrate these characteristics throughout the implementation of the communication between the agents and the users.