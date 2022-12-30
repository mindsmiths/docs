---
sidebar_position: 7
---

# Adding images to screens

You can easily use images on screens. To try it out, you can add the media content to the `services/armory/public` directory, 
and add it normally by adding an `ImageComponent` to your screen. We'll just add image on the welcome screen, but you can add as many as you like, wherever you want.

```java title="java/agents/Felix.java"

package agents;

...

import com.mindsmiths.armory.component.ImageComponent;
...

@Data
@NoArgsConstructor
public class Felix extends Agent {
    public void showStartScreens() {
            Map<String, BaseTemplate> screens = Map.of(
                    "welcome", new TemplateGenerator ("welcome")      
                    .addComponent("title", new TitleComponent("Hello! I’m Felix and I’m here to help you find the best workout plan for you. Ready?"))
                    .addComponent("image", new ImageComponent("/public/JogaPuppy.png"))  
                    .addComponent("submit", new PrimarySubmitButtonComponent("Cool, let's go!", "askForName")),
                    "askForName", new TemplateGenerator("askForName")
                            .addComponent("title", new TitleComponent("Okay, first, tell me your name? :)"))
                            .addComponent("name", new InputComponent("name", "Type your name here", true))
                            .addComponent("submitName", new PrimarySubmitButtonComponent("submitName", "Done, next!", "completed")));
            showScreens("welcome", screens);
        }
    }
```

You can arrange the subdirectory structure inside `/public/` however you want, you only need to take care that the path to the image you added always starts with `/public/`.