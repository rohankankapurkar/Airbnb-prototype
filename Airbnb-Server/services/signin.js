var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";


exports.signinUser = function(msg, callback){
	
	var res = {};
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newCollection');

		coll.findOne({username:msg.username, password :msg.password}, function(err, user){
			if (user) {
				res.status = 0;
				res.data = user;
			} else {
				console.log("returned false");
				res.status = 1;
			}
			callback(null, res);
		});
	});
}

