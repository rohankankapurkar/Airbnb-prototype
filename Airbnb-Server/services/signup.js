var process = require('process');
var encryption = require('./utils/utils.encryption');
var ssn = require('ssn');
var idGenerator = require('./utils/utils.idgenerator');

var MODE = process.env.MODE;

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('./utils/utils.mongo.pool');
}else{
	var mongo = require('./utils/utils.mongo');
}


exports.signupUser = function(msg, callback){
	
	//This function creates unique auto increment id in ssn format.
	idGenerator.generateID(function(counter){

		var res = {statuscode : 0, message : ""};
		mongo.connect(function(){
			var coll = mongo.collection('users');

			coll.findOne({username:msg.username},function(err, user){
				if(user){
					res.statuscode = 1;
					res.message = "User already exists";
				}else{
					msg['password'] = encryption.encrypt(msg['password']);

				//insert user details into the db
				ssnId = ssn.generate();
				msg['ishost']=  false;
				msg['id'] = counter;
				coll.insertOne(msg, function(err, user){
					if(user){
						// return status = 0 on successfull registration
						res['statuscode'] = 0;
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
});
}
