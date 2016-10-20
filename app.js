var express = require("express");
var bodyParser = require("body-parser");
var app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('visualize'));
app.use(express.static('node_modules/three/examples/js/libs'));
app.use(express.static('node_modules/three/examples/js'));
app.use(express.static('node_modules/three/build'));

// app.use('/', require('redirect-https')({
//   body: '<!-- Hello Mr Developer! Please use HTTPS instead -->',
//   port: 3000,
//   trustProxy: true,
// }));

app.motionData = {
	buffer: Array(1000).fill("NO DATA"),
	writeIdx: 0,
	readIdx: 0,
};
 
var routes = require("./routes/routes.js")(app);
 
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});