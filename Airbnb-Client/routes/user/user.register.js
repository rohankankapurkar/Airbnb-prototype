
var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');

/*
 * Add user Function for Mongodb.
 * called by - app.post('/user/register', register.signup);
 */
exports.signup = function(req, res){
	var validRegistration = { "flag" : false, "message": null};
	
	var username = req.param('username');
	var password = req.param('password');
	var firstname = req.param('firstname');
	var lastname = req.param('lastname');
	var birthday = req.param('birthday');

	console.log("In sign up");
	console.log(username +" "+password);
	var msg_payload = {
			username : username,
			password : password,
			firstname : firstname,
			lastname : lastname,
			birthday : birthday
	}

	mq_client.make_request('signup_queue',msg_payload, function(err,result){
		console.log(result);
		console.log("In rmq queue");
		if(result.err){
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
};



