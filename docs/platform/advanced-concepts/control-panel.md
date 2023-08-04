---
sidebar_position: 5
---

# Control Panel (Beta)
Control panel is the main control plane for your project.
It allows you to see your agents and their state in real time. It also allows you to lock and unlock agents, as well as clear agent's pending signals.

Other features include time and date configuration as well as access to the terminal.

The following features are planned for the future:
- agent management (create, delete, update)

Features under consideration:
- viewing and filtering logs
- viewing per-agent logs
- checking for upgrades
- usage & performance statistics
- service health stats & alerts

Let us know on our Discord server if you have any suggestions or feedback.


## Agent management
On the agent management page, you can see all your agents and their lock state.

The agent details view shows the agent's connections by default. You can customize this view by clicking on the cog icon in the top right corner, and adding a regex.
For example, if your agent has an `name` field, you can add it to the view with this regex: `/name"."([a-zA-Z0-9]+)"/gm`


## Date & Time configuration
On the date and time configuration page, you can set fake date and time for the Platform's simulation.
This is useful for testing time-based triggers, or for testing your application's behavior in the future or in the past.

To use this feature, you will also need to add support in your Rule Engine.
You can checkout the tutorial [here](/docs/platform/advanced-concepts/rule-engine#getting-current-datetime).

## Terminal
On the terminal page, you can run commands on the Platform's server.

This is useful for debugging your application, or for running commands that are not available in the Platform's UI.

## Changelog

### [0.0.8] - 2023-07-13

#### Added
- Date & Time configuration panel

### [0.0.7] - 2023-07-12

#### Removed
- Configuration editor, it is now available in Dashboard

### [0.0.6] - 2023-06-08

#### Fixed
- terminal wasn't working


### [0.0.5] - 2023-05-15

#### Fixed
- initial YAML loading error


### [0.0.4] - 2023-05-05

#### Fixed
- git commit script incorrect generation


### [0.0.3] - 2023-04-25

#### Added
- terminal (alpha)
- send heartbeat action
- agent details config example
- panel disconnected warning
- minor fixes


### [0.0.2] - 2023-04-14

#### Fixed
- reading YAML with Jinja2 tags in values
- removed excess logging

#### Added
- `Config` static class for ease of use
- nested "dot" get


### [0.0.1] - 2023-04-11

#### Added
- agent management
- configuration management
