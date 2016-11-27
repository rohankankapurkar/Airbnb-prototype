var process = require('process');
var MODE = process.env.MODE;


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
		coll.find({approved:false}).toArray(function(err, result){
			if(err){
				res['statuscode'] = 1;
				res['message'] = "Unexpected error occurredd while getting the pending requests";
			}else{
				console.log('Hey  hey : ' + result);
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



// This function searches the host's based on area.
exports.searchHosts = function(msg, callback){

	var res = {};
	var ids =[];


	mongo.connect(function(){

		var hosts = mongo.collection('users');
		var props  =mongo.collection('properties');


		props.find({city:msg.area}).toArray(function(err, result){

			if(err){
				console.log('Error occurred while getting the properties collection');
				res['statuscode'] = 1;
				res['message'] = "Unexpected error occurred on the server.";
				callback(null, res);
			}else{

				// get all hosts from users collection using host_id from properties results
				for (var i = 0; i < result.length; i++) {
					ids.push(result[i].host_id);
				}
				hosts.find({id:{$in:ids}}).toArray(function(err, resultHosts){
					if(err){
						console.log("Error occurred while getting the Hosts");
						res['statuscode'] = 1;
						res['message'] = "Unexpected Error occurred on server while getting the hosts";
					}else{
						res['statuscode'] = 0;
						res['data'] = resultHosts;
					}
					callback(null, res);
				});
			}
		});
	});
}
