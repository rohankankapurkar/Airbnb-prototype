/**
 * Created by rohankankapurkar on 11/20/16.
 */

var process = require('process');

var MODE = process.env.MODE;
var mongo = require('../utils/utils.mongo');

exports.get_properties = function(msg, callback){
console.log("-----------------The city name is---------"+ msg.city);
    var res = {statuscode : 0, message : ""};
    mongo.connect(function(){
      console.log("-----------------The property name is---------"+ msg.city);
      console.log(msg.page);
        var coll = mongo.collection('Property'),
            page = msg.page,
            per_page = 10;

        coll.find({city: msg.city}, {skip: ((page-1)*per_page), limit: per_page}, function(err, properties){
            console.log("in properties find");
            // console.log(properties);
            if(properties){
                res.message = "Found properties";
                // res.data = properties;
            }else{

             res.message = "No property found. Error";
            }
            callback(null, res);
        });

    });
}
