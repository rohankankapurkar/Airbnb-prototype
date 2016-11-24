var mq_client = require('../../rpc/client');

exports.get_properties = function(req, res) {

	console.log("------------get cities client-----------");

	var msg_payload = {city: req.body.city};
  	mq_client.make_request('getproperties_queue',msg_payload, function(err,result){
      console.log("------------getproperties response-----------");
      console.log(result.statuscode);
  		res.send(result);
  	});

}
