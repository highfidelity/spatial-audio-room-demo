
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

Install the dependencies:
```
npm install
```

If developing using a local copy of the *HiFi Web Audio API*, build it alongside the demo source, then:
```
npm run install-local-audio-api
```

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
