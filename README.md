
# HiFi Spatial Audio Room Demo


## Prerequisites

### Node.js

https://nodejs.org/en/download/

**node** version 18 

**npm** version 8

### Source

Make a local copy of the HiFi Spatial Audio Room repo:
```
git clone https://github.com/highfidelity/spatial-audio-room-demo.git
```


## Development

### Install the dependencies

If developing using the published HiFi Web Audio API:
```
npm install
npm run install-audio-api
```

If developing using a local copy of the HiFi Web Audio API, build it alongside the demo source, then:
```
npm install
npm run install-local-audio-api
```

### Configure the demo app

Make a copy of `/example/config.template.js` as `/example/config.js`.

Edit this `config.js` file:

- If using Daily as the transport, set `DAILY_URL` to be your Daily account URL.
- If using a non-default token server, set the `TOKEN_SERVER` address.


### Build the demo app


For production:
```
npm run build
```

For local development, with hot rebuild:
```
npm run watch
```

### Run the demo app locally

Host the `/dist` directory on a Web server - e.g., add this directory as a virtual directory on localhost.

Load the demo app in a browser.

### Run the demo app and token server locally

Build the app using `npm run watch-app`.

Host the `/dist` directory on a Web server and make it run as one of the following URLs:
```
http://localhost/snap
http://localhost/crackle
http://localhost/pop
```

Run a local copy of the *HiFi Agora Token Server*.

Load the demo app in a browser.
