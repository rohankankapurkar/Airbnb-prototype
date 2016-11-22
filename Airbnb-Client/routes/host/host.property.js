var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');


/*
*Called by - app.post('/host/addproperty',host.addproperty); //equivalent to /host/addadvertisement - in api doc
*Controller - controller.becomehost.dates.js
*/
exports.addproperty = function(req,res){

	try{
		
		if(req.session.username)
		{
			var msg_payload = req.param('propertydetails');
			msg_payload.username = req.session.username;
			mq_client.make_request('becomeHost_queue',msg_payload, function(err,result){
				console.log(" In become host req: "+result);
				if(err){
					console.log("error in req");
					res.send({statuscode : 1, message : "Not able to add property"});
				}
				else 
				{
					console.log("successful comeback for rmq server");
					res.send(result);
				}  
			});	
		}
		else
		{
			console.log("Invalid user session. Not able to add property");
			res.send({statuscode : 1, message : "User not logged in."})
		}
	}
	catch(error)
	{
		res.send({statuscode : 1, message : "Internal Server Error Occurred. Please try again"})
	}

}