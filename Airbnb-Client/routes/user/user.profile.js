
var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');

/*
 * Add user Function for Mongodb.
 * called by - app.post('/user/register', register.signup);
 */
exports.update_profile = function(req, res){
	
	console.log("inside update profile "+req.param('user_first_name') + req.session.username);

	var validRegistration = { "flag" : false, "message": null};
	
	var user_first_name = req.param('user_first_name');
	var user_last_name =req.param("user_last_name")
	var user_sex = req.param("user_sex")
	var birthday = req.param("birthday")
	var user_email = req.session.username;
	var user_creditcard = req.param("credit_card");

	var user_phone = req.param("user_phone") 
	var user_preferred_locale=req.param("user_preferred_locale")
	var user_native_currency=req.param("user_native_currency")
	var user_city=req.param("user_city")
	var user_about = req.param("user_about")
	var profile_pic = req.param("profile_pic");
	console.log("yyay nanga nnach profile pic here bc"+profile_pic);
	
	var msg_payload = {
		firstname : user_first_name,
		lastname : user_last_name,
		user_sex : user_sex,
		birthday : birthday,
		username : user_email,
		user_phone : user_phone,
		user_preferred_locale : user_preferred_locale,
		user_native_currency : user_native_currency,
		user_city : user_city,
		user_about : user_about,
		credit_card:user_creditcard,
		profile_pic:profile_pic
	}
	
	console.log("printing teh msg payload"+msg_payload);
	//console.log("printing the complete JSON man" +JSON.stringify(msg_payload));

	mq_client.make_request('profile_update_queue',msg_payload, function(err,result){
		console.log("sending data to profile_update_queue");
		if(result.err){
			//res.send(result);
			System.out.println("error"+result.err);
		}
		else 
		{		console.log("successfully updated the user.");

			res.send(result);
			
		}  
	});
};

exports.show_profile = function(req, res){
	
	console.log("inside showing the  profile "+ req.session.username);

	var validRegistration = { "flag" : false, "message": null};
	
	
	
	var msg_payload = {
		username:req.session.username
	}
	
	//console.log("printing teh msg payload"+msg_payload);

	mq_client.make_request('profile_show_queue',msg_payload, function(err,result){
		console.log("sending data to profile_update_queue");
		if(result.err){
			//res.send(result);
			System.out.println("error"+result.err);
		}
		else 
		{		
		console.log("successfully got the info for the user the user.");
		//console.log("printing the user name here baby"+result.username+ JSON.stringify(result));
		result.statuscode= 0 ;
		res.send(result)
		}  
	});
};

