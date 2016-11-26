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
