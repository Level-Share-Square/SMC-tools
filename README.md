# Super Mario Construct developer tools

This is a collection of tools to help you develop the game, focussing on usage with and without a construct 3 license.
Provided scripts are developed by MrGerund (The Flying Dutchman) and published by Level Share Square.

## Usage

This repository contains both a web version (.html) and a nodejs version (.js) for the tools.
Nodejs versions require installation of nodejs and npm, with the required packages installed.
The web version can be opened in a browser directly and will also be hosted on the Level Share Square website during its lifetime.

Web versions can be hosted publically with use of nginx: Make sure to create a new folder inside of the HTML5 folder in your build and name it. Inside of your new folder, you can place the .html file and rename it to `index.js`, then open the URL `https://YOUR_DOMAIN.TOP_LEVEL_DOMAIN/html5/FOLDER_NAME` on your site to view it. (only applicable if you own a domain)

### Image palette extractor tools

Find the web version on [Level Share Square](https://levelsharesquare.com/html5/palette_tool) or run the HTML file directly in your browser.

To run the nodejs version, run `node palette_tool.js` in your terminal at the target directory after installing nodejs & npm. Run the following commands in a terminal if they haven't been ran before:

- `npm i jimp`
- `npm i fs`
- `npm i path`

Please note that:

- The input accepts paths to images AND folders.
- The first image in a folder is ALWAYS used as a reference for how many RGB values to extract, meaning duplicates will be included to account for overlap.
- If your other palettes contain more colors, append "true" to the command to disable the first-image-reference (manual edits will be required).
