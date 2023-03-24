---
sidebar_position: 9
---

# Content Management

## Mitems
Mitems is user-friendly text manager that makes your coding easier. It is simple interface where you connect your back-end aplication with its front-end part.
Mitems is often used for product specification where you can easily find components of your code by their unique name or functionality.

## How to use Mitems?
Using Mitems is as simple as its running. There are a few important steps to do:

1. You need to run Mitems from [Mindsmiths Platform](https://docs.mindsmiths.com/docs/platform/getting-started) in terminal using the following command:
```console
forge run-service mitems
```
2. You should find Mitems at **Ports** in bottom right corner and open it to get window like this one:

![graphic](mitems.png#center)

More details about elements and their use, you can find in section below - **Components and main functions**.


## Components and main functions

In Mitems there are **items** which are made of **elements**. Both have name component but elements also have type which can be text, HTML, JSON or option type.

![graphic](elements.png#center)




:::tip
 Be careful when naming your components, because you they are integrated in you project with `.json file` and you will need to use them while implementing funcionalities.

:::



There are a few useful functions that can make your life easier while coding. 

- `Mitems.getText("demo.demo-item.text-demo")` and `Mitems.getHTML("demo.demo-item.text-demo")` are getting text of your text component using name of flow, item and element in string argument.
- `Mitems.getOptions("demo.demo-item.text-demo")` is getting options you have created in Mitems using also flow, item and element name as argument.
- `Templating.recursiveRender(Mitems.getText("demo.demo-item.text-demo"), Map.of("demo", Mitems.getText("demo.demo-item.text-demo")))` is very useful for creating HTML outputs where you can easily integrate variables from your code to Mitems.

## When to use Mitems?

Mitems is great tool for generating dynamic content very quickly. Also, it is user-friendly so even if you do not have developers skills, you can participate in creating interesting materials 
because Mitems provides easy-to-use interface. It is useful choice if scalability is your priority, because it can provide various features and functionality.    