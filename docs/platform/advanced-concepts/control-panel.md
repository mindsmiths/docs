---
sidebar_position: 5
---

# Control Panel (Beta)
Control panel is the main control plane for your project.
It allows you to see your agents and their state in real time. It also allows you to lock and unlock agents, as well as clear agent's pending signals.

The control panel also features a configuration management system, which allows you to define a custom YAML configuration which is accessible from all agents and services.

The following features are planned for the future:
- built-in terminal
- agent management (create, delete, update)
- time travel

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


## Configuration
On the configuration page, you can define a custom YAML configuration which is accessible from all agents and services. Any changes are automatically propagated in real-time.

The configuration is also saved in `services/control_panel/configuration.yaml` where you can edit it manually. All changes are also automatically committed to git to keep your data in sync.

You can use this feature to dynamically change certain parameters in your project, implement feature flags, or even use it as a simple CMS.

### Using the configuration
First make sure you have `control-panel-api` (Python) or `control-panel-client` (Java) in your dependencies.

After that, you just need to call `Config.get(key)` with the key you want to retrieve.

On first use, it makes a GET request to fetch the configuration, and starts a message consumer in a new thread to listen for any changes.
After that, it is cached in memory, so you don't have to worry about performance.
Make sure you have the control panel service running, otherwise it will retry the request and eventually throw an exception.

#### Python
```python
from control_panel.api import Config

Config.get("key")
Config.get("key", "default")
```

You can also get nested values using dot notation:
```python
Config.get("screens.0.header.text")
```

#### Java
```java
import com.mindsmiths.controlPanel.Config;

Config.get("key");
Config.get("key", "default", String.class);
Config.get("screens.0.header.text", String.class);
```


## Changelog

## [0.0.2] - 2023-04-14

### Fixed
- reading YAML with Jinja2 tags in values
- removed excess logging

### Added
- `Config` static class for ease of use
- nested "dot" get


### [0.0.1] - 2023-04-11

#### Added
- agent management
- configuration management
