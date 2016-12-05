/**
 * Created by rohankankapurkar on 11/20/16.
 */

var process = require('process');

var MODE = process.env.MODE;
var mongo = require('../utils/utils.mongo.pool');


exports.show_Profile = function(msg, callback){
    console.log("The user name is boom"+ msg.username);

    var res = {};
    mongo.connect(function(){
        var coll = mongo.collection('users');
        console.log("The user name is"+ msg.username);

        coll.findOne({username:msg.username},function(err, user){
            if(user){

                console.log("printing the blah blah"+msg.username);
                callback(null, user);



            }else{

                res.message = "No user found. Error";


            }
        });
    });
}


exports.update_Profile = function(msg, callback){
    console.log("The user name is boom"+ msg.username);

    var res = {};
    mongo.connect(function(){
        var coll = mongo.collection('users');
        console.log("The user name is"+ msg.username);

        coll.findOne({username:msg.username},function(err, user){
            if(user){
                res.message = "Found the user";
                console.log("printing the mess"+msg.username);
//printing the complete JSON man{"firstname":"bapu","lastname":"chandan","user_sex":"Female","username":"slash@gmail.com","user_phone":"1111","user_preferred_locale":"ca","user_native_currency":"BRL","user_city":"dan","user_about":"san"}

                coll.updateOne({username:msg.username},{$set : {firstname:msg.firstname, lastname:msg.lastname,sex:msg.user_sex,username:msg.username,phone:msg.user_phone,user_preferred_locale:msg.user_preferred_locale,user_native_currency:msg.user_native_currency,city:msg.user_city,about:msg.user_about,credit_card:msg.credit_card,profile_pic:msg.profile_pic}},{upsert:true}, function(err, user){
                    if(user){
                        // return status = 0 on successfull registration
                        console.log("updated the user successfully");
                        res.statuscode = 0;
                        callback(null, res);

                    }else{
                        // return 1 if any error occurs
                        res.statuscode = 1;
                        res.message = "Error occurred while updating the user's information";
                        callback(null, res);

                    }
                });
            }else{

             res.message = "No user found. Error";
                callback(null, res);

            }
        });
    });
}


exports.updateVideo = function(msg, callback){



var  res = {}
    //var res = {"statuscode":0, ,"message":""};
    mongo.connect(function(){

        var coll = mongo.collection('users');

        coll.update({"username":msg.username},{$set : {"videolink":msg.video}}, function(err, result){
            if(!err){
                res["statuscode"] = 0;
                res["message"] = "Video updated successfully";
            }else{
                res["statuscode"] = 1;
                res["message"] = "Unexpected error occurred while updating the video link";
            }
            callback(null, res);
        });
    });
}
