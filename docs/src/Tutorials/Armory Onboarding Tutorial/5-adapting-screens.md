---
sidebar_position: 5
---

# Adapting screen and template style

This color magic you can notice going on is the default screen styling, but you can override the default style sheet used when generating screens by adding custom style to the `skin.scss` file located in `services/armory/src/assets/css`.
You can adapt the style applied for a specific template, and changing its style will affect any screen using it. By default, any new screen you generate uses the `GenericTemplate`, but you can also specify a different template name when using `TemplateGenerator`.

So let's start with some css basics. 
For example, to adapt the style of the screens we implemented in this tutorial, you can paste in the following in services in `skin.scss` file:

```"css title="src/assets/css/skin.scss"

body {
    background-color: rgb(209, 238, 255);
}

.GenericTemplate {
    justify-content: center !important;

    h2 {
        text-align: center;
        color: rgb(1, 1, 121);
    }
}

.DescriptionComponent {
    color: rgb(0, 51, 219);
    text-align: center;
}

.GenericTemplate {
    h1, h2, h3 {
        text-align: center;
        color: rgb(11, 121, 1);
    }
}
```
Note that the dot (.) signifies a class name while the hash (#) signifies an element with a specific id attribute. 
You can inspect and play around with the screen elements by pressing `F12` and then `CTRL+SHIFT+C` in the browser showing the screen.

Let’s quickly walk through the code of our beautiful design:
* the first block sets the background color for all screens
* the second block vertically centers all screen contents for each screen using GenericTemplate, and sets the color and alignment for headings
* the third block colors all contents of description components
* the last block sets specific style for the headings on all screens

If you want to, for example, style only specific screen, you can do it like this:

```div#welcome.GenericTemplate {
    h2 {
        text-align: center;
        color: rgb(77, 100, 1);
    }
```
* This block sets specific style for welcome screen only

You can also reference template components by the `componentId` you specified.
Feel free to play around and dig deeper into styling using css by yourself!