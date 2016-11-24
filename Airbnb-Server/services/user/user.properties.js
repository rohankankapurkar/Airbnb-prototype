var process = require('process');
var MODE = process.env.MODE;

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
    var mongo = require('../utils/utils.mongo');
}else{
    var mongo = require('../utils/utils.mongo');
}

exports.getProperties = function(msg, callback){

    var res = {statuscode : 0, message : ""};

    mongo.connect(function(){
        var coll = mongo.collection('properties');
        var perPage = 10;
        var skipBefore = (msg.page -1) * perPage;

        // This will retreive the all perperties in msg.city.
        // If user/host is logged in, then properties listed by him will not be listed. msg.username will have session username
        // skip and limit is used for pegination
        // This will return proerty details with host details in 'hostdata' field in reslt so, host of that proerty can be used for review, view host etc etc.

        coll.aggregate([
                {$lookup : {from :'users', localField : 'host_id', foreignField : 'id', as:'hostdata'}}
                ,{$match : {'city':msg.city,'hostdata.approved':false , 'hostdata.username':{$ne:msg.username}}}
                ,{$skip:skipBefore}
                ,{$limit:perPage}], 
                function(err, result){
                    if(err){
                        res['statuscode'] = 1;
                        res['message'] = "Unexpected error occurred while retrieving the properties";
                    }else{
                        res['statuscode'] = 0;
                        res['data'] = result;
                    }
                    callback(null, res);
                });
        });
}
