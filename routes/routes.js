var appRouter = function(app) {

	app.get("/", function(req, res) {
		res.send("Hello World");
	});

	app.get("/account", function(req, res) {
		var accountMock = {
			"username": "nraboy",
			"password": "1234",
			"twitter": "@nraboy"
		}
		if(!req.query.username) {
			return res.send({"status": "error", "message": "missing username"});
		} else if(req.query.username != accountMock.username) {
			return res.send({"status": "error", "message": "wrong username"});
		} else {
			return res.send(accountMock);
		}
	});

	app.post("/login", function(req, res) {
		if(!req.body.username || !req.body.password || !req.body.twitter) {
			return res.send({"status": "error", "message": "missing a parameter"});
		} else {
			return res.send(req.body);
		}
	});

	app.get("/getMotionData", function(req, res) {
		let readIdx = app.motionData.readIdx;
		let bufferLength = app.motionData.buffer.length;
		if (app.motionData.buffer[readIdx] != null) {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(app.motionData.buffer[readIdx]));
			// res.send(app.motionData.buffer[readIdx]);
			app.motionData.buffer[readIdx] = null;
			app.motionData.readIdx = (readIdx + 1) % bufferLength;
			console.log("MOTION DATA SENT");
			return ;
		} else {
			return res.send({});
		}
	});
	
	app.post("/publishMotionData", function(req, res) {

		if(!req.body.motionData) {
			return res.send({"status": "error", "message": "missing a parameter"});
		} else {
			console.log("MOTION DATA RECEIVED");
			let writeIdx = app.motionData.writeIdx;
			let bufferLength = app.motionData.buffer.length;
			app.motionData.buffer[writeIdx] = req.body.motionData;
			app.motionData.writeIdx = (writeIdx + 1) % bufferLength;
			return res.send(req.body);
		}
	});

}

module.exports = appRouter;