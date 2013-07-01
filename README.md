Boxxer - Layout manager
=======================

Boxxer is an open source project which aim to simplify the construction of complex layouts.

Here are the features aimed for. Not all have been implemented or are stable as yet.

* Automatic handling of layout element resizing
* Weight / Percentage / Fixed (px) dimension
* Server side layout persistence in node
* Programatic approach to layout
* Custom build capability
* Component interfaces
* Layout events firing
* Decorators API
* more...

## Grunt build

Node with npm required. Use npm to install grunt and then just run ```npm install``` inside the root directory.

```grunt``` Run the default build which does unit testing, concating, uglifying

```grunt deploy``` Run the default build and move the minified file to the server

```grunt watch``` Run the file watcher which concate files automatically

If adding file make sure to update the Gruntfile.js!

## Documentation

See [API](https://github.com/caplin/boxxer/wiki/API "View API on wiki") and the documentation directory everything is documented using jsdoc.

## Example

```javascript

    // Tile component
    var Tile = function() {
        this._element = document.createElement("div");
    };

    // implements Component and LifeCycle interfaces
    boxxer.mix(Tile, boxxer.Component);
    boxxer.mix(Tile, boxxer.LifeCycle);

    // throw an error if not implemented
    Tile.prototype.getElement = function() {
        return this._element;
    };

    Tile.prototype.onOpen = function(box) {
        console.log("tile", box.getId());
    };

    Tile.prototype.onRestore = function(box) {
        console.log("tile restored", box.getId());
    };

    Tile.prototype.onMaximize = function(box) {
        console.log("tile maximized", box.getId());
    };

    Tile.prototype.onMinimize = function(box) {
        console.log("tile minimized", box.getId());
    };

    // create our layout
    var frame = boxxer.createBox();
    var header = boxxer.createBox();
    var tileSet = boxxer.createBox({height:5, flow:boxxer.Box.FLOW_HORIZONTAL});
    var blotter = boxxer.createBox({height:2});

    // create a bunch of tiles
    for (var i = 0; i < 10; i++) {

        tileSet.addBox(boxxer.createBox({
            width: "200px",
            height: "200px",
            component: new Tile(),
            decorators: [
                "BoxHeader",
                "MaximizeButton",
                "MinimizeButton"
            ]
        }));
    }

    // add the lot to the frame
    frame.addBox(header).addBox(tileSet).addBox(blotter);

    // render the frame
    frame.render(true);

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
var frame = new boxxer.Box();

// name it
frame.setName("myLayout");

// code to create the layout here...

// store the layout
frame.saveLayout();

```

Retrieve a layout

```javascript

// create a box
var frame = new boxxer.Box();

// name it
frame.setName("myLayout");

// retrieve its layout
frame.getLayout();

```