
var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');

/*
 * Add user Function for Mongodb.
 * called by - app.post('/user/register', register.signup);
 */
exports.update_profile = function(req, res){
	
	console.log("inside update profile "+req.param('user_first_name') + req.session.username.username );

	var validRegistration = { "flag" : false, "message": null};
	
	var user_first_name = req.param('user_first_name');
	var user_last_name =req.param("user_last_name")
	var user_sex = req.param("user_sex")
	var user_birthday = req.param("user_birthday")
	var user_email = req.session.username.username;
	var user_phone = req.param("user_phone") 
	var user_preferred_locale=req.param("user_preferred_locale")
	var user_native_currency=req.param("user_native_currency")
	var user_city=req.param("user_city")
	var user_about = req.param("user_about")
	
	var msg_payload = {
		firstname : user_first_name,
		lastname : user_last_name,
		user_sex : user_sex,
		birthday : user_birthday,
		username : user_email,
		user_phone : user_phone,
		user_preferred_locale : user_preferred_locale,
		user_native_currency : user_native_currency,
		user_city : user_city,
		user_about : user_about
	}

	mq_client.make_request('profile_update_queue',msg_payload, function(err,result){
		console.log("sending data to profile_update_queue");
		if(result.err){
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
};



