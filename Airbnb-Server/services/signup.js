var process = require('process');
var encryption = require('./utils/utils.encryption');

var MODE = process.env.MODE;

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('./utils/utils.mongo');
}else{
	var mongo = require('./utils/utils.mongo');
}


exports.signupUser = function(msg, callback){
	
	var res = {};
	mongo.connect(function(){
		var coll = mongo.collection('users');
		
		coll.findOne({username:msg.username},function(err, user){
			if(user){
				res.message = "User already exists";
			}else{
				msg['password'] = encryption.encrypt(msg['password']);
				
				//insert user details into the db
				msg['ishost']=  false;
				coll.insertOne(msg, function(err, user){
					if(user){
						// return status = 0 on successfull registration
						res.statuscode = 0;
				 	}else{
						// return 1 if any error occurs
						res.statuscode = 1;
						res.message = "Error occurred while registering the user";
					}
				});
			}
			callback(null, res);
		});				
	});
}
