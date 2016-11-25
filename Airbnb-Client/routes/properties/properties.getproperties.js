var mq_client = require('../../rpc/client');

exports.getproperties = function(req, res) {

	console.log("------------get cities client-----------");

	try
	{
		if(req.session.username)
		{
			console.log("In session");
			var msg_payload = {username : req.session.username, city: req.body.city, page : req.body.page};
  			mq_client.make_request('getProperties_queue',msg_payload, function(err,result){
      			console.log("------------getproperties response-----------");
      			console.log(result);
  				res.send(result);
  			});
		}
		else
		{
			var msg_payload = {username : "", city: req.body.city, page : req.body.page};
  			mq_client.make_request('getProperties_queue',msg_payload, function(err,result){
      			console.log("------------getproperties response-----------");
      			console.log(result);
  				res.send(result);
  			});
		}
	}
	catch(error)
	{
		res.send({statuscode : 1, message : "Internal Server Error Occured "+error})
	}
}
