var hs, intID;

exports.ConnectHandler = function (socket) {
	// Get the Express session from handshake and make sure it does not expire
	hs		= socket.handshake,
	intID	= setInterval(function () {
		hs.session.reload(function() {
		hs.session.touch().save();
		});
	}, 60 * 1000);

	// Greet client
	socket.emit('conn', {
		message: 'RTN connection successful. Hello! ' + hs.sessionID
	});

	// Register each RTN server event
	for (var e in ServerEventHandlers) {
		socket.on(e, ServerEventHandlers[e]);
	}

	// Disconnect handler
	socket.on('disconnect', DisconnectHandler);
}

DisconnectHandler = function () {
	clearInterval(intID);
}

// The event handlers for socket events from client
ServerEventHandlers = {
	'message' : function (message) {

	}
}

// Client event handlers for events pushed down from server
// Normally these would be defined on the client, but they can
// be defined here and dropped in over res.locals
ClientEventHandlers = {

}
exports.getClientEvents = function () {
	return ClientEventHandlers;
}
