---
sidebar_position: 2
---

# Armory templates and components

As mentioned, the service already comes with a number of predefined templates and components for building screens. Once you get a hang of it, you are welcome to add more custom implementations.

Templates are basically defined by:
* **templateName**
* **componentOrdering**

Templates are usually named by the components they contain, e.g. `TitleButtonTemplate` contains a `TitleComponent` and a list of `PrimarySubmitButtonComponents`.
The order in which these components are shown on the screen is specified via the `componentOrdering` list.
All templates implement the `BaseTemplate` interface.

Templates are really easy to define using the `TemplateGenerator`, so we only provide a couple of them out-of-the-box. One example is the `GenericTemplate` which contains the following components (in that order of appearance, if actually used on the screen): back button, title, image, description text, area for text input, area for data input, and a group of action components (e.g. buttons). 
Of course, not all available components need to be used every time.

The `GenericTemplate` is quite packed, but it can be much simpler than that: we also provide a `TitleTemplate` which literally only contains a TitleComponent.

The components are the building blocks of screens, and there are several of them predefined in the service, all implementing the BaseComponent interface:
* ActionGroupComponent (groups together buttons into a list)
* BackButtonComponent
* CloudSelectComponent (allows user to select multiple elements from a list)
* DescriptionComponent.java
* ImageComponent.java
* InputComponent.java (roughly corresponds to HTML input element, with the data type specified by setting `type`)
* PrimarySubmitButtonComponent (basic button, extending the BaseSubmitButtonComponent which triggers a SubmitEvent)
* TextAreaComponent
* TitleComponent

Each component is referenced through its `componentId`. We’ll use this id later on for getting the data the user provided on a screen off the `SubmitEvent`.