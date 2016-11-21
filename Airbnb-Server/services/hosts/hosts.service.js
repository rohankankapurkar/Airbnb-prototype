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
