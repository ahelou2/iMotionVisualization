var express = require("express");
var bodyParser = require("body-parser");
var app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('visualize'));
app.use(express.static('helpers'));
app.use(express.static('node_modules/three/examples/js/controls'));
app.use(express.static('node_modules/three/examples/js/libs'));
app.use(express.static('node_modules/three/examples/js'));
app.use(express.static('node_modules/three/build'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.motionData = {
	buffer: new Array(1),
	writeIdx: 0,
	readIdx: 0,
};
 
var routes = require("./routes/routes.js")(app);
 
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});