var process = require('process');

var MODE = process.env.MODE;

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('./utils/utils.mongo');
}else{
	var mongo = require('./utils/utils.mongo');
}


exports.signinUser = function(msg, callback){
	
	var res = {};
	
	mongo.connect(function(){
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

