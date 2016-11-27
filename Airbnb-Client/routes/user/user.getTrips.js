
var mq_client = require('../../rpc/client');

exports.getTrips = function(req, res) {

	console.log("-------------------user get trips routes-------------");
	var msg_payload = {userId: req.body.userId};
  console.log(msg_payload);
	mq_client.make_request('getTrips_queue', msg_payload, function(err,result){
    if(err)
      return console.log("Error in getting trips "+err);
    console.log("-----------response getTrips_queue----------");
		if(result.statuscode == 0)
    {
      res.send(result)
		}
		else
		{
			res.send({
        statuscode: 1
      })
		}
	});

};


exports.getPropertiesForUserTrips = function(req, res) {

	console.log("-------------------user getPropertiesForUserTrips routes-------------");
	var msg_payload = {properties: req.body.properties};
  console.log(msg_payload);
	mq_client.make_request('getPropertiesForUserTrips_queue', msg_payload, function(err,result){
    if(err)
      return console.log("Error in getting properties for trips "+err);
    console.log("-----------response getPropertiesForUserTrips_queue----------");
		if(result.statuscode == 0)
    {
      res.send(result)
		}
		else
		{
			res.send({
        statuscode: 1
      })
		}
	});

};
