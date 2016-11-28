var mongo = require('./../utils/util.mongo.js');
var MongoUrl = "mongodb://localhost:27017/airbnb"


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

}

exports.logPageData = function(req,res){
	
}