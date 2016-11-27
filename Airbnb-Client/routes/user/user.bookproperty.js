
var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');

/*
 * Add user Function for Mongodb.
 * called by - app.post('/user/register', register.signup);
 */

exports.bookproperty = function(req, res){
	console.log("Hey there ");

	var msg_payload = {propid:req.body['propid'],
					   fromdate : req.body['fromdate'],
					   todate: req.body['todate'],
					   userid: req.body['userid'],
					   hostid: req.body['hostid'],
					   price: req.body['price'],
					   city: req.body['city']	
			}
	
	mq_client.make_request('bookProperty_queue',msg_payload, function(err,result){
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



