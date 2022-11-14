---
sidebar_position: 2
---

# Adding Armory to the project

You can add Armory to your project in a few easy steps:
1. First install Armory by running ```pip install armory~=5.0.0b0``` in the Terminal
2. Next run the ```armory-admin setup``` command to integrate Armory into the project  

This command will prompt you to:
   * Choose the agent handling signals coming from Armory
   * Provide the Armory site URL, which you will use to access Armory later on

In this tutorial, we'll create agent Mindy to handle all Armory signals. In case you choose a different name, make sure to keep it consistent throughout the tutorial.

For Armory site URL you use your environment URL, e.g. 
`http://workspace-ms-0000000000.sandbox.mindsmiths.io`, with the `0000000000` being the digits you have in your web IDE link.

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

 
3. Finally, run ```forge init```. 

In case you experienced some kind of issues during this step, checkout the Troubleshooting part of the tutorial.

Otherwise, that’s it! You can now use Armory in your project, so let's start with creating your first awesome onboarding flow.