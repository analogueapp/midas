# Midas [![CodeFactor](https://www.codefactor.io/repository/github/analogue-app/midas/badge)](https://www.codefactor.io/repository/github/analogue-app/midas)
The official chrome extension for [Analogue](https://analogue.app) on React, TypeScript, & webpack.

Based on [awesome-chrome-extension-boilerplate](https://github.com/tjx666/awesome-chrome-extension-boilerplate). Also uses [webext-redux](https://github.com/tshaddix/webext-redux) as a way to leverage redux in the extension to communicate from the popup to the background script.

## Production Links
- [Link to Chrome Web Store](https://chrome.google.com/webstore/detail/mialbooafpmjhjajlhgnhcdmeilcpphi)
- TODO: [Link to Analogue landing page](https://analogue.app/extension)

## Development Features
- 💄Supports automatically reloadng the extension and refreshing the page into which the content scripts are injected.
- 🌴 The options and popup pages support react hot reload & react devtools, fully enjoy the convenience of modern front-end engineering, allowing you to seamlessly switch from developing SPA to chrome extension development.
- 🛡️ The entire template, including webpack configuration, is written in TypeScript.
- 💄 Support css/less/sass, useing `mini-css-extract-plugin` to separate CSS into content CSS Script.
- ⚒️ Integrated a lot of excellent webpack, eslint and babel plugins in the community to optimize the development, construction and packaging analysis experience.

## Chrome Extension Development Resources
- [Getting Started](https://developer.chrome.com/extensions/getstarted)
- [Overview](https://developer.chrome.com/extensions/overview)
- [Developer Reference Guide](https://developer.chrome.com/extensions/devguide)

## Running Locally

### Install dependencies
```
yarn install
```

### Add key to Manifest
Add this line to your `manifest.json`. This is so that the Chrome extension ID matches the production id and installs locally correctly.
```
"key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArVlw5imfFMKK5pNK8eAIRt9P4Kx8ttRioitL1BshuD2qbyKkhv9ziB8FYysqRw6trwXwwxlSCGqjVaAL9Khr/FYz278ZNqLi/R0IczwArdQcLglc5ryUGVn8nbVh4YTMNMnHC3SIv/nao4H6ZEnD+RyyoSVPvnj7es5gVdxlL/2fZfKTXNitiuklNlPBEI1mo7Om/98y+UZKaJkG3tUfPPJrSpy42FseqrcDNjP8CgEf891l0CzXOatnhX9hofjpYC4Gb2tOGV12T5yzPOqH9dOPIpwzI5xQ9PqIKwXi6GINdGv1UfSEDWYOV9tZMoHkutGwfmUQXoLsnJVDbG78HQIDAQAB",
```

### Start dev server locally

```
yarn start
```

Both the development environment and the production environment will generate an extension folder in the root directory of the project. Chrome visits `chrome://extensions/`, which is the extension management page, click the button in the upper right corner to open the developer mode, choose to load the uncompressed extension, and then select the extension folder you just generated to load the extension.

Detailed [installation guide](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/).

### Start `mainframe`
In a separate process/tab, run `mainframe` locally so it can communicate with your local Rails API insteady of the live production API.

## File Structure

### Background
The background page lives in the `src/background` folder. This is the main part of the app that communicates with Analogue. It runs in the background of the chrome browser and is the only way to send external API requests. 

- `src/background/index.ts` - the entry point for the background script and an entry for webpack.
- `src/background/agent.js` - contains all API requests to Analogue.
- `src/background/utils/` - contains all utility scripts, specifically for chrome notifcations.
- `src/background/assets/` - contains all static assets, like our logo.
- `src/background/reducers/` - contains our reducers for use with `webext-redux`

Other pages like options and popup are also similar. You can check the webpack entry configuration: `src/server/utils/entry.ts` for more implementation details.

### Options and Popup
Their webpack entries are `src/options/index.tsx` and `src/popup/index.tsx`. These two pages are very similar, they are just a normal web page, so you can develop them like developing any React app. For now we don't do anything here.

### Content Scripts
This template will scan the src/contents folder and use `index.tsx` or `index.ts` in all subfolders as webpack entry.

Content scripts are all placed in the `src/contents` directory. There is an `all.ts` by default, which is also a webpack entry, which cannot be deleted, because this webpack entry is used to inject patches that implement the chrome extension auto-refresh function.

As of now there is only one content script that runs on all webpages, as way to capture the URL and send to Analogue.
- `src/contents/all/components/` - contains all the components used.
- `src/contents/all/assets/` - contains all static assets like images and logos.
- `src/contents/global/types.ts` - contains custom Typescript type interfaces

### Creating custom content scripts
Say you want to develop a specific content script for the URL https://www.example.com/discuss, you'd need to do the following:

Add a mapping between content scripts and page URLs to `manifest.dev.json` and `manifest.prod.json`:

```
"content_scripts": [
  {
    "matches": ["https://www.example.com/discuss*"],
    "css": ["css/discuss.css"],
    "js": ["js/discuss.js"]
  }
],
```

Create a folder src/contents/discuss corresponding to the content script path above. `src/discuss/index.tsx` or `src/discuss/index.ts` will be treated as a webpack entry. Webpack will eventually produce the chunk `js/discuss.js` through this entry.

`mini-css-extract-plugin` will merge all the style files imported by `discuss/index.ts` and then separate them to `extension/css/discuss.css`, which is why the content CSS script in the above manifest can use `css/discuss.css`.

## Build
To build production packages to submit to the Chrome web store, run:

```
yarn run build
```

If you want to analyze the packaging situation:

```
yarn run build-analyze
```
