/*
 * Passport
 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
/*
 * Mongo
 */

var mq_client = require('../../rpc/client');

module.exports = function(passport) {
	
	console.log("export funct")
	passport.use('signin', new LocalStrategy(function(username, password, done) 
	{		
		
		var msg_payload = {username : username, password : password}
    	mq_client.make_request('signin_queue',msg_payload, function(err,result){
    		
    		if(result.statuscode == 0)
            {
                var response = { 
                    username : result.data.username,
                    firstname : result.data.firstname,
                    lastname : result.data.lastname,
                    ishost : result.data.ishost
                }
    			done(null, response);
    		}
    		else 
    		{
    			done(true, false);
    		}  
    	});
   }));    
}