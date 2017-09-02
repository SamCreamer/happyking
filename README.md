# happyking
Happy King is an online idle (clicker) game created by Sam Creamer. The code is now open source. Feel free to use it to fork or use it to learn. It is written in entirely in javascript.

To run, simply clone or download the repo and open `index.html` in a browser.

If you want to work on the project, just clone the repo and do `npm install` to get all the necessary modules.

This project uses browserify (or watchify) to compile the code into a bundle. If you wish to fork and develop this game, you will need to compile the JS into the bundle when you make changes. To compile, do the following:

`broswerify develop/main.js -o js/bundle.js`

If you are actively developing, you can use watchify instead (will automatically update the bundle whenever a relevant file is changed)

`watchify develop/main.js -o js/bundle.js -v`




