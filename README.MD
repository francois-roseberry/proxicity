# Proxicity

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](https://gruntjs.com/)

Calculator of service proximity for homes

Server is in nodejs, client is in javascript

Starting development, final objective is to display homes on a map, ranked by their proximity score

Your google maps API key needs to be placed in a file called google_maps_api.key.json in the server/ directory with this content :

```
{
  "key": "YOUR_API_KEY"
}
```

Can be launched by running `run.sh`

## Setup

Nodejs will need to be installed

Grunt and Bower will need to be installed globally ``npm install -g grunt && npm install -g bower``

Other dependencies will need to be installed. For this go in the server directory and do ``npm install``, then go in the client directory and do ``npm install && bower install``

In that same directory, it should now be possible to do ``npm run package``to build the client. Do ``npm run background``to launch the development server. This last command is blocking. In another terminal, do ``npm run check``to run the client tests.

In the server directory, run the server tests with ``npm test``. Don't forget to start the server first.
