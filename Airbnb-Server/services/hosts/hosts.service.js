var process = require('process');
var MODE = process.env.MODE;
var addressValidator = require('address-validator');
var _ = require('underscore');
var idGenerator = require('../utils/utils.idgenerator');
var moment = require('moment');
var redis = require("../utils/redis-cache");

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo.pool');
	var mysql = require('../utils/utils.mysql.pool');
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
								console.log("Inserted into avaible dates");
								if(result){
									mysql.executeSimpleQuery("SELECT * FROM AVAILABLE_DATES", {}, function(resultDates){
										console.log("Selected again from avaiable dates to update the cache");
										redis.cacheDates(resultDates)
									});
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
			console.log("This is the result I got from cache : " + result);
			console.log("result : " + result[0]["from_date"]);
			console.log("result : " + result[0]["till_date"]);
			var counter = 0;
			for( counter = 0; counter < result.length; counter++){
				console.log("I am here" + result[counter]);
				var startDate = result[counter]['from_date'];
				var EndDate = result[counter]['till_date'];
				startDate = new Date(startDate);
				EndDate = new Date(EndDate);
				var currentDate = startDate;
				console.log(startDate);
				console.log(EndDate);
				console.log(currentDate);
				while(currentDate < EndDate){
					console.log("Hey there I am here");
					dates.push(moment(currentDate).format('MM/DD/YYYY'));
					currentDate = moment(currentDate).add(1, 'days');
					console.log(currentDate);
					console.log(EndDate);
				}
			}
			res['statuscode'] = 0;
			res['data'] = dates;
		}
		callback(null, res);
	});
}



exports.checkPropertyAvailable = function(msg, callback){

	var res = {"statuscode" : 0, "message":""};

	var propid = msg.propid;
	var fromdate = msg.fromdate;
	var tilldate = msg.tilldate;
	var userid = msg.userid;

	var params = {"prop_id" : propid};
	res['data'] = {"avaiable" : false};


	mysql.executeQuery("SELECT * FROM AVAILABLE_DATES WHERE ? ", params, function(result){
		console.log(result);
		if(result){
			var counter = 0;
			for(counter = 0; counter < result.length; counter++){

				var fromdate_db = moment(result[counter]['from_date']).format('YYYY-MM-DD');
				var tilldate_db = moment(result[counter]['till_date']).format('YYYY-MM-DD');

				if(fromdate >= fromdate_db && tilldate <= tilldate_db){
					res['data'] = {"avaiable" : true};
					break;
				}

			}
		}
		callback(null, res)
	});
}


exports.approveUserRequest = function(msg, callback){

	var res = {"statuscode" : 0, "message":""};
	console.log('Congrats');
	var user_id = msg.userid;
	var prop_id =  msg.propid;
	var from_date = msg.fromdate;
	var till_date = msg.tilldate;

	console.log(from_date + "------" + till_date + user_id + prop_id);
	// This will get the user which is to be approved:
	var params1 = [{"user_id" : user_id},{ "prop_id" : prop_id}, {"approved" : 0}, {"from_date":from_date},{"till_date":till_date}]
	mysql.executeQuery('SELECT * FROM BOOKED_PROPERTIES WHERE user_id = "'+ user_id+'" AND prop_id = "'+prop_id+'" AND approved = 0 AND from_date = "'+from_date+'" AND till_date = "'+till_date+'"', {}, function(result1){

		if(result1){

			// Here the status as approved. that 1s
			var params2 = {"id":result1[0]["id"]};
			mysql.executeQuery("UPDATE BOOKED_PROPERTIES SET approved = 1 WHERE ? ", params2, function(result2){

				//This call database to update avaiable dates
				console.log(from_date +" - - "+ till_date);
				var params = [{"prop_id" : prop_id}, {"from_date":from_date}, {"till_date":till_date}];
				mysql.executeQuery('SELECT * FROM AVAILABLE_DATES WHERE prop_id = "'+ prop_id +'" AND from_date < "'+from_date+'" AND till_date > "'+till_date+'" ', {}, function(availableDatesResult){

					var idToDelete = availableDatesResult[0]['id'];

					var fromDate_1 = moment(availableDatesResult[0]['from_date']).format('YYYY-MM-DD');
					var tillDate_1 = moment(from_date).subtract(1, 'days').format('YYYY-MM-DD');
					var prop1 = {"prop_id": msg.propid, "from_date":fromDate_1, "till_date":tillDate_1, "id":0}; // id is auto increment, so does not matter the value.

					var fromDate_2 = moment(till_date).add(1, 'days').format('YYYY-MM-DD');
					var tillDate_2 = moment(availableDatesResult[0]['till_date']).format('YYYY-MM-DD');
					var prop2 = {"prop_id": msg.propid, "from_date":fromDate_2, "till_date":tillDate_2, "id":0};

					// Delete an existing available dates as it has been booked
					mysql.executeQuery("DELETE FROM AVAILABLE_DATES WHERE id = "+ idToDelete+"", {}, function(innerResult1){
						// nothing to do here with callback
						mysql.executeQuery("INSERT INTO AVAILABLE_DATES SET ? ", prop1, function(innerResult2){
							// nothing to do here with callback
							mysql.executeQuery("INSERT INTO AVAILABLE_DATES SET ? ", prop2, function(innerResult3){
								// nothing to do here with callback

								
								});
							});						
						});
					});

				//This call to database to update disapprove conflicting requests
				params3 = [{"prop_id" : prop_id}, {"approved" : 0}];
				mysql.executeQuery("SELECT * FROM BOOKED_PROPERTIES WHERE ?", params3, function(result3){
					console.log( "-------======== " + result3);
					if(result3){
						var counter = 0;
						for(counter  =0; counter < result3.length; counter++){

							var id = result3[counter]["id"];
							var fromDateTemp = moment(result3[counter]["from_date"]).format('YYYY-MM-DD');
							var tillDateTemp = moment(result3[counter]["till_dtae"]).format('YYYY-MM-DD');

							if( (fromDateTemp > from_date && fromDateTemp < till_date ) || (tillDateTemp > from_date && tillDateTemp < till_date) ){
								params4 = {"id" : id};
								mysql.executeQuery("UPDATE BOOKED_PROPERTIES SET approved = 2 where ?", params4, function(result4){})
							}
						}
					}
				});
				res["message"] = "Property has been approved";
				callback(null,res);
			});
		}else{
			res['message'] = ""
			callback(null, res);
		}
	});
}


exports.disapproveRequest = function(msg, callback){

	var res = {"statuscode":0, "message":""};
	var from_date = moment(msg.fromdate).format('YYYY-MM-DD');
	var till_date = moment(msg.tilldate).format('YYYY-MM-DD');

	var params = [{'user_id':msg.userid}, {'prop_id':msg.propid}, {'from_date':msg.fromdate}, {'till_date':msg.tilldate}];
	mysql.executeQuery('UPDATE BOOKED_PROPERTIES SET approved = 2 WHERE user_id = "'+msg.userid+'" AND prop_id = "'+msg.propid+'" AND from_date= "'+from_date+'" AND till_date = "'+till_date+'"', {}, function(result){

		res["message"] = "Disapproved"
		callback(null, res);
	});
}

// Here this will return prop id and user_id which are waiting for approvals.
exports.getPendingPropertyRequests = function(msg, callback){

	var res = {"statuscode":0, "message":""}
	var host_id = msg.host_id;

	var params = [{"host_id":host_id}, {"approved":0}];
	console.log(params);
	mysql.executeQuery('SELECT * FROM BOOKED_PROPERTIES WHERE approved = 0 and host_id = "'+ host_id +'" ', {}, function(result){
			res['data'] = result;
			callback(null, res);
	});

}


// This will return user and property data from mongo.
exports.getUserPropData = function(msg, callback){

	var res = {"statuscode" : 0, "message":""};
	var user_id = msg.userid;
	var prop_id = msg.propid;

	mongo.connect(function(){

		var coll = mongo.collection('users');
		var props = mongo.collection('properties');

		coll.find({'id':user_id}, function(err, result){

			if(!err){

				props.find({'id':propid}, function(err1, result1){

					if(!err1){
						result['propertydata'] = result1;
						res['data'] = result;
						callback(null, res);
					}
					else{
						res['statuscode'] = 1;
						res['message'] = "Unexpected error occurred while getting the user and property details"
						callback(null, res);

					}
				});
			}else{
				res['statuscode'] = 1;
				res['message'] = "Unexpected error occurred while getting the user and property detials"
				callback(null, res);
			}
		});
	});
}


exports.saveReview = function(msg, callback) {
	var res = {};
	mongo.connect(function () {
		var users = mongo.collection('users');
		var property = mongo.collection('properties');
		console.log("The user name is" + msg.username);
		console.log("The property is " + msg.propertyId);

		users.findOne({username: msg.username}, function (err, user) {
			if (user) {
				res.message = "Found the user";
				console.log("printing the mess" + msg.username);
//printing the complete JSON man{"firstname":"bapu","lastname":"chandan","user_sex":"Female","username":"slash@gmail.com","user_phone":"1111","user_preferred_locale":"ca","user_native_currency":"BRL","user_city":"dan","user_about":"san"}

				property.findOne({id: msg.propertyId}, function (err, properties) {
					if (properties) {
						var reviewArray;
						if (properties.review) {
							reviewArray = properties.review;
						} else {
							reviewArray = [];
						}
						var review = {
							rating: msg.ratings,
							reviewPost: msg.reviewPost,
							propImage: msg.propImage,
							from: user.firstname
						};
						reviewArray.push(review);
						property.updateOne({id: msg.propertyId}, {$set: {review: reviewArray}}, {upsert: true}, function (err, user) {
							if (user) {
								// return status = 0 on successfull registration
								console.log("posted the review successfully");
								res.statuscode = 0;
								callback(null, res);

							} else {
								// return 1 if any error occurs
								res.statuscode = 1;
								res.message = "Error occurred while posting the property's review";
								callback(null, res);

							}
						});
					} else {
						res.message = "No properties found. Error";
						callback(null, res);
					}
				});
			} else {

				res.message = "No user found. Error";
				callback(null, res);

			}
		});
	});
}

exports.getReviews = function(msg, callback) {
	var res = {};
	mongo.connect(function () {
		var users = mongo.collection('users');
		var property = mongo.collection('properties');
		console.log("The user name is" + msg.username);
		console.log("The property is " + msg.propertyId);
		property.findOne({id: msg.propertyId}, function (err, properties) {
			if (properties) {
				var reviewArray;
				if (properties.review) {
					res.statuscode = 0;
					res.review = properties.review;
					callback(null, res);
				} else {
					res.statuscode = 1;
					res.message = "No reviews found for this property";
					callback(null, res);
				}
			} else {
				res.message = "No properties found. Error";
				callback(null, res);
			}
		});
	});
}


// This will return history of hosts booked properties
exports.getPropertiesHistory = function(msg, callback){
	var res = {"statuscode":0, "message":""}
	var host_id = msg.host_id;
	var params = [{"host_id":host_id}, {"approved":1}];
	console.log(params);
	mysql.executeQuery('SELECT * FROM BOOKED_PROPERTIES WHERE host_id = "'+host_id+'" AND approved = 1 AND till_date  < now()', {}, function(result)
	{

		res['data'] = result;
		callback(null, res);
	});
}

exports.updateListing = function(msg, callback){
console.log("**************UPDATE LISTING**********");
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
				console.log("**************update LISTING rooms**********"+msg.roomsinproperty);
								var uid = user.id;

				//insert property in the property collection

				prop.updateOne({id:msg.id},{$set : {guestaccess:msg.guestaccess, roomsinproperty:msg.roomsinproperty, totbedsavailable:msg.totbedsavailable, noofguests:msg.noofguests, bedsforuse:msg.bedsforuse, bathsforuse:msg.bathsforuse, street:msg.street, apt:msg.apt, city:msg.city, state:msg.state, zip:msg.zip, country:msg.country, description:msg.description, title:msg.title, price:msg.price, currency:msg.currency, biddingavailable:msg.biddingavailable}},{upsert:true}, function(err, user){
					if(!err){
						res['statuscode'] = 0;
						res['message'] = "Your request has been submitted for approval.";
					}else{
						res['statuscode'] = 1;
						res['message'] = "Unexpected error occurred while performing database operation";
					}
					callback(null, res);
				});
			}
		});
	});
}

exports.updateTrip = function(msg, callback){

	var res = {"statuscode" : 0, "message" : ""};

	var user_id = msg.user_id;
	var prop_id = msg.prop_id;
	var from_date = msg.from_date;
	var till_date = msg.till_date;
	var from_date_old = msg.from_date_previous;
	var till_date_old = msg.till_date_previous;

	console.log(user_id + prop_id + from_date + till_date+ from_date_old + till_date_old);
	mysql.executeQuery('SELECT * FROM BOOKED_PROPERTIES WHERE prop_id = "'+prop_id+'" AND user_id = "'+user_id+'" AND from_date = "'+from_date_old+'" AND till_date =  "'+till_date_old+'"', {}, function(result){

		id = result[0]["id"];
		mysql.executeQuery('UPDATE BOOKED_PROPERTIES SET from_date = "'+from_date+'" , till_date = "'+till_date+'" WHERE id = '+id+'', {}, function(result1){
			result["message"] = "Dates updated successfully";
			callback(null, res);
		});
	});
}



exports.deleteTrip = function(msg, callback){

	console.log("-----------deleteTrip server----------");
	var res = {"statuscode" : 0, "message" : ""};

	var user_id = msg.user_id;
	var prop_id = msg.prop_id;
	var from_date = msg.from_date;
	var till_date = msg.till_date;

	console.log(user_id + prop_id + from_date + till_date+ from_date + till_date);
	mysql.executeQuery('DELETE FROM BOOKED_PROPERTIES WHERE prop_id = "'+prop_id+'" AND user_id = "'+user_id+'" AND from_date = "'+from_date+'" AND till_date =  "'+till_date+'"', {}, function(result){

		res["message"] = "Trips deleted successfully";
		callback(null, res);

	});
}
