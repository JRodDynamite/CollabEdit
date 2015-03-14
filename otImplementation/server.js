var ot = require('ot');
var express = require('express');
var path = require('path');

var app = express();
var server = require('http').createServer(app);

  app.use('/', express.static(path.join(__dirname , './public')));

var io = require('socket.io').listen(server);

var port = 6587;
server.listen(port, function () {
		console.log("Listening to port " + port);
});

var str = "#include<iostream>\nusing namespace std;\nint main()\n{\n   return 0;\n}\n";

var socketIOServer = new ot.EditorSocketIOServer(str, [], 'demo', function (socket, cb) {
		cb(!!socket.mayEdit);
});

io.sockets.on('connection', function (socket) {
		socketIOServer.addClient(socket);
		socket.on('login', function (obj) {
			socket.mayEdit = true;
			socketIOServer.setName(socket, obj.name);
			socket.emit('logged_in', {});
		});
	});

