//super simple rpc server example
var amqp = require('amqp')
, util = require('util')
,process = require('process');


// set the mode here like connection pooling, sql caching and many more.
// process.env.MODE = "NONE";
process.env.MODE = "CONNECTION_POOL";


var signinService = require('./services/signin');
var signupService = require('./services/signup');
var hostService = require('./services/hosts/hosts.service');
var updateProfile = require('./services/user/update_profile');
var miscService = require('./services/misc/misc.commons');
var adminService = require('./services/admin/admin.service');
var getproperties = require('./services/user/user.properties');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	console.log("Started Server");

	// Signin qeue to make user sigin into the system
	cnn.queue('signin_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signinService.signinUser(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Signup queue for enabing the user to register
	cnn.queue('signup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signupService.signupUser(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//////////////////////////////////////////////////////////////////
//
//						HOST STUFF HERE
//
/////////////////////////////////////////////////////////////////


	// Service to check if the user is host or not
	cnn.queue('checkIsHost_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.checkIsHost(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to  check if given address is valid or not. If not it will return the valid address.
	cnn.queue('validateAddress_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.validateAddress(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to add property in db and make user a host or send his request for approval to admin
	cnn.queue('becomeHost_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.becomeHost(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//////////////////////////////////////////////////////////////////
//
//						MISC STUFF HERE
//
//////////////////////////////////////////////////////////////////


	// Service to  check the credentials of given user, i.e. admin or host or both
	cnn.queue('checkCredentials_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			miscService.checkCredentials(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//////////////////////////////////////////////////////////////////
//
//						USER STUFF HERE
//
//////////////////////////////////////////////////////////////////


	// Service to show the user profile
	cnn.queue('profile_show_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			updateProfile.show_Profile(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to update the user profile
	cnn.queue('profile_update_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			updateProfile.update_Profile(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	// Service to update the user profile
	cnn.queue('getproperties_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			getproperties.get_properties(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});






//////////////////////////////////////////////////////////////////
//
//						ADMIN STUFF HERE
//
//////////////////////////////////////////////////////////////////


// Service to get all host's pending requests
	cnn.queue('getPendingRequests_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			adminService.getPendingRequests(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


// Service to approve host's requests
	cnn.queue('approveRequest_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			adminService.approveRequest(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


});
