---
sidebar_position: 2
---

# Armory templates and components

As mentioned previously, Armory already comes with a number of predefined templates and components for building screens. Once you get a hang of it, you are welcome to add more custom implementations.

Templates are basically defined by:
* **templateName**
* **componentOrdering**

The template name is arbitrary, but try to make it something intuitive for you. The order in which these components are shown on the screen is specified via the `componentOrdering` list.
All templates implement the `BaseTemplate` interface.

New templates are really easy to define using the `TemplateGenerator`, so we only provide a couple of them out-of-the-box. 
One example is the `GenericTemplate` which contains the following components (in that order of appearance, if actually used on the screen): back button, title, image, description text, area for text input, area for data input, and a group of action components (e.g. buttons).
Of course, not all available components need to be used every time.

The `GenericTemplate` is quite packed because it's the default template we use for screen generation, but it can be much simpler than that: we also provide a `TitleTemplate` which literally only contains a `TitleComponent`.

Okay, let's now focus more on the screen components. The components are the building blocks of screens, such as buttons, titles, input fields, etc.
Several of them are predefined in the service, all implementing the `BaseComponent` interface:

* ActionGroupComponent (groups together buttons into a list)
* BackButtonComponent (returns to the previous screen)
* CloudSelectComponent (allows user to select multiple elements from a list)
* DescriptionComponent (allows you to add normal text)
* HeaderComponent (contains a logo and back button)
* ImageComponent (allows you to add images)
* InputComponent (roughly corresponds to HTML input element, with the data type specified by setting `type`)
* PrimarySubmitButtonComponent (basic button, extending the `BaseSubmitButtonComponent` which triggers a `SubmitEvent`)
* TextAreaComponent (similar to InputComponent, allows user to write longer text inputs)
* TitleComponent (adds a title)

Each component is referenced through its `componentId`. For example, we use these ids to specify the mentioned order in which the components should appear on screen.
We'll use this id later on for getting the data the user provided on a screen off the history stored on the `SubmitEvent`.