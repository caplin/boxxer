var url = require('url'),
    app = require("http").createServer(handler),
    fs = require('fs');

app.listen(666);
console.log('\033[32mBoxxer rocking on port \033[31m666\033[0m');

// TODO when auth is in place use username to store layouts
// TODO add persistence of custom data (not just layouts)

function handler (req, res) {

    req.layoutRequest = req.url.match(/\/layout\/(.*)/);

    if (req.layoutRequest) {
        req.layout = encodeURIComponent(req.layoutRequest[1]);
    }

    if (req.method === "POST" || req.method === "PUT") {

        req.body = "";

        req.on("data", function(chunk) {
            req.body += chunk;
        });

        req.on("end", function() {
            if (!req.layoutRequest) {
                req.body = JSON.parse(req.body);
            }
            handler[req.method.toLowerCase()](req, res);
        });

    } else if (req.method === "DELETE") {
        handler.delete(req, res);
    } else {
        handler.get(req, res);
    }
}

handler.get = function(req, res) {

    // return a layout
    if (req.layout) {
        fs.readFile("layouts/" + req.layout, function (error, data) {
            if (error) {
                res.writeHead(500);
                return res.end("Error reading layout file");
            }
            res.writeHead(200);
            return res.end(JSON.stringify({
                name: req.layout,
                layout: data.toString()
            }));
        });
        return;
    }

    // return layout list
    if (req.url === "/layouts") {
        fs.readdir("layouts", function (error, files) {
            var arr = [];
            files.forEach(function (file) {
                arr.push({name: file});
            });
            res.writeHead(200);
            res.end(JSON.stringify(arr));
        });
        return;
    }

    // Serve homepage
    if (req.url === "/") {
        req.url = "/index.html";
    }

    // Serve static files
    fs.readFile("client" + req.url, function (error, data) {
        if (error) {
            console.log(error);
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        return res.end(data);
    });
};

handler.delete = function(req, res) {

    // delete a layout
    if (req.layout) {
        fs.unlink("layouts/" + req.layout, function (error) {
            if (error) {
                console.log(error);
                res.writeHead(500);
                res.end('Error deleting layout');
            } else {
                res.writeHead(200);
                res.end();
            }
        });
    }
};

handler.post = function(req, res) {

    // update a layout
    if (req.layoutRequest) {
        fs.writeFile("layouts/" + req.layout, req.body, function (error) {
            if (error) {
                console.log(error);
                res.writeHead(500);
                res.end('Error saving layout');
            } else {
                res.writeHead(200);
                res.end();
            }
        });
    }
};

handler.put = function(req, res) {

    // store a NEW layout
    if (req.layoutRequest) {
        fs.writeFile("layouts/" + req.layout, req.body, function (error) {
            if (error) {
                console.log(error);
                res.writeHead(500);
                res.end('Error saving layout');
            } else {
                res.writeHead(200);
                res.end();
            }
        });
    }
};