var process = require('process');
var MODE = process.env.MODE;
var addressValidator = require('address-validator');
var _ = require('underscore');
var idGenerator = require('../utils/utils.idgenerator');
var moment = require('moment');

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo');
	var mysql = require('../utils/utils.mysql');
}else{
	var mongo = require('../utils/utils.mongo');
	var mysql = require('../utils/utils.mysql');
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

				idGenerator.generateID(function(counter){
					// user exists in db
					// delete user name from request and add host_id as we are inserting this document in property collection.
					var hostUsername = msg['username'];
					delete msg['username'];
					msg['host_id'] = user['id'];
					msg['id'] = counter;

					//insert property in the property collection

					prop.insertOne(msg, function(err, propResult){
						if(!err){

							var fromDate = moment(msg['from']).format("YYYY-MM-DD");
							var tillDate = moment(msg['till']).format("YYYY-MM-DD");

							console.log("Hey there it is message : " + fromDate + tillDate);

							var params = {'prop_id': counter, 'from_date': fromDate, 'till_date': tillDate};
							mysql.executeQuery("INSERT INTO AVAILABLE_DATES SET ?", params, function(result){
								if(result){
									console.log('Updated avaiable dates successfully');
								}
							});


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
			});
		}
	});
});
}


// Get all properties of host for view/editing purpose.
exports.getMyProerties = function(msg, callback){

	var res = {"statuscode" : 0, message : ""}
	mongo.connect(function(){

		var coll = mongo.collection('users');
		var props  =mongo.collection('properties');

		// Get the user id using username from suers collection;
		coll.findOne({username : msg.username}, function(err, result){

			if(err){
				console.log('Error occurred while getting the user id from users collection');
				res['statuscode'] = 1;
				res['message'] = "Unexpected error occurred on the server.";
				callback(null, res);
			}else{

				// get all properties form properties collection using host_id
				props.find({host_id:result.id}).toArray(function(err, resultProperties){
					if(err){
						console.log("Error occurred while getting the properties");
						res['statuscode'] = 1;
						res['message'] = "Unexpected Error occurred on server while getting the peroperties";
					}else{

						res['statuscode'] = 0;
						res['data'] = resultProperties;
					}
					callback(null, res);
				});
			}
		});
	});	
}


// This returns all the available dates for particular property
exports.getAvailableDates = function(msg, callback){

	res = {"statuscode":0, "message":""};

	var params = {'prop_id':msg.prop_id};

	mysql.executeQuery("SELECT * FROM AVAILABLE_DATES where ?", params, function(result){
		if(result){
			var dates = [];
			var counter = 0; 
			for( counter = 0; counter < result.length; counter++){
				var startDate = result[counter]['from_date'];
				var EndDate = result[counter]['till_date'];
				var currentDate = startDate;
				while(currentDate < EndDate){
					dates.push(moment(currentDate).format('MM/DD/YYYY'));
					currentDate = moment(currentDate).add(1, 'days');
				}
			}
			res['statuscode'] = 0;
			res['data'] = dates;
		}
		callback(null, res);
	});
}



exports.approveUserRequest = function(msg, callback){

	var res = {"statuscode" : 0, "message":""};

	var disapproveParams = {"prop_id":msg.propid};
	var approveParams = {"user_id":msg.userid, "prop_id":msg.propid, "from_date":msg.fromdate,"till_date":msg.tilldate};
	var availableDatesParams = {'prop_id':msg.propid};

	//First disapprove all the requests for particular property
	mysql.executeQuery("UPDATE BOOKED_PROPERTIES SET approved = 2 WHERE ?", disapproveParams, function(disapproveResult){

		// now approve the request of selected user. user id passed from client.

		mysql.executeQuery("UPDATE BOOKED_PROPERTIES SET approved = 1 WHERE ? " , approveParams, function(approveResult){

			// Now property has been approved for user, lets update the avaiable dates.

			mysql.executeQuery("SELECT * FROM AVAILABLE_DATES WHERE prop_id = " + msg.propid + " AND from_date < "+ msg.fromdate + " AND till_date > " + msg.tilldate +" ", 
				{}, function(availableDatesResult){

				var idToDelete = availableDatesResult[0]['id'];
				var fromDate_1 = availableDatesResult[0]['from_date'];
				var tillDate_1 = moment(msg.from_date).subtract(1, 'days');
				var prop1 = {"prop_id": msg.propid, "from_date":fromDate_1, "till_date":tillDate_1};

				var fromDate_2 = moment(msg.tilldate).add(1, 'days');
				var tillDate_2 = availableDatesResult[0]['till_date'];
				var prop2 = {"prop_id": msg.propid, "from_date":fromDate_2, "till_date":tillDate_2};

				// Delete an existing available dates as it has been booked
				mysql.executeQuery("DELETE FROM AVAILABLE_DATES WHERE id = "+ idToDelete+"", {}, function(result1){
					// nothing to do here with callback
				});
				mysql.executeQuery("INSERT INTO AVAILABLE_DATES SET ? ", prop1, function(result2){
					// nothing to do here with callback
				});
				mysql.executeQuery("INSERT INTO AVAILABLE_DATES SET ? ", prop2, function(result3){
					// nothing to do here with callback
				});
			});
		});
	});
}

exports.saveReview = function(msg, callback){
	var res = {};
    mongo.connect(function(){
    var users = mongo.collection('users');
    var property = mongo.collection('properties');
    console.log("The user name is"+ msg.username);
    console.log("The property is "+msg.propertyId);

    users.findOne({username:msg.username},function(err, user){
        if(user){
            res.message = "Found the user";
            console.log("printing the mess"+msg.username);
//printing the complete JSON man{"firstname":"bapu","lastname":"chandan","user_sex":"Female","username":"slash@gmail.com","user_phone":"1111","user_preferred_locale":"ca","user_native_currency":"BRL","user_city":"dan","user_about":"san"}
			
			property.findOne({id:msg.propertyId}, function(err, properties){
				if(properties){
					var reviewArray;
					if(properties.review){
						reviewArray = properties.review;
					}else{
						reviewArray = [];
					}
					var review = {
						rating: msg.rating,
						reviewPost: msg.reviewPost,
						from: msg.username
					};
					reviewArray.push(review);
	                property.updateOne({id:msg.propertyId},{$set : {review:reviewArray}},{upsert:true}, function(err, user){
	                    if(user){
	                        // return status = 0 on successfull registration
	                        console.log("posted the review successfully");
	                        res.statuscode = 0;
	                        callback(null, res);

	                    }else{
	                        // return 1 if any error occurs
	                        res.statuscode = 1;
	                        res.message = "Error occurred while posting the property's review";
	                        callback(null, res);

	                    }
	                });
	            }else{
	            	res.message = "No properties found. Error";
            		callback(null, res);
	            }
            });
        }else{

         res.message = "No user found. Error";
            callback(null, res);

        }
    });
}

exports.getReviews = function(msg, callback){
	var res = {};
    mongo.connect(function(){
    var users = mongo.collection('users');
    var property = mongo.collection('properties');
    console.log("The user name is"+ msg.username);
    console.log("The property is "+msg.propertyId);	
	property.findOne({id:msg.propertyId}, function(err, properties){
		if(properties){
			var reviewArray;
			if(properties.review){
				res.statuscode = 0;
				res.review = properties.review;
				callback(null, res);
			}else{
				res.statuscode = 1;
				res.message = "No reviews found for this property";
				callback(null, res);
			}
        }else{
        	res.message = "No properties found. Error";
    		callback(null, res);
        }
    });
}