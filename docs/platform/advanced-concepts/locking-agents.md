---
sidebar_position: 6
---

# Agent locking
- Our platform from version 1.5 support concurrent rule engine execution. 
- Because of that we need to have a mechanism that prevents multiple rule-engines from evaluating and changing same agent at the same time.

## What is concurrency?
- Concurrrency is concept that allows multiple parts of the system to be executed at the same time in no particular order.
- In our case it means that multiple rule engines can be executed at the same time.
- This is a good thing because it allows us to horizontally scale rule engine and have more agents evaluated at the same time.
- Problem with this is that we have to make sure that multiple rule engines don't evaluate same agent at the same time.

## Why agents lock?
- When an agent is being evaluated, it is "locked" so that no other Rule Engine instances can start the evaluation of that agent.
- Agents can lock permanently if an exception is thrown when an agent is being evaluated.

## How do I know that my agent is locked?
- If agent is locked for evaluation, platform will take care of unlocking it and you don`t have to do anything.
- In case agent is permanently locked, after 2 minutes you will get error message in console that says "Agent <YOUR_AGENT> is locked for more than 2 minutes" and in agent summary `lockedAt: true` field will appear

## What happens when agent is permanently locked?
- In most cases this means you have an error in your code that prevents agent from being evaluated.
- Rule engine will still continue working and will ignore agent like it doesn`t exist.

## How to unlock agent?
### Running locally
- On `forge run` locked agents will be unlocked automatically.
- You can unlock agent by running `unlock-agents [agentIds...]` command.
- Change `lockedAt: true` to `lockedAt: false` in agent summary.

### Production/staging
- You can unlock agent by running `unlock-agents [agentIds...]` command.
- Change `lockedAt: true` to `lockedAt: false` in agent summary.

## Tips and tricks
- To find all locked agents filer by `{lockedAt: {$exists: true}}` in summary.
