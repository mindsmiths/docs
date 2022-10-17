---
sidebar_position: 1
---

# Armory concepts

There are a couple important concepts to grasp for using Armory. We’ll look at them in turn.

## Armory signals and connection

Let’s start from the basics: there are three different Armory signals that are caught by the Rule engine:
* **UserConnectedEvent**: emitted each time a user connects to Armory (opens the link)
* **UserDisconnectedEvent**: emitted when the user disconnects from Armory (closes the link)
* **SubmitEvent**: emitted when the user presses something on the screen (e.g. a button)

The signals are fairly straightforward. We should mention that e.g. refreshing the site emits the UserDisconnectedEvent and then the UserConnectedEvent again.

To connect to Armory, the user needs a unique`connectionId`. This id is part of that user’s URL, and will be randomly generated if not set in advance. 
