---
sidebar_position: 1
---

# Armory concepts

There are a couple important concepts we need to point out to enable you to use Armory. We'll look at them in turn.

## Armory signals and connection

Let's start from the basics - there are three different Armory signals that are caught by the Rule engine:
* **UserConnectedEvent**: signal emitted each time a user connects to Armory (opens the link)
* **UserDisconnectedEvent**: signal emitted when the user disconnects from Armory (closes the link)
* **SubmitEvent**: signal emitted when the user presses something on the screen (e.g. a button)

The signals are fairly straightforward. We should mention that e.g. refreshing the site emits the `UserDisconnectedEvent` and then the `UserConnectedEvent` again, while each `UserConnectedEvent` also emits a `SubmitEvent`.

To connect to Armory, each user needs a unique `connectionId`. This id is part of that user’s URL, and will be randomly generated if not set in advance.

For this demo, we can just keep re-generating the connection id with each run. Just keep in mind that in a real scenario, you would have this id permanently stored for each user. 