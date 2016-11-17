var mongo = require("./utils/utils.mongo");
var mongoURL = "mongodb://localhost:27017/testEbay";


exports.signupUser = function(msg, callback){
	
	var res = {};
	
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('newCollection');
		console.log("I am here " + msg);
		// Insert the user details into db
		coll.insertOne(msg, function(err, user){
			if(user){
				// return status = 0 on successfull registration
				res.status = 0;
			}else{
				// return 1 if any error occurs
				res.status = 1;
			}
			callback(null, res);
		});
	});
}
