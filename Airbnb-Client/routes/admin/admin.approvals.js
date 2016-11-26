
var dateFormat = require('dateformat');
var mq_client = require('../../rpc/client');

/*
 * Returns pending approvals for Admin.
 * app.get('/admin/getadminapprovals',admin.getadminapprovals);
 */
exports.getadminapprovals = function(req, res){
	try{

		var msg_payload = {}

		mq_client.make_request('getPendingRequests_queue',msg_payload, function(err,result){

			if(err){
				res.send({statuscode : 1, message: "Unable to fetch pending approvals"});
			}
			else 
			{
				res.send(result);
			}  
		});

	}catch(error)
	{
		res.send({statuscode : 1, message : "Internal server error occurred : "+error});
	}

};


exports.approveHostRequest = function(req, res){
	try{
		var msg_payload = {username : req.param('username') };

		mq_client.make_request('approveRequest_queue',msg_payload, function(err,result){

			if(err){
				res.send({statuscode : 1, message: "Unable to fetch pending approvals"});
			}
			else 
			{
				res.send(result);
			}  
		});
	}catch(error)
	{
		res.send({statuscode : 1, message : "Internal server error occurred : "+error});
	}
}