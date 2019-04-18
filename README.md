# snift

The browser extension for measuring the web's security. It uses webextension-toolbox to leverage the WebExtensions API and enables us to write cross-browser compatible extensions. 

## Install

    $ npm install

## Development

    npm run dev chrome
    npm run dev firefox
    npm run dev opera

## Build

    npm run build chrome
    npm run build firefox
    npm run build opera

## Environment

The build tool also defines a variable named `process.env.NODE_ENV` in your scripts.
