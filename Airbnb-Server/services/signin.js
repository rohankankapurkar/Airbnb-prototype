var process = require('process');
var encryption = require('./utils/utils.encryption');

var MODE = process.env.MODE;

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('./utils/utils.mongo.pool');
}else{
	var mongo = require('./utils/utils.mongo');
}


exports.signinUser = function(msg, callback){
	
	var res = {};
	
	mongo.connect(function(){
		var coll = mongo.collection('users');
		msg.password = encryption.encrypt(msg.password);
		coll.findOne({username:msg.username, password :msg.password}, function(err, user){
			if (user) {
				// return status = 0 on successfull login
				res.statuscode = 0;
				coll.update({username:msg.username},{$set:{"lastLogin":(new Date()).toString()}}, function(err, innerResult){
					if(!err){
						res.data = user;
						callback(null, res);	
					}
					
				});
			} else {
				// return status = 1 if login fails 
				res.statuscode = 1;
				res.message = "Username or Password is not valid";
				callback(null, res);
			}
		});
	});
}

