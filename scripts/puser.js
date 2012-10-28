var db = require('../db.js');


var daemon
={

    _run : function()
    {
        db.Models.processUser
            .All()
            .success(function (users)
            {
                for (var user in user)
                {
                    if(user.DELETE)
                        console.log("Delete user: " + user.UUID);
                }
            }
}
