var mongo = require("./utils/utils.mongo")
var mongoURL = "mongodb://localhost:27017/test";

exports.signinUser = function(msg, callback){
	
	var res = {};
	
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('newCollection');

		coll.findOne({username:msg.username, password :msg.password}, function(err, user){
			if (user) {
				// return status = 0 on successfull login
				res.status = 0;
				res.data = user;
			} else {
				// return status = 1 if login fails 
				res.status = 1;
			}
			callback(null, res);
		});
	});
}

