---
sidebar_position: 2
---

# Adding Armory to your project

You can add Armory to your project in a few easy steps that follows:
1. First move - installing Armory with ```pip install armory~=4.0.0a0```
2. Next thing you should do is integrate Armory as a service into your project by typing ``` armory-admin setup```. 

By doing so, you will be prompted to set some things:
   * Agent handling signals coming from Armory
   * Armory site URL, which you will use as a generated link to access Armory later on

Here we want Mindy to handle all Armory signals. For Armory site URL you'll use your environment URL, so instead of 
`http://workspace-ms-0000000000.sandbox.mindsmiths.io`, you should enter your web IDE link.

This process will look something like this:

```console
root:/app$ armory-admin setup
What agent will handle signals? Mindy
URL of your IDE (leave empty if running locally): 
http://workspace-ms-0000000000.sandbox.mindsmiths.io
Service successfully integrated into the project.
```

Armory will now run on:
```http://8000.workspace-ms-0000000000.sandbox.mindsmiths.io```

 
3. Final step, run ```forge init```. 

In case you experienced some kind of issues during this step, checkout the Troubleshooting part of the tutorial.


That’s it! You can now use Armory in your project, let's find out how we can actually use it to make an awesome onboarding flow.