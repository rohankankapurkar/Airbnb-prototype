var process = require('process');
var MODE = process.env.MODE;
var moment = require('moment');

//Identify the mode and then import the required libraries
if(MODE == "CONNECTION_POOL"){
    var mongo = require('../utils/utils.mongo');
    var mysql = require('../utils/utils.mysql');
}else{
    var mongo = require('../utils/utils.mongo');
    var mysql = require('../utils/utils.mysql');
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
                ,{$match : {'city':msg.city,'hostdata.approved':true , 'hostdata.username':{$ne:msg.username}}}
                ,{$skip:skipBefore}
                ,{$limit:perPage}]).toArray(function(err, result){
                    if(err){
                        res['statuscode'] = 1;
                        res['message'] = "Unexpected error occurred while retrieving the properties";
                    }else{
                        console.log("--------server side proeprties fetched---------");
                        console.log(result);
                        res['statuscode'] = 0;
                        res['data'] = result;
                    }
                    callback(null, res);
                });
        });
}

// This will add request for booking into the book_propertiese table in mysql by checking the date constraints.
exports.bookProperty = function(msg, callback){

    var res = {"statuscode":0, "message":""};
    var bookDateFrom = moment(msg.fromdate).format('YYYY-MM-DD');
    var bookDateTo = moment(msg.todate).format('YYYY-MM-DD');


    var userId = msg.userid;
    var propId = msg.propid;
    var paramsPropSelector = {"prop_id":propId};

    mysql.executeQuery("SELECT * FROM AVAILABLE_DATES WHERE ?", paramsPropSelector, function(result){
        if(result){
            var counter = 0;
            for(counter = 0; counter < result.length; counter++){
                
                console.log("book date :" + result[counter]['from_date'])
                var from_date_db = moment(result[counter]['from_date']).format('YYYY-MM-DD');
                var to_date_db =  moment(result[counter]['till_date']).format('YYYY-MM-DD');
                
                if(bookDateFrom >= from_date_db && bookDateTo <= to_date_db){

                    // Make entry into the booked_properties so that host can review the user's request and approve them.
                    var booking_params = {'prop_id' : propId, 'user_id':userId, 'from_date':bookDateFrom, 'till_date':bookDateTo, 'accepted':false}
                    mysql.executeQuery("INSERT INTO BOOKED_PROPERTIES SET ? ", booking_params, function(booking_result){
                        console.log('Inserted new booking into the table');
                        res['statuscode'] = 0; 
                        res['message'] = "Your request has been sent to host";
                        callback(null, res);
                    });
                }
            }
        }else{
            res['statuscode'] = 1;
            res['message'] = "Error ocurred while placing your request";
            callback(null, res);
        }
    });
}

