var process = require('process');
var MODE = process.env.MODE;
//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('./../utils/utils.mongo');
}else{
	var mongo = require('./../utils/utils.mongo');
}

var dateFormat = require('dateformat');
var cronjob = require('cron').CronJob;

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
		var fields = {id : 1, title : 1,  bidEndDate : 1, currentBidder : 1, currentBid : 1 }
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
				console.log(currTime);
				for(var i = 0; i< results.length; i++)
				{
					bidEndtime = dateFormat(results[i].bidEndDate,"yyyy-mm-dd HH:MM:ss");
					console.log(bidEndtime);
					if(bidEndtime < currTime)
					{
						console.log("updating");
						updateBidFlag(results[i].id);
						recordBidTransaction(results[i].currentBidder, results[i].id, results[i].title, results[i].currentBid);
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


function recordBidTransaction(bidder, propertyid, propertytitle, bid_amount){
console.log("updating 2");	
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
						console.log("Unsuccessful Transaction");
						response = { valid: false, id: null, message : null}
					}	
					else
					{
						collection.update({username : bidder },{ $push : { bidswon : {
							trans_id : doc.value.seq,
							trans_type : 3, 
							username : bidder, 
							propertyid: propertyid, 
							propertytitle : propertytitle,
							trans_amount : bid_amount,  
							trans_time: getCurrentTime(), 
							paid_flag : "N"}
							}},
							function(err, records){
								if(err)
								{
									response = { valid: false, id: null, message : null}
								}
								else
								{
									response = { valid: true, id: null, message : null};	
								}
						});
					}	
				}
			);
		}

	});	
}


exports.updateBidLog = function(message, callback){
	mongo.connect(function(connection){
		var collection = mongo.collection("users");
		var counterBidLog = mongo.collection("counter");
		
		counterBidLog.findAndModify(
			{_id:"id"},
			[],
			{$inc:{seq:1}}, 
			{new : true},
			function(err,doc){
				if(err)
				{
					console.log("Unsuccessful Transaction");
					response = { statuscode: 1, propertyid: null, message : null}
					callback(null,response);
				}	
				else
				{
					collection.update({username : message.bidder },{ $push : { bids : {
						bid_id : doc.value.seq,
						id : message.propertyid,
						title : message.title,
						bid_amount : parseFloat(message.bidamount),
						bidder : message.bidder,
						bid_time : getCurrentTime() } } },
						function(err, records){
							if(err)
							{
								console.log("Unsuccessful Transaction");
								response = { statuscode: 1, propertyid: null, message : null}
								callback(null,response);
							}
							else
							{
								response = { statuscode: 0, propertyid: null, message : null}
								console.log("bid log updated");
								callback(null,response);
							}
					});
				}	
			}
		);
	});
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

