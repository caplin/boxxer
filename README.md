Boxxer - Frame manager
=======================

Boxxer is an experiment to replace webcentric without the CSS3 box layout but similar to it.

## Grunt build

Node with npm required. Use npm to install grunt and then just run ```npm install``` inside the root directory.

```grunt``` Run the default build which does unit testing, concating, uglifying

```grunt deploy``` Run the default build and move the minified file to the server

```grunt watch``` Run the file watcher which concate files automatically

If adding file make sure to update the Gruntfile.js!

## Usage

### Using the API

See [API](https://github.com/caplin/boxxer/wiki/API "View API on wiki") for more information

### Using classes directly

```javascript

var tiles = [];
var frame = new boxxer.Box("foo");

var header = new boxxer.Box();
var tileSet = new boxxer.Box(50, 50);
var blotter = new boxxer.Box(20, 20);

tileSet.setFlowDirection(boxxer.Box.FLOW_HORIZONTAL);

header.addClass("header");
tileSet.addClass("tileSet");
blotter.addClass("blotter");

for (var i = 0; i < 10; i++) {
    var box = new boxxer.Box("200px", "200px");
    new Tile(box);
    tileSet.addBox(box);
    tiles.push(box);
}

frame.addBox(header);
frame.addBox(tileSet);
frame.addBox(blotter);

window.onload = function () {
    frame.render();
    window.onresize = function () {
        frame.render();
    };
};

```

### Layout persistence

Requires the back-end to be running. If the box has a custom name set the name will be used in serialization and will
be used to store the file. The layout can then be retrieve by creating a box, giving it a name and call getLayout().

#### Running the back-end

The back-end is very basic at the moment and use file to store the layout.
From a command line tool go to server directory and run ```node index.js```.
There is a demo running on http://localhost:666.

Store a layout

```javascript

// create a box
var frame = new boxxerBox();

// name it
frame.setName("myLayout");

// code to create the layout here...

// store the layout
frame.saveLayout();

// retrieve a layout
frame.getLayout();

```

Retrieve a layout

```javascript

// create a box
var frame = new boxxerBox();

// name it
frame.setName("myLayout");

// retrieve its layout
frame.getLayout();

```