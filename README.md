<div align="center">
	<br>
	<br>
	<img width="360" src="media/logo.svg" alt="Snift">
	<br>
	<br>
	<br>
	<br>
</div>

> Browser extension that helps identify security issues on the sites you visit, anonymously.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/cb7410e3091b43dab2eff2182a6c3141)](https://app.codacy.com/app/snift/snift-extension?utm_source=github.com&utm_medium=referral&utm_content=snift/snift-extension&utm_campaign=Badge_Grade_Dashboard)

## Usage

<img src="media/usage.gif" width="720">

Coming soon to the Chrome Webstore and to the Firefox Addons Store!

## Development

1. To install the required dependencies, run
    ```
      $ npm install
    ```

2. Based on the browser environment you want to run the extension, run the following command:

    ```
      $ npm run <browser>
    ```
    where `browser` is a placeholder denoting one of `chrome`, `firefox` or `opera`

    Once this command is run, a `dist` folder should be automatically created, wherein you would find the extension packaged for the target browser environment.
    You would use this folder to load the unpacked extension in the browser.

## Credits

Badge Icons made by [Icongeek26](https://www.flaticon.com/authors/icongeek26)
