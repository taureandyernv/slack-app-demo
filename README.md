# RAPIDS Slack App
In this app, `routes/slack.js` will post the latest unanswered questions that have RAPIDS related keywords into a Slack channel for us to swarm.  It will keep track of previous questions, to reduce duplicates, and 

## How to Run:
1. Install nodejs, nodemon and npx
2. Configure config.json with your secure Slack endpoints and other parameters
3. Run `npx nodemon yarn start`


## To Dos:

- set up cron support?
- any other decided upon functionality

## Resources:

- Slack Apps: https://api.slack.com/apps
- Slack Block Builder: https://api.slack.com/tools/block-kit-builder

## Special thanks to:

leighhalliday and ldez, whose apps, [slack-app-demo](https://github.com/leighhalliday/slack-app-demo) and [stackoverflow-slack-bot](https://github.com/ldez/stackoverflow-slack-bot), this was took inspiration from.