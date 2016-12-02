
var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');

exports.placebid = function(req,res){
	var propertyid = req.param('propertyid');
	var title = req.param('title');
	var bidamount = req.param('bidamount');
	var bidder = req.param('bidder');
	updateBidLog(propertyid,title,bidamount,bidder,res);
	updatePropertyCollection(propertyid,bidder,bidamount,res);
}


function updateBidLog(propertyid, title, bidamount, bidder,res)
{
	
	//var BidLogString = product_id+" | "+bidder+" | "+bidamount+" | "+getCurrentTime()+"\n";
	//logger.writeBidInfoLog(BidLogString);
	console.log("in bid log");
	var msg_payload = {
			propertyid : propertyid,
			title : title,
			bidamount : bidamount,
			bidder : bidder
	}
	mq_client.make_request('updateBidLog_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
}

function updatePropertyCollection(propertyid, bidder, bidamount,res)
{
	var msg_payload = {
		propertyid : propertyid,
		bidder : bidder,
		bidamount : bidamount
	}
	console.log("in property collection log");
	mq_client.make_request('updatePropertyBids_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
}


exports.checkout = function(req,res)
{

	console.log("============================");
	console.log(req.body);
	console.log("============================");

	var msg_payload = req.body.userBids;

	mq_client.make_request('bidcheckout_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
	res.send({statuscode : 0});
}

