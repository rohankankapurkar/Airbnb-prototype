var mongo = require('./../utils/util.mongo.js');
var MongoUrl = "mongodb://localhost:27017/airbnb";
var dateFormat = require('dateformat');

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}

exports.logClickData = function(req, res){
	var click_id = req.param('id');
	var url = req.param('url');
	var timestamp = req.param('ts');
	//var property = req.param('property');

	if(req.session.username)
	{
		console.log(req.session.username+" "+click_id+" "+url+" "+timestamp);
		var response ={};
		mongo.connect(MongoUrl,function(){
			var collection = mongo.collection("clicklogs");
			collection.insert({
						username : req.session.username,
						clickelement : click_id,
						pageurl : url,
						timestamp : timestamp
					},function(err, records){
						if(err)
						{
							response.statuscode = 1;
							response.message = err
							res.send(response);							
						}
						else
						{
							response.statuscode = 0;
							response.message = null;
							res.send(response)
						}
					});
		});
	}
	else
	{
		console.log("NA "+click_id+" "+url+" "+timestamp);
		var response = {};
		mongo.connect(MongoUrl,function(){
		var collection = mongo.collection("clicklogs");
			collection.insert({
				username : "anonymous user",
				clickelement : click_id,
				pageurl : url,
				timestamp : timestamp
			},function(err, records){
				if(err)
				{
					response.statuscode = 0;
					response.message = err
					res.send(response);
				}
				else
				{
					response.statuscode = 1;
					response.message = null;
					res.send(response);
				}
			});
		});
	}
}

exports.logPropertyClicks = function(req,res){

	var propertyTitle = req.param('property');
	var timestamp = getCurrentTime();
	var city = req.param('city');
	var response = {}

	if(req.session.username)
	{
		mongo.connect(MongoUrl,function(){
		var collection = mongo.collection("propertylogs");
			collection.insert({
				username : req.session.username,
				property : propertyTitle,
				city : city,
				timestamp : timestamp
			},function(err, records){
				if(err)
				{
					response.statuscode = 0;
					response.message = err
					res.send(response);
				}
				else
				{
					response.statuscode = 1;
					response.message = null;
					res.send(response);
				}
			});
		});
	}
	else
	{
		mongo.connect(MongoUrl,function(){
		var collection = mongo.collection("propertylogs");
			collection.insert({
				username : "anonymous user",
				property : propertyTitle,
				city : city,
				timestamp : timestamp
			},function(err, records){
				if(err)
				{
					response.statuscode = 0;
					response.message = err
					res.send(response);
				}
				else
				{
					response.statuscode = 1;
					response.message = null;
					res.send(response);
				}
			});
		});		
	}

}


exports.logPagetimes = function(req,res){

	var pagetime = req.param('pagetimefrom');
	var pagefrom = req.param('pagefrom');
	var pageto = req.param('pageto');
	var timestamp = getCurrentTime();
	var flag = false;

	var response = {};
	var next = null;
	
	if(req.session.username)
	{
		var userjourney = req.session.userjourney
		if(userjourney.root.start == "INIT")
		{
			console.log("in start");
			userjourney.root.page = pagefrom;
			userjourney.root.pagetime = pagetime;
			userjourney.root.child = null;
			userjourney.root.start = "START"
		}
		else
		{
			console.log("building tree");
			next = userjourney.root;
			console.log(next);
			while (next != null)
			{
				if(next.child == null)
				{
					next.child = {
						page : pagefrom,
						pagetime : pagetime,
						child : null
					}
					break;
				}
				else
				{
					next = next.child;	
				}
				
			}

			
		}
		console.log("+++++++++++++Tree++++++++++++++++++");
		console.log(userjourney);
		console.log("+++++++++++++Tree++++++++++++++++++");

		mongo.connect(MongoUrl,function(){
		var collection = mongo.collection("pagetimelogs");
			collection.insert({
				username : req.session.username,
				pagefrom : pagefrom,
				pageto : pageto,
				pagetimefrom: pagetime,
				timestamp : timestamp
			},function(err, records){
				if(err)
				{
					response.statuscode = 0;
					response.message = err
					res.send(response);
				}
				else
				{
					response.statuscode = 1;
					response.message = null;
					res.send(response);
				}
			});
		});
	}
	else
	{
		mongo.connect(MongoUrl,function(){
		var collection = mongo.collection("pagetimelogs");
			collection.insert({
				username : "anonymous user",
				pagefrom : pagefrom,
				pageto : pageto,
				pagetimefrom : pagetime,
				timestamp : timestamp
			},function(err, records){
				if(err)
				{
					response.statuscode = 0;
					response.message = err
					res.send(response);
				}
				else
				{
					response.statuscode = 1;
					response.message = null;
					res.send(response);
				}
			});
		});		
	}
}


/*exports.logPageData = function(req,res){
	
}*/