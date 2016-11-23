var process = require('process');
var MODE = process.env.MODE;
var addressValidator = require('address-validator');
var _ = require('underscore');

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo');
}else{
	var mongo = require('../utils/utils.mongo');
}


// This function gets all pending requests from host
exports.getPendingRequests = function(msg, callback){

	var res = {};

	mongo.connect(function(){

		coll = mongo.collection('users');

		// approved=false, means waiting for approval from admin
		coll.find({approved:false}, function(err, result){
			if(err){
				res['statuscode'] = 1;
				res['message'] = "Unexpected error occurredd while getting the pending requests";
			}else{
				res['statuscode'] = 0;
				res['data'] = result;
			}
			callback(null, res);
		});
	});
}


// This function approves the host's requests.
exports.approveRequest = function(msg, callback){

	var res = {};

	mongo.connect(function(){

		coll = mongo.collection('users');

		// make approved=true, which means theta host request has been approved
		coll.updateOne({username:msg.username},{$set:{approved:true}}, function(err, result){

			if(err){
				res['statuscode'] = 1;
				res['message'] = "Unexpected error occurred while approving request of host";
			}
			else{
				res['statuscode'] = 0;
				res['message'] = "Request has been approved";
			}
			callback(null,  res);
		});
	});
}