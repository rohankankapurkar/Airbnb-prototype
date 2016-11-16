var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";


function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newCollection');

		coll.findOne({username:msg.username, password :msg.password}, function(err, user){
			if (user) {
				console.log(user);
				console.log('Login successfull');
				res.status = true;
				res.data = user;
			} else {
				console.log("returned false");
				res.status = false;
			}
			callback(null, res);
		});
	});
}

exports.handle_request = handle_request;