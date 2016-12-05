var process = require('process');
var MODE = process.env.MODE;


//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo.pool');
	var mysql = require('../utils/utils.mysql.pool');
}else{
	var mongo = require('../utils/utils.mongo');
	var mysql = require('../utils/utils.mysql');
}

exports.getTrips = function(msg, callback){
    console.log("------------getTrips server---------------");
    console.log(msg.userId);
    var res = {statuscode : 0, message : ""};
    var user_id = msg.userId;
		var booking_params = {"user_id": user_id};

		if(user_id)
	    mysql.executeQuery("SELECT * FROM BOOKED_PROPERTIES WHERE ?", booking_params, function(booking_result){
	        console.log("booking_result");
	        console.log(booking_result);
	        if(booking_result) {
	            console.log('Selecting trips from booking table');
	            console.log(booking_result);
	            res['statuscode'] = 0;
	            res['message'] = "Get bookings for this user";
	            res['data'] = booking_result;
	            callback(null, res);
	        }else{
	            res['statuscode'] = 1;
	            res['message'] = "Error ocurred while retrieving BOOKED_PROPERTIES";
	            callback(null, res);
	        }
	    });
		else if(msg.date) {
				var from_date = msg.date.from_date,
						till_date = msg.date.till_date;

				console.log("-------------date range booking_result------------");
				mysql.executeQuery('SELECT * FROM BOOKED_PROPERTIES WHERE from_date >= "'+from_date+'" AND till_date <= "'+till_date+'" ', function(err, all_booking_result){
						if(err)
								console.log(err);
						console.log("------------all booking_result with date range---------");
						console.log(all_booking_result);
						if(all_booking_result) {
								console.log('Selecting trips from booking table');
								console.log(all_booking_result);
								res['statuscode'] = 0;
								res['message'] = "Get bookings";
								res['data'] = all_booking_result;
								callback(null, res);
						}else{
								res['statuscode'] = 1;
								res['message'] = "NO BOOKING DATA FOUND";
								callback(null, res);
						}
				});
		}else {
				mysql.executeQuery("SELECT * FROM BOOKED_PROPERTIES", function(err, all_booking_result){
						if(err)
								console.log(err);
						console.log("------------all booking_result---------");
						console.log(all_booking_result);
						if(all_booking_result) {
								console.log('Selecting trips from booking table');
								console.log(all_booking_result);
								res['statuscode'] = 0;
								res['message'] = "Get bookings";
								res['data'] = all_booking_result;
								callback(null, res);
						}else{
								res['statuscode'] = 1;
								res['message'] = "NO BOOKING DATA FOUND";
								callback(null, res);
						}
				});
		}

}

exports.getPropertiesForUserTrips = function(msg, callback){
    console.log("------------getPropertiesForUserTrips server---------------");
		console.log(msg);
    var res = {statuscode : 0, message : ""},
				propertyIdArray = [];

				//improve code here

		for(var i=0; i<msg.properties.length; i++) {
			propertyIdArray.push(msg.properties[i].prop_id);
		}
		console.log(propertyIdArray);
    if(propertyIdArray.length > 0) {
      mongo.connect(function(){
        var coll = mongo.collection('properties');

        coll.find({id: {$in: propertyIdArray}}, {
					_id: 1,
					description: 1,
					title: 1,
					price: 1,
					from: 1,
					till: 1,
					host_id: 1,
					id: 1,
					images: 1
				}).toArray(function(err, result){
          console.log("-----------properties result--------");
          console.log(result);
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
    }else {
      callback(null, null);
    }

};

exports.getUserAndProperty = function(msg, callback){
	console.log("------------getUserAndProperty server---------------");
	console.log(msg);
	var res = {statuscode : 0, message : ""},
			properties = msg.properties,
			prop_ids = [],
			user_ids = [],
			updatedPendingApprovals = {};

	//seperate user properties and user_id
	for(var i=0; i<properties.length; i++) {
		prop_ids.push(properties[i].prop_id);
		user_ids.push(properties[i].user_id);
		user_ids.push(properties[i].host_id);
	}
	console.log(prop_ids);
	console.log(user_ids);

	mongo.connect(function(){
		var collProp = mongo.collection('properties');
				collUser = mongo.collection('users');

		collProp.find({id: {$in: prop_ids}}, {
			_id: 1,
			description: 1,
			title: 1,
			price: 1,
			from: 1,
			till: 1,
			host_id: 1,
			id: 1,
			street :1,
			noofguests:1,
			guestaccess:1,
			images: 1
		}).toArray(function(err, updatedProperties){
				if(err)
					console.log(err);
				console.log("--------------getUserAndProperty properties es---------------");
				console.log(updatedProperties);


						collUser.find({id: {$in: user_ids}}).toArray(function(err, updatedUser){
								if(err)
									console.log(err);
								console.log("--------------getUser es---------------");
								console.log(updatedUser);

								updatedPendingApprovals = {
									updatedProperties: updatedProperties,
									updatedUser: updatedUser
								};
								res['result'] = updatedPendingApprovals;

								callback(null, res);
						});


		});


	})

};


exports.getPropertiesForBidding = function(msg, callback){
		console.log("------------Properties For Bidding server---------------");
		console.log(msg);
		var res = {statuscode : 0, message : ""};


		mongo.connect(function(){
			var coll = mongo.collection('properties');

			coll.find({id: {$in: msg.propertyIds}}, {
				_id: 1,
				description: 1,
				title: 1,
				price: 1,
				from: 1,
				till: 1,
				host_id: 1,
				id: 1,
				images: 1
			}).toArray(function(err, updatedProperties){
					if(err)
						console.log(err);
					console.log("--------------Properties For Bidding---------------");
					console.log(updatedProperties);

					res['data'] = updatedProperties;
					callback(null, res);

			});


	})

};
