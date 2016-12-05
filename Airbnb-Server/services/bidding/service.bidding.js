var process = require('process');
var MODE = process.env.MODE;
//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('./../utils/utils.mongo.pool');
}else{
	var mongo = require('./../utils/utils.mongo');
}

var dateFormat = require('dateformat');
var cronjob = require('cron').CronJob;
var moment = require('moment');
var mysql = require('./../utils/utils.mysql.js');

var mongoPropertyCollection = "properties";

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}

function getOpenBids(){
	var conditions = {bidFlag : "yes", propertysold : "no"};
	return conditions;
}

var bidJob = new cronjob('30 * * * * *', function(){
	console.log("Cron Running");
	mongo.connect(function(){
		var collection = mongo.collection(mongoPropertyCollection);
		var fields = {id : 1, title : 1,  bidEndDate : 1, currentBidder : 1, currentBid : 1, host_id : 1, from : 1, till : 1, city : 1}
		var query = getOpenBids();
		collection.find(query, fields).toArray(function(err, results){
			if(err)
			{
				console.log('Not able to fetch Property Data');
			}
			else
			{
				console.log(results);
				var currTime = getCurrentTime();
				var bidEndtime;
				for(var i = 0; i< results.length; i++)
				{
					bidEndtime = dateFormat(results[i].bidEndDate,"yyyy-mm-dd HH:MM:ss");
					
					if(bidEndtime < currTime)
					{
						var fromdate = moment(new Date(results[i].from)).format("YYYY-MM-DD");
						var tilldate = moment(new Date(results[i].till)).format("YYYY-MM-DD");
						var numOfDays = moment(tilldate).diff(fromdate, 'days');	
						var totalAmount = numOfDays * results[i].currentBid;
						updateBidFlag(results[i].id);
						recordBidTransaction(results[i].currentBidder, results[i].host_id, results[i].id, results[i].title, totalAmount, fromdate, tilldate, results[i].city);
					}
				}
			}
		});	
	})
}, 
function(){
	console.log("cronjob stopped")
}, 
true,
'America/Los_Angeles');

bidJob.start();


function updateBidFlag(id){
console.log("updating 1");
	mongo.connect(function(){
		var collection = mongo.collection(mongoPropertyCollection);
		collection.update({id : id}, {$set : {propertysold : "yes"}}, function(err, num, status){
	   		if(err)
	   		{
	   			console.log("Error in updation")
	   		}
	   	});
	});
}


function recordBidTransaction(bidder, host_id, propertyid, propertytitle, bid_amount, fromdate, tilldate, city){

	console.log("========Updating the Bid transaction of a User======");	
	try
	{
		mongo.connect(function(){
			var collection = mongo.collection("users");
			var counterBidTransaction = mongo.collection("counter");
			if(bidder != "")
			{
				counterBidTransaction.findAndModify(
					{_id:"id"},
					[],
					{$inc:{seq:1}}, 
					{new : true},
					function(err,doc){
						if(err)
						{
							console.log("======Unsuccessful Transaction=====");
							response = { valid: false, id: null, message : null}
						}	
						else
						{
							collection.findOne({username:bidder}, function(err, user){
								if (user) 
								{
									collection.update({username : bidder },{ $push : { bidswon : {
										trans_id : doc.value.seq,
										trans_type : 3, 
										userid : user.id, 
										propertyid: propertyid,
										host_id : host_id,
										propertytitle : propertytitle,
										trans_amount : bid_amount,
										fromdate : fromdate,
										tilldate : tilldate,
										trans_time: getCurrentTime(), 
										city : city,
										paid_flag : "N"}
									}},	function(err, records){
										if(err)
										{
											response = { valid: false, id: null, message : null}
										}
										else
										{	
											response = { valid: true, id: null, message : null};	
										}
									});//update bidswon by the user end
								} 
								else 
								{
									console.log("user not found")
								}
							});//get id of user end
						}//else end	
					}//counter function collection end
				);//counter collection end
			}

		});	
	}//try block end
	catch(error)
	{
		console.log("Error while updating the bids won by the user :"+error);
	}
}


exports.updateBidLog = function(message, callback){

	try
	{
		var propertyid = message.propertyid;
		var title = message.title;
		var bidamount = message.bidamount;
		var bidder = message.bidder;
		var timestamp = getCurrentTime();
		
		mongo.connect(function(){
			var collection = mongo.collection("users");
			var counterBidLog = mongo.collection("counter");
			var bidlogcollection = mongo.collection("bidlogs");
			counterBidLog.findAndModify(
				{_id:"id"},
				[],
				{$inc:{seq:1}}, 
				{new : true},
				function(err,doc){
					if(err)
					{
						console.log("Unsuccessful Transaction");
						var response = { statuscode: 1, propertyid: null, message : null}
						callback(null,response);
					}	
					else
					{
						bidlogcollection.insert({
							bid_id : doc.value.seq,
							id : message.propertyid,
							title : message.title,
							bid_amount : parseFloat(message.bidamount),
							bidder : message.bidder,
							bid_time : getCurrentTime()},

							function(err, records){
								if(err)
								{
									console.log("Unsuccessful Transaction");
									var response = { statuscode: 1, propertyid: null, message : null}
									callback(null,response);
								}
								else
								{
									response = { statuscode: 0, propertyid: null, message : null}
									console.log("bid log updated");
									
									collection.update({username : message.bidder}, { $push : { bids :{
										propertyid : propertyid, 
										title : title,
										bidamount : bidamount,
										bidder : bidder,
										timestamp : timestamp}}},
										function(err,results){
											if(err)
											{
												callback(null,response);
											}
											else
											{
												callback(null,response);
											}

									});
								}	
							});

						}	
					}
				);
			});
	}
	catch(error)
	{
		var response = {statuscode : 1, message : "Internal Server error occurred :"+error}
		console.log(response);
		callback(nul,response);
	}
}

exports.updatePropertyCollection = function(message, callback){
	mongo.connect(function(){
		console.log("Hello")
		var collection = mongo.collection("properties");
		console.log("upd propertycoll")
		collection.update({id : message.propertyid}, {$set : {currentBid : parseFloat(message.bidamount) , currentBidder : message.bidder}}, function(err, num, status){
	   		if(err)
	   		{
	   			console.log("Error in updation");
	   			var resposne = {statuscode : 1, message : "Error in updating property bid"}
	   			callback(null,response);
	   		}
	   		else
	   		{
	   			var response = {statuscode : 0, message : "Bid Updated"}
	   			callback(null, response);
	   		}
	   	});
	});
}



exports.checkout = function(message, callback){

	mongo.connect(function(){
 		var collection = mongo.collection("users");
 		collection.update({id : message.userid}, 
 			{$pull : {bidswon : { propertyid : message.propertyid }}}, function(err, num, status){
 	   		if(err)
 	   		{
 	   			console.log("Error in updation")
 	   		}
 	   	});
 	});

	var query = "INSERT INTO BOOKED_PROPERTIES VALUES ('"+message.propertyid+"','"+message.userid+"','"+message.host_id+"','"+message.fromdate+"','"+message.tilldate+"',"+1+","+null+","+message.trans_amount+",'San Jose')"

	
	mysql.executeQuery(query, {}, function(innerResult2){
		// nothing to do here with callback
	});

	var response = {statuscode : 0, message: null}
	callback(null,response);
}

