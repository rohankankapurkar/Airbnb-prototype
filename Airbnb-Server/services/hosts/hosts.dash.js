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


exports.getClickPerPage = function(msg, callback){

	var res = {"statuscode":0,"message":""};

	mongo.connect(function(){

		var coll = mongo.collection("clicklogs");

		coll.aggregate([    
				{$group:{_id: "$pageurl",count : {$sum : 1}}},
				{$sort: { count: -1}}]).toArray(function(err, result){
					if(err){
						res['statuscode'] = 1;
						res['message'] = "Unexpected error occurred while getting data from database";
					}else{
						console.log("In the getClick results");
						console.log(result);
						res['statuscode'] = 0;
						res['data'] = result;
					}
					callback(null, res);
				});
		});
}


exports.getClickPerProperty = function(msg, callback){

	var res = {"statuscode":0,"message":""};
	mongo.connect(function(){

		var coll = mongo.collection("propertylogs");
		console.log("User ------ >")
		console.log(msg.username);
		coll.aggregate([  
				{$match : {hostname : msg.username}},  
				{$group:{_id: "$property",count : {$sum : 1}}},
				{$sort: { count: -1}}]).toArray(function(err, result){
					if(err){
						res['statuscode'] = 1;
						res['message'] = "Unexpected error occurred while getting data from database";
					}else{
						console.log("In the getClick results");
						console.log(result);
						res['statuscode'] = 0;
						res['data'] = result;
					}
					callback(null, res);
				});
		});
}


exports.getAreaSeen = function(msg, callback){
	var res = {"statuscode":0,"message":""};
	mongo.connect(function(){

		var coll = mongo.collection("propertylogs");

		coll.aggregate([    
				{$group:{_id: "$city",count : {$sum : 1}}},
				{$sort: { count: -1}}]).toArray(function(err, result){
					if(err){
						res['statuscode'] = 1;
						res['message'] = "Unexpected error occurred while getting data from database";
					}else{
						console.log("In the getClick results");
						console.log(result);
						res['statuscode'] = 0;
						res['data'] = result;
					}
					callback(null, res);
				});
		});
}


exports.getReviewCount = function(msg, callback){
	console.log("inside the getreviewcount rohan");

	var res = {"statuscode":0,"message":""};
	var username = msg.username;
	mongo.connect(function(){

		var coll = mongo.collection("properties");
		var output = [];
		coll.find({"host_id":msg.host_id},{"prop_id":1, "review":1}).toArray(function(err, result){

			console.log(err + "rohankanka");
			console.log(JSON.stringify(result)+ "rohan");

			if(!err){




				var counter = 0;
				for(counter = 0; counter < result.length; counter++){
					var temp = {};
					if(result[counter].review != null){
						temp["prop_id"] = result[counter].id;
						temp["count"] = result[counter].review.length;
						output.push(temp);
					}

				}
				res["data"] = output;
				console.log("lala "+output);
			}else{
				console.log("Unexpected error occurred while getting daata from database");
				res["statuscode"] = -1;
				res["message"] = "Unexpected error occurred while getting daata from database";
			}
			//console.log("lala "+JSON.stringify(res));

			callback(null,res);
		});
	});
}