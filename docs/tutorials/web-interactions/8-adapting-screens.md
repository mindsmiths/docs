---
sidebar_position: 8
---

# Adapting screen and template style

This color magic you can notice going on is just the default screen styling. You can of course override the default style sheet used when generating screens by adding custom style to the `skin.scss` file, located in `services/armory/src/assets/css`.
So let's start with some css basics. 

For example, to adapt the style of the screens we implemented in this tutorial, you can paste in the following in services in `skin.scss` file:

```"css title="armory/src/assets/css/skin.scss"
$body-size: 18px;
$primary: #cb9cf9;
$family-primary: "Helvetica", sans-serif;

h2 {
    text-align: center;
}

div.CloudSelect div.field.has-addons {
    justify-content: center;
}

div {
    text-align: center;
}

@import "armory-sdk/src/assets/css/override.scss";
@import "armory-sdk/src/assets/css/default-skin.scss";
```

You can inspect and play around with the screen elements by pressing `F12` OR `CTRL+SHIFT+R` in the browser showing the screen. 
This will allow you to quickly find out how to reference the elements you want to add to your css file.

Feel free to play around and dig deeper into styling using css by yourself!