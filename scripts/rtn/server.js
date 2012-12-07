var	io	= require('socket.io').listen(2007);
	
io.sockets.on('connection', function (socket) {
	console.log('INSIDE SOCKIO ONCONNECT');
	var hs = socket.handshake;
	console.log('SOCKET CONNECTION. SESSID: ' + hs.sessionID);

	var intID = setInterval(function () {
		hs.session.reload(function() {
			hs.session.touch().save();
		});
	}, 60 * 1000);
	socket.emit('conn', {success: 'RTN connection successful. Hello!'});
});

exports.broadcast = function (message) {
	io.sockets.emit('broadcast', {message: message});
}

exports.noficiations = {};

exports.getServer = function () {
	return io;
}
