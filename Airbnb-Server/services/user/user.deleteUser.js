var process = require('process');
var MODE = process.env.MODE;
var moment = require('moment');

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
    var mongo = require('../utils/utils.mongo.pool');
    var mysql = require('../utils/utils.mysql.pool');
}else{
    var mongo = require('../utils/utils.mongo');
    var mysql = require('../utils/utils.mysql');
}

exports.deleteUser = function(msg, callback){

    console.log("--------------deleteUser----------");
    var res = {statuscode : 0, message : ""},
        paramsUserData = {
          user_id: msg.userId,
          host_id: msg.userId
        }

    mongo.connect(function(){
        console.log("------------deleteUser inside mongo------------");
        var coll = mongo.collection('users');

        coll.findOne({id: msg.userId}, function(err, result){

                    if(err){

                        res['statuscode'] = 1;
                        res['message'] = "Unexpected error occurred while deleting the user";

                    }else{

                        //delete the user
                        coll.remove({id: msg.userId});

                        //now delete all user properties
                        var collProp = mongo.collection('properties');
                        collProp.remove(
                          {host_id: msg.userId},
                          {
                            justOne: false
                          }
                        );


                        //now delete user bookings
                        mysql.executeQuery('DELETE FROM BOOKED_PROPERTIES WHERE user_id = "'+msg.userId+'" OR host_id = "'+msg.userId+'" ', function(err, result){

                            if(err){
                                    res['statuscode'] = 1;
                                    res['message'] = "Error ocurred while placing your request";
                                    callback(null, res);
                            } else if(result){

                                console.log('deleted all user bookings');
                                res['statuscode'] = 0;
                                res['message'] = "Your request has been sent to host";
                                callback(null, res);

                            }else {
                                res['statuscode'] = 1;
                                res['message'] = "Error ocurred while placing your request";
                                callback(null, res);
                            }

                        });


                    }

                });
        });
};
