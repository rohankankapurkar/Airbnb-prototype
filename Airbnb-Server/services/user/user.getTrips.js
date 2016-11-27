var process = require('process');
var MODE = process.env.MODE;


//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo');
	var mysql = require('../utils/utils.mysql');
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

}

exports.getPropertiesForUserTrips = function(msg, callback){
    console.log("------------getPropertiesForUserTrips server---------------");
    var res = {statuscode : 0, message : ""};
    var propertyIdArray = msg.properties;

    if(propertyIdArray.length > 0) {
      mongo.connect(function(){
        var coll = mongo.collection('properties');

        coll.find({_id: {$in: propertyIdArray}}, function(err, result){
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

}
