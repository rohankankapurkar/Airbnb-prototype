var process = require('process');
var MODE = process.env.MODE;

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo');
}else{
	var mongo = require('../utils/utils.mongo');
}


exports.checkIsHost = function(msg, callback){

	var res = {};
	mongo.connect(function(){
		var coll = mongo.collection('users');

		coll.findOne({username:msg.username},{"_id":0, "ishost":1}, function(err, result){
			if(result){
				res.statuscode = 0;
				res.data = result;
			}else{
				res.statuscode = 1;
				res.message = "Error occurred while checking if the user is host or not";
			}
			callback(null, res);
		});
	});
}

