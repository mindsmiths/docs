---
sidebar_position: 1
---

# FAQ

### Mindsmiths IDE doesn't show files on the sidebar

If you don't see any files in your IDE, try searching for a file: `<Ctrl>-P` on Windows/Linux, `<Cmd>-P` on Mac.
In the search box, type `.java` and press Enter. This should refresh the sidebar and reload all files.


### How do I delete a specific topic?

Execute into any Pulsar Broker pod and run the following command:
```shell
$ bin/pulsar-admin topics delete {topic}
```
Example:
```shell
$ bin/pulsar-admin topics delete public/default/main-my_project-rule_engine-input
```


### How do I delete all messages in a topic?

Each service has its own subscription on a topic. To delete all messages in a topic, delete the entire topic (see above).

If you want to delete all messages in a topic for a specific service, you can clear the backlog for that service.
Execute into any Pulsar Broker pod and run the following command:
```shell
$ bin/pulsar-admin namespaces clear-backlog {topic} -s {service_name}
```
Example:
```shell
$ bin/pulsar-admin namespaces clear-backlog public/default/main-my_project-some_service-event_type-emit -s my_service
```
