var process = require('process');
var MODE = process.env.MODE;
//var autoIncrement = require('mongodb-autoincrement');

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
	var mongo = require('../utils/utils.mongo.pool');
}else{
	var mongo = require('../utils/utils.mongo');
}

exports.generateID = function(callback){

	mongo.connect(function(){
	
	counter = mongo.collection('counter');

	counter.updateOne({_id:'id'},{$inc:{'seq':1}}, function(err, ret){
		if(ret){
			counter.findOne({_id:'id'},{_id:0, seq:1}, function(err, ret1){
				var incCouner = ret1.seq;
				var incCouner = incCouner + "";

				// Add trailing 0's to make length of number equal to 7 which is required for SSN format.
				while(incCouner.length<9) incCouner = "0" + incCouner;

				// Make the number in SSN format xxx-xx-xxx
				incCouner = [incCouner.slice(0, 3), '-', incCouner.slice(3)].join('');
				incCouner = [incCouner.slice(0, 6), '-', incCouner.slice(6)].join('');

				callback(incCouner);
			});
		}
       });
	});
}