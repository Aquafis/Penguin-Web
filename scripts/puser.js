var db = require('../db.js');

function Run() {
	db.Connect();
	db.fetchModels();
}

function Process() {
	db.Models.processUser
		.all()
		.success(function (users)
		{
            var dcount=0, pcount=0;
			for (var i in users)
			{
				if(users[i].DELETE)
                {	console.log("Delete user: " + users[i].UUID); dcount++  }
                if(!users[i].PROCESS)
                {    console.log("Processed user: " + users[i].UUID); pcount++  }
			}
            

            console.log("Deletable users:" + dcount);
            console.log("Processed users:" + pcount);
		})
		.error(function (err)
        {
            console.log(err);
        });
}

exports.Run = Run;
exports.Process = Process;
Run();
Process();
