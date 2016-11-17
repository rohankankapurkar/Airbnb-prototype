var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/testEbay";


exports.signupUser = function(msg, callback){
	var res = {};
	console.log('Connected to mongo at : ' + mongoURL);


	mongo.connect(mongoURL, function(){
		coll = mongo.collection('newCollection');

		coll.insertOne(msg, function(err, user){
			if(user){
				res.status = 0;
			}else{
				res.status = 1;
			}
			callback(null, res);
		});
	})
}
