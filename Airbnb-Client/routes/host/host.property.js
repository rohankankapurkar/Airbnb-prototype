var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');
var moment = require('moment');

function getBidEndTime(bidStartTime)
{
	var currTime;
	//var date = new Date(bidStartTime);
	//date.setDate(date.getDate() + 4);
	//currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	//console.log(currTime);
	var date = moment(new Date(bidStartTime)).add(4,'days').format("YYYY-MM-DD");
	//currTime = date.add(4, 'days').format("DD");
	console.log(date);
	return date;
}

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}
/*
*Called by - app.post('/host/addproperty',host.addproperty); //equivalent to /host/addadvertisement - in api doc
*Controller - controller.becomehost.dates.js
*/
exports.addproperty = function(req,res){

	try{
		if(req.session.username)
		{
			var propertydetails = req.param('propertydetails');
			console.log("BC")
			console.log(propertydetails);
			if(propertydetails.biddingavailable == true)
			{
				propertydetails.bidEndDate = moment(new Date(propertydetails.bidStartDate)).add(4,'days').format("YYYY-MM-DD");
				console.log("Bid End Time"+propertydetails.bidEndDate);
			}
			var msg_payload = propertydetails;
			msg_payload.username = req.session.username;


			mq_client.make_request('becomeHost_queue',msg_payload, function(err,result){
				if(err){

					res.send({statuscode : 1, message : "Not able to add property"});
				}
				else
				{
					res.send(result);
				}
			});
		}
		else
		{
			res.send({statuscode : 1, message : "User not logged in."})
		}
	}
	catch(error)
	{
		console.log(error);
		res.send({statuscode : 1, message : "Internal Server Error Occurred. Please try again"})
	}
}



exports.getmyproperties = function(req, res){
console.log("host update listing");
	try{
		var username = req.session.username
		if(username != null){

			var msg_payload = {'username':username};

			mq_client.make_request('getMyProperties_queue', msg_payload, function(err, result){
				if(err){
					res.send({statuscode:1, message : "Error occurred while getting the properties"});
				}else{
					console.log("inside the getmyproperties");
					console.log(JSON.stringify(result));

					res.send({statuscode:0, result:result});
				}

			});
		}else{
			res.send({statuscode:1, message:"Usernot logged in"});
			console.log("faild inside upate listing");
		}
	}catch(error){
		console.log(error);
		res.send({statuscode:1,message:"Internal Server Error Occurred. Please try again"});
	}
}

exports.getavailabledates = function(req, res){

		/*console.log(req.param('prop_id'));*/
		var msg_payload = {prop_id: req.param('prop_id')};

		mq_client.make_request('getAvailableDates_queue', msg_payload, function(err, result){
			if(err){
				res.send({statuscode:1, message : "Error occurred while getting avaiable dates"});
			}else{
				res.send({statuscode:0, result:result});
			}

		});

	}

exports.approveuserrequest = function(req, res){

	var msg_payload = {propid: req.param('propid'),
					userid : req.param('userid'),
					fromdate : req.param('fromdate'),
					tilldate : req.param('tilldate')
		};

	mq_client.make_request('approveUserRequest_queue', msg_payload, function(err, result){
		if(err){
			res.send({statuscode:1, message : "Error occurred while getting avaiable dates"});
		}else{
			res.send({statuscode:0, result:result});
		}

	});
}


exports.getpropertyavailable = function(req, res){

	var msg_payload = {propid: req.param('propid'),
					userid : req.param('userid'),
					fromdate : req.param('fromdate'),
					tilldate : req.param('tilldate')
		};

	mq_client.make_request('checkPropertyAvailable_queue', msg_payload, function(err, result){
		if(err){
			res.send({statuscode:1, message : "Error occurred while getting avaiable dates"});
		}else{
			res.send({statuscode:0, result:result});
		}
	});
}


exports.getpendingpropertyrequests = function(req, res){

	var msg_payload = {host_id: req.param('hostid')};

	mq_client.make_request('getPendingPropertyRequests_queue', msg_payload, function(err, result){
		if(err){
			res.send({statuscode:1, message : "Error occurred while getting avaiable dates"});
		}else{
			res.send({statuscode:0, result:result});
		}
	});
}


exports.getuserpropdata = function(req, res){

	var msg_payload = {user_id: req.param('hostid'), prop_id:req.param('propid')};

	mq_client.make_request('getUserPropData_queue', msg_payload, function(err, result){
		if(err){
			res.send({statuscode:1, message : "Error occurred while getting avaiable dates"});
		}else{
			res.send({statuscode:0, result:result});
		}
	});
}


exports.disapproverequest = function(req, res){
	var msg_payload = {propid: req.param('propid'),
					userid : req.param('userid'),
					fromdate : req.param('fromdate'),
					tilldate : req.param('tilldate')
		};

	mq_client.make_request('disapproveRequest_queue', msg_payload, function(err, result){
		if(err){
			res.send({statuscode:1, message : "Error occurred while getting avaiable dates"});
		}else{
			res.send({statuscode:0, result:result});
		}
	});
}

exports.propertyHistory =function(req, res){
	var msg_payload = {host_id: req.param('hostid')};

			mq_client.make_request('getMyPropertiesHistory_queue', msg_payload, function(err, result)
			{
				if(err){
					res.send({statuscode:1, message : "Error occurred while getting avaiable dates"});
				}else{

					res.send({statuscode:0, result:result});
				}
			});

}


exports.saveUserReview =function(req, res)
{
	var msg_payload = {hostname: req.session.username,
		               username :req.param('username'),
		               reviewPost: req.param('reviewPost'),
	                   rating : req.param('rating')
	                  };

	                  console.log("*******REVIEW INPUTS*******"+msg_payload);
	mq_client.make_request('saveUserReview_queue', msg_payload, function(err, result)
	{
		if(err){
			res.send({statuscode:1, message : "Error occurred while getting avaiable dates"});
		}else{

			res.send({statuscode:0, result:result});
		}
	});

}


exports.getclicksperproperty = function(req, res){

		var msg_payload = {};
		if(req.session.username)
		{
			msg_payload.username = req.session.username;
			mq_client.make_request("getClickPerProperty_queue", msg_payload, function(err, result){
				if(err){
					res.send({statuscode:1, message:'Error occurred while getting data from db'});
				}else{
					res.send({statuscode:0, result:result});
				}
			});
		}
		else
		{
			res.send({statuscode:1, message:'Error occurred while getting data from db'});
		}

		
}


exports.updateThisListing = function(req, res){
	console.log("***********inside update listing");
	var msg_payload = {
		guestaccess : req.param('guestaccess'),
		roomsinproperty : req.param('roomsinproperety'),
		totbedsavailable : req.param('totbedsavailable'),
		noofguests : req.param('noofguests'),
		bedsforuse : req.param('bedsforuse'),
		bathsforuse : req.param('bathsforuse'),
		street : req.param('street'),
		apt : req.param('apt'),
		city : req.param('city'),
		state : req.param('state'),
		zip : req.param('zip'),
		country : req.param('country'),
		description : req.param('description'),
		title : req.param('title'),
		price : req.param('price'),
		currency : req.param('currency'),
		biddingavailable : req.param('biddingavailable'),
		id: req.param('id'),
		username : req.session.username
	};

	mq_client.make_request('updateListing_queue', msg_payload, function(err, result)
	{
		if(err){
			res.send({statuscode:1, message : "Error occurred while updating the listing."});
		}else{

			res.send({statuscode:0, result:result});
		}
	});
}


exports.getreviewcount = function(req, res){

	var msg_payload = {"username":req.session.username};

	mq_client.make_request("getReviewCount_queue", msg_payload, function(err, result){
		if(err){
			res.send({statuscode:1, message:'Error occurred while getting data from db'});
		}else{
			res.send({statuscode:0, result:result});
		}
	});
}





exports.getReviewForHost = function(req, res){
	
		
	if(req.session.username)
	{
		var msg_payload = {};
		msg_payload.username = req.session.username;

		mq_client.make_request("getReviewCount_queue", msg_payload, function(err, result){
			if(err){
				res.send({statuscode:1, message:'Error occurred while getting data from db'});
			}else{
				res.send({statuscode:0, result:result});
			
			}
		});
	}
	else
	{
		res.send({statuscode:1, message:'Error occurred while getting data from db'});
	}

	
}


exports.getBidLogs = function(req,res){

	if(req.session.username)
	{
		msg_payload.username = req.session.username;
		mq_client.make_request("getBidCount_queue", msg_payload, function(err, result){
			if(err){
				res.send({statuscode:1, message:'Error occurred while getting data from db'});
			}else{
				res.send({statuscode:0, result:result});
			}
		});
	}
	else
	{
		res.send({statuscode:1, message:'Error occurred while getting data from db'});
	}
}


exports.getHostPropertyNames = function(req,res){

	console.log("In propertyr fetch");
	if(req.session.username)
	{
		msg_payload.username = req.session.username;
		mq_client.make_request("getPropertiesByHost_queue", msg_payload, function(err, result){
			if(err){
				res.send({statuscode:1, message:'Error occurred while getting data from db'});
			}else{
				res.send({statuscode:0, result:result});
			}
		});
	}
}

exports.getBidsForProperty = function(req, res){
	console.log("------> Property");
	console.log(req.param('title'));
	var msg_payload = {};
	msg_payload.title = req.param('title');
	
	mq_client.make_request("getBidStats_queue", msg_payload, function(err, result){
		if(err){
			res.send({statuscode:1, message:'Error occurred while getting data from db'});
		}else{
			res.send({statuscode:0, result:result});
		}
	});
}



