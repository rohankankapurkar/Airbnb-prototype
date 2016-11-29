
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


exports.getUserAndProperty = function(req, res) {

	console.log("-------------------user getUserAndProperty routes-------------");
	var msg_payload = {properties: req.body.pendingApprovalsData};
  console.log(msg_payload);

	if(msg_payload.properties)
			mq_client.make_request('getUserAndProperty_queue', msg_payload, function(err,result){
		    if(err)
		      return console.log("Error in getting properties for trips "+err);
		    console.log("-----------response getUserAndProperty_queue----------");
				console.log(result);
				if(result.statuscode == 0)
		    {
		      res.send(result);
				}
				else
				{
					res.send({
		        statuscode: 1
		      });
				}
			});
	else {
			res.send({
				statuscode: 1
			});
	}


};



//get properties for bidding
exports.getPropertiesForBidding = function(req, res) {

		console.log("-------------------user getPropertiesForBidding routes-------------");
		var msg_payload = {propertyIds: req.body.propertyIds};
	  console.log(msg_payload);

		mq_client.make_request('getPropertiesForBidding_queue', msg_payload, function(err,result){
	    if(err)
	      return console.log("Error in getting properties for trips "+err);

	    console.log("-----------response getPropertiesForBidding_queue----------");
			console.log(result);

			if(result.statuscode == 0)
	    {
	      res.send(result);
			}
			else
			{
				res.send({
	        statuscode: 1
	      });
			}

		});


};
