---
sidebar_position: 5
---

# Adapting screen and template style
This purple magic you can notice going on is the default style, but you can override the default style sheet used when generating screens by adding custom style to the `skin.scss` file in `services/armory/src/assets/css`.
You can adapt the style applied for a specific template, and changing its style will affect any screen using it.
By default, any new screen you generate uses `GenericTemplate`, but you can also specify a different template name when using `TemplateGenerator`.
For example, to adapt the style of the screens we implemented in this tutorial, you can paste in the following in your skin.scss file:

```css title="services/armory/src/assets/css/skin.scss"
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

div#welcome.GenericTemplate {
    h2 {
        text-align: center;
        color: rgb(11, 121, 1);
    }
}
```
Note that the dot (.) signifies a class name while the hash (#) signifies an element with a specific id attribute. 
You can inspect and play around with the screen elements by pressing `F12` and then `CTRL+SHIFT+C` in the browser showing the screen.

Let’s quickly walk through our beautiful design:
* the first block sets the background color for all screens
* the second block vertically centers all screen contents for each screen using GenericTemplate, and sets the color and alignment for headings
* the third block colors all contents of description components
* the last block sets specific style only for the headings on the welcome screen.

You can also reference template components by the `componentId` you specified.
Feel free to play around and dig deeper into styling using css by yourself!
