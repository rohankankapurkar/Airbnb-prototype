/**
 * Created by rohankankapurkar on 11/20/16.
 */

var process = require('process');

var MODE = process.env.MODE;

exports.update_Profile = function(msg, callback){

    var res = {};
    mongo.connect(function(){
        var coll = mongo.collection('users');
        console.log("The user name is"+ msg.username);

        coll.findOne({username:msg.username},function(err, user){
            if(user){
                res.message = "Found the user";
                console.log("printing the mess"+msg.username);

                coll.updateOne(msg, function(err, user){
                    if(user){
                        // return status = 0 on successfull registration
                        res.statuscode = 0;
                        callback(null, res);

                    }else{
                        // return 1 if any error occurs
                        res.statuscode = 1;
                        res.message = "Error occurred while updating the user's information";
                    }
                });
            }else{

             res.message = "No user found. Error";
            }
        });
    });
}
