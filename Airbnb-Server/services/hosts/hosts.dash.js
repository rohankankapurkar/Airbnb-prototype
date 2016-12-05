var process = require('process');
var MODE = process.env.MODE;
var addressValidator = require('address-validator');
var _ = require('underscore');
var idGenerator = require('../utils/utils.idgenerator');
var moment = require('moment');

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo.pool');
	var mysql = require('../utils/utils.mysql.pool');
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
		var users = mongo.collection("users");
		var output = [];

		users.findOne({"username":msg.username}, {"id":1}, function(err, result1){
			if(!err){
				coll.find({"host_id":result1["id"]},{"title":1, "review":1}).toArray(function(err, result){
					if(!err){
						var counter = 0;
						for(counter = 0; counter < result.length; counter++){
							var temp = {};
							if(result[counter].review != null){
								temp["prop_id"] = result[counter].title;
								temp["count"] = result[counter].review.length;
								output.push(temp);
							}
						}
						console.log("--- opt")
						console.log(output);


						res["data"] = output;
					}else{	
						res["statuscode"] = -1;
						res["message"] = "Unexpected error occurred while getting data from database";
					}
					callback(null,res);
				});
			}
		});
	});
}


exports.getPropertiesByHost = function(msg, callback){

	var res = {"statuscode":0, "message":""};
	mongo.connect(function(){

		var properties = mongo.collection("properties");
		var users = mongo.collection("users");

		users.findOne({username:msg.username},{id:1},function(err, result){
			if(!err){
				properties.find({host_id:result["id"]}, {"title":1}).toArray(function(err, result1){
					res["data"] = result1;
					console.log(result1);
					callback(null, res);
				});
			}
		});
	});
}

exports.getBidStats = function(msg, callback){

	var res = {"statuscode":0, "message":""};
	mongo.connect(function(){

		var bids = mongo.collection("bidlogs");

		bids.find({"title":msg.title}, {bid_time:1, bid_amount:1}).toArray(function(err, result){
			if(!err){
				res["data"] = result;	
			}
			else{
				res["message"] = "Error occurred while getting the bid data from the database";
			}
			callback(null, res);
		});
	});
}

