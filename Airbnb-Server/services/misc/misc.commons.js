var process = require('process');
var MODE = process.env.MODE;
var addressValidator = require('address-validator');
var _ = require('underscore');

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo.pool');
}else{
	var mongo = require('../utils/utils.mongo');
}



// Service to check the user's credentials, if admin or host or neither.
exports.checkCredentials = function(msg, callback){

	var res = {};
	mongo.connect(function(){
		var coll = mongo.collection('users');
		coll.findOne({username:msg.username},{"_id":0, "ishost":1, "isadmin":1, "id":1}, function(err, result){
			if(result){
				res['statuscode'] = 0;
				res['data'] = result;
			}else{
				res['statuscode'] = 1;
				res['message'] = "Error occurred while checking the user's credentials";
			}
			callback(null, res);
		});
	});
}

exports.getUserId = function(msg, callback){

	var res = {};
	mongo.connect(function(){

		var col = mongo.collection()


	});
}