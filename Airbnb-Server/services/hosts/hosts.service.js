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


exports.checkIsHost = function(msg, callback){

	var res = {};
	mongo.connect(function(){
		var coll = mongo.collection('users');

		coll.findOne({username:msg.username},{"_id":0, "ishost":1}, function(err, result){
			if(result){
				res['statuscode'] = 0;
				res['data'] = result;
			}else{
				res['statuscode'] = 1;
				res['message'] = "Error occurred while checking if the user is host or not";
			}
			callback(null, res);
		});
	});
}


//This service will return the address that can be mapped on the google map.
exports.validateAddress = function(msg, callback){

	var res = {}
	var matchedAddress = "";
	var guessedAddress = "";

	address = msg.address;
	
	addressValidator.validate(address, addressValidator.match.streetAddress, function(err, exact, inexact){

		_.map(exact, function(a) {
			matchedAddress = a.toString();
		});

		_.map(inexact, function(a) {
			guessedAddress = a.toString();
		});

		// First check for matchedAddress in response, if it then use that address.
		// If matched is "" and guessedAddrerss is present then use guessedAddress as that can be mapped on google map.
		// Example: input address: '329, Nort First street, San Jose , CA, USA'  // Notice the typo: Nort => North
		// 			guessedAddress : '329 North 1st Street, San Jose, CA, US'   // This is required address for google map
		var data = {"matchedAddress":matchedAddress, "guessedAddress":guessedAddress}
		
		res['statuscode'] = 0;
		res['data'] = data;
		callback(null, res);
	});
}


exports.becomeHost = function(msg, callback){

	var res = {statuscode : 0, message : ""};
	mongo.connect(function(){

		var coll = mongo.collection('users');
		var prop = mongo.collection('properties');

		//check for user in the db with given username
		coll.findOne({username:msg.username}, function(err, user){

			if(err){
				res['statuscode'] = 1;
				res['message'] = "Unexpected error occurred while adding property";
			}
			if(user){
				// user exists in db
				// delete user name from request and add host_id as we are inserting this document in property collection.
				var hostUsername = msg['username'];
				delete msg['username'];
				msg['host_id'] = user['id'];

				//insert property in the property collection
				prop.insertOne(msg, function(err, propResult){
					if(!err){

						// Now property has been added. Check is host has approval
						if(user.hasOwnProperty('approved')){
							res['statuscode'] = 0;

							// host has been approved already, then send him final message of acknoweldgement 
							if(user['approved'] == true){
								res['message'] = "Your proprty has been listed. Congratulations!!!";
							}else{   // host is not approved yet, approved=false means host already requested, so ask hime to be patient.
								res['message'] = "Your request to become host is in process. Be patient."
							}

							callback(null,res);

						}else{ // approved does not exists in document, means user is becoming host for first time. so add 'approved = false' key in document.
							coll.updateOne({username:hostUsername},{$set:{ishost:true, approved:false}}, function(err, result){
								// Now ishost=true mean user became host and awaiting for approval. 
								// approved=false, means admin will approve it and approved will become true for SURE :D.
								if(!err){
									res['statuscode'] = 0;
									res['message'] = "Your request has been submitted for approval.";
								}else{
									res['statuscode'] = 1;
									res['message'] = "Unexpected error occurred while sending your request for approval";
								}
								callback(null, res);
							});
						}
					}else{
						res['statuscode'] = 1;
						res['message'] = "Unexpected error occurred while performing database operation";
						callback(null, res);
					}
				});
			}
		});
	});
}

