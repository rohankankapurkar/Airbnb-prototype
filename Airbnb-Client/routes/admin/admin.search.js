/**
 * Created by Shruti Loya on 11/26/2016.
 */


var mq_client = require('../../rpc/client');

/*
 * Returns all hosts to the Admin based on Area wise search.
 *
 */


exports.searchHosts = function(req, res){
    try{
        var msg_payload = {area : req.param('area') };

        mq_client.make_request('searchHosts_queue',msg_payload, function(err,result){

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