# Mindsmiths Platform Docs

## General guidelines
- When writing, focus on the technical stuff - write about "how-tos", "what is it" and "when to use" instructions
- Main goal is to have lots of simple examples and code blocks that will be used as cookbooks
- The idea is to avoid searching how to implement a feature on the other projects, we want the docs to be the source of truth and the starting point when starting with new projects and/or adding new features to existing projects
- If you refer to some part of the docs, some other docs or you want to create an example of your own, try to link it, we aim to have interconnected docs files that reference each other
- Be consistent and concise with the naming, simple is better in this case, we can iterate over docs as well
- If you are writing an example code, put it in ```` this kind of quotation mark. This way it will be much easier to copy-paste it to the code editor, it will be formatted accordingly, and it will be easier to read code that way
- Pictures are always welcome, but try to keep them neat


## How can you contribute?
- When you're working on a new service implementation or adding a new feature to existing service or project, write docs in parallel
- If you find yourself in situation where you have to search how to implement a feature(HITL on Discord, for example) that has already been implemented many times, report this to `#issues` channel on Discord. We'll work on putting it to the TO-DOs and plan the resources for putting it to the docs 
- If you are very familiar with a certain service or feature, and you know that we still don't have belonging docs for it, consider creating new PR with the docs for it
- Fix README.md  files on our existing projects (most of our README.md files are empty, some are outdated or they don't contain any useful information). When pulling a new project, we want to have all information for initializing it and running it smoothly
- Run through our TO-DOs list and check if you can help with any of the tasks

## How to start writing docs?
 1. Clone the docs repository or pull the latest changes from the `main` branch
 2. Create a new branch from the `main` branch, name it `feature/<your-feature-name>` if you are adding something new or `refactor/<your-feature-name>` if you are refactoring already existing docs files
 3. Do your magic here
 4. Create a pull request and assign it to both `@lbenjak` and `@gita1417`
 5. Wait for the review, check if any comments require your attention, after which your PR will be merged

## TO-DOs:

### Landing page
- [ ] Add a link to the docs
### Docs
- Project structure
  - [ ] Secret management
- CLI
  - [x] What is it
  - [x] How to use it
  - [x] What can you do with it
  - [x] Custom commands
  - [ ] How to run them in production
  - [ ] CECS
- Heartbeat service
  - [x] How it works
  - [x] Settings
  - [x] Strategies
  - [x] Checks and alerts
  - [x] Custom strategies
  - [ ] Custom strategies with agent data
  - [x] Changelog
- Rule Engine
  - [ ] API
  - [ ] Temporary facts
  - [ ] Stopping evaluation
  - [ ] Creating/updating/deleting agents
  - [ ] Configuring signals (events/data changes)
  - [ ] Infinite loop protection
  - [ ] Agent summary
  - [ ] Locking/unlocking
  - [ ] Pending signals
  - [ ] Subscription strategies reference
- SDK (Java/Python)
  - [ ] What is it
  - [ ] Logging
  - [ ] Configuration (settings)
  - [ ] Modules (production, local...)
  - [ ] Available utils (datetime, strings, feature toggling, templating...)
- Service creation
  - [ ] Listening to events
  - [ ] Emitting events
  - [ ] Testing the service
- Writing rules
  - When
    - [ ] Signals, events and facts
      - [ ] Predefined signals
      - [ ] Defining new signals
    - [ ] Cron expressions
  - Then
    - [ ] sending signals to other agents
  - [ ] Testing agents
- [ ] Machine learning and other intelligent components
- Monitoring & analytics
  - [ ] Logs
  - [ ] Grafana
  - [ ] Posthog
### Tutorials
- Nola
  - [ ] test if everything works on Mindsmiths Web IDE
- Doctor Patient
  - [ ] migrate tutorial to the latest platform version
  - [ ] test if everything works on Mindsmiths Web IDE and fix potential bugs
  - [ ] migrate ModelTrainer to the latest platform version
  - [ ] decompose it to two smaller parts
- Felix
  - [ ] test if everything works on Mindsmiths Web IDE and fix potential bugs
  - [ ] check if texts are following the code blocks


- [ ] create GitHub branches for initializing projects like Twitter guessing game
### Integrations
- Guidelines for writing Integrations part:
    - write what is the service or tool used for and when should it be used
    - explain how to install selected service/tool to the existing project
    - if are there any special settings that need to be set up, explain them (explain how to get all the `.env` variables and what are they used for)
    - if there is a need to do any kind of setup for the service/tool, specify how to do it (write all the steps)
    - last part, write about how to use the service/tool in the project (give code examples of usage and explain what is happening in the code), list all the main features of the service/tool and specify how to use them  


- [ ] get a special page for all the detail setups for integrations 
- [ ] write instructions about integrating the platform with Google Calendar
- [ ] write instructions about integrating the platform with AWS S3
- [ ] write instructions about integrating the platform with Azure Blob
- [ ] write instructions about integrating the platform with Unleash
- [ ] write instructions about integrating the platform with OpenAI
- [ ] write instructions about integrating the platform with AutoML
- [ ] write instructions about integrating the platform with email
- [ ] write instructions about integrating the platform with Content Management (Mitems)
- [ ] write instructions about integrating the platform with Discord


