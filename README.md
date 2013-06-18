Boxxer - Frame manager
=======================

Boxxer is an experiment to replace webcentric without the CSS3 box layout but similar to it.

# Grunt build

Node with npm required. Use npm to install grunt and then just run ```npm install``` inside the root directory.

```grunt```
Run the default build which does unit testing, concating, uglifying

```grunt deploy```
Run the default build and move the minified file to the server

```grunt watch```
Run the file watcher which concate files automatically

If adding file make sure to update the Gruntfile.js!