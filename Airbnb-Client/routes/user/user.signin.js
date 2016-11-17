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
	console.log("In passport u")
	passport.use('signin', new LocalStrategy(function(username, password, done) 
	{		
		var msg_payload = {username : username, password : password}
    	mq_client.make_request('signin_queue',msg_payload, function(err,result){
    		if(result.err){
    			throw err;
    			done(true, false);
    		}
    		else 
    		{
    			done(null, result.username);
    		}  
    	});
   }));    
}