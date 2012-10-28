Nonsense = require ('./nonsense/Nonsense.js'),
util = require('../util.js');

var n = new Nonsense();

exports.randomPUser = function () {
	var PU = {
		UUID: n.uuid(),
		TOKEN: n.uuid(),
		DELETE: util.randBOOL(),
		PROCESS: util.randBOOL(),
		WAITING: util.randBOOL()	
	}
	return PU;
}
