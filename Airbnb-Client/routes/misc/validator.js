
var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');

/*
 * Add user Function for Mongodb.
 * called by - app.post('/user/register', register.signup);
 */
exports.validateaddress = function(req, res){

	try
	{
		var address = req.param('address');
		console.log(address);
		var msg_payload = {
			address : address
		}

	mq_client.make_request('validateAddress_queue',msg_payload, function(err,result){
		console.log(result);
		console.log("In rmq queue");
		if(err){
			res.send({statuscode : 1, message : "Unable to validate address"});
		}
		else 
		{
			res.send(result);
		}  
	});
	}
	catch(error)
	{
		res.send({statuscode : 1, message : "Internal server error occurred : "+error});
	}

};	