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


exports.gettopprops = function(req, res){

    var msg_payload = {};

    try{
        mq_client.make_request('getTopProps_queue',msg_payload, function(err,result){

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



exports.gettophosts = function(req, res){

    var msg_payload = {};

    try{
        mq_client.make_request('getTopHosts_queue',msg_payload, function(err,result){

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


exports.gettopcities = function(req, res){

    var msg_payload = {};

    try{
        mq_client.make_request('getTopCities_queue',msg_payload, function(err,result){

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

exports.getareaseen = function(req, res){
        console.log("Here to see the area");
        var msg_payload = {};
        mq_client.make_request("getAreaSeen_queue", msg_payload, function(err, result){
            if(err){
                res.send({statuscode:1, message:'Error occurred while getting data from db'});
            }else{
                res.send({statuscode:0, result:result});
            }
        });

}


exports.getclickperpage = function(req, res){

        var msg_payload = {};
        mq_client.make_request("getClickPerPage_queue", msg_payload, function(err, result){
            if(err){
                res.send({statuscode:1, message:'Error occurred while getting data from db'});
            }else{
                res.send({statuscode:0, result:result});
            }
        });
}
