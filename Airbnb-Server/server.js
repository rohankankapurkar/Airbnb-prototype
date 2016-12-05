//super simple rpc server example
var amqp = require('amqp')
, util = require('util')
,process = require('process');


// set the mode here like connection pooling, sql caching and many more.
// process.env.MODE = "NONE";
process.env.MODE = "CONNECTION_POOL";
//process.env.CACHE = "REDIS";


var signinService = require('./services/signin');
var signupService = require('./services/signup');
var hostService = require('./services/hosts/hosts.service');
var updateProfile = require('./services/user/update_profile');
var miscService = require('./services/misc/misc.commons');
var adminService = require('./services/admin/admin.service');
var getProperties = require('./services/user/user.properties');
var userGetTrips = require('./services/user/user.getTrips');
var bidding = require('./services/bidding/service.bidding');
var hostDashService = require('./services/hosts/hosts.dash');
var userDelete = require('./services/user/user.deleteUser');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	console.log("Started Server");



///////////////////////////////////////////////////////////////
//
//			HOST DASHBOARD SERVICE
///////////////////////////////////////////////////////////////


//service to return clicks per page
cnn.queue('getClickPerPage_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostDashService.getClickPerPage(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//service to return clicks per proprty
cnn.queue('getClickPerProperty_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostDashService.getClickPerProperty(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//service to return area seen
cnn.queue('getAreaSeen_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostDashService.getAreaSeen(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

//service to return review count of property
cnn.queue('getReviewCount_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostDashService.getReviewCount(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//service to get properties losted by host
cnn.queue('getPropertiesByHost_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostDashService.getPropertiesByHost(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//service to get bid stats
cnn.queue('getBidStats_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostDashService.getBidStats(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

/////////////////////////////////////////////////////////////////////


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


	// Service to update the video
	cnn.queue('updateVideo_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			updateProfile.updateVideo(message, function(err,res){
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


	// Service to update the trip dates
	cnn.queue('updateTrip_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.updateTrip(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to delete trip
	cnn.queue('deleteTrip_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.deleteTrip(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


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


	// Service to add property in db and make user a host or send his request for approval to admin
	cnn.queue('getMyProperties_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.getMyProerties(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to get avaiable dates of property
	cnn.queue('getAvailableDates_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.getAvailableDates(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to check if the property is available before approving
	cnn.queue('checkPropertyAvailable_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.checkPropertyAvailable(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to approve user's booking request
	cnn.queue('approveUserRequest_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.approveUserRequest(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to disapprove user's booking request
	cnn.queue('disapproveRequest_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.disapproveRequest(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	// Service to get pending property requests
	cnn.queue('getPendingPropertyRequests_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.getPendingPropertyRequests(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to get user's and property detaills data from mongo
	cnn.queue('getUserPropData_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.getUserPropData(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	cnn.queue('getMyPropertiesHistory_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.getPropertiesHistory(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});	});

	cnn.queue('saveUserReview_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			getProperties.saveReview(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('updateListing_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.updateListing(message, function(err,res){
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


	// call to get all the trips
	cnn.queue('getTrips_queue', function(q){
	  q.subscribe(function(message, headers, deliveryInfo, m){
	    util.log(util.format( deliveryInfo.routingKey, message));
	    util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
	    userGetTrips.getTrips(message, function(err,res){
	      //return index sent
	      cnn.publish(m.replyTo, res, {
	        contentType:'application/json',
	        contentEncoding:'utf-8',
	        correlationId:m.correlationId
	      });
	    });
	  });
	});

	// get all properties details from user trips
	cnn.queue('getPropertiesForUserTrips_queue', function(q){
	  q.subscribe(function(message, headers, deliveryInfo, m){
	    util.log(util.format( deliveryInfo.routingKey, message));
	    util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
	    userGetTrips.getPropertiesForUserTrips(message, function(err,res){
	      //return index sent
	      cnn.publish(m.replyTo, res, {
	        contentType:'application/json',
	        contentEncoding:'utf-8',
	        correlationId:m.correlationId
	      });
	    });
	  });
	});

	// populate properties with data from mongo
	cnn.queue('getUserAndProperty_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			userGetTrips.getUserAndProperty(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// get all properties details from user trips
	cnn.queue('getPropertiesForBidding_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			userGetTrips.getPropertiesForBidding(message, function(err,res){
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
	cnn.queue('getProperties_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			getProperties.getProperties(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});



	// Service to book the property
	cnn.queue('bookProperty_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			getProperties.bookProperty(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	//User Reviewing Property
	cnn.queue('saveTripReview_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.saveReview(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//User Reviewing Property
	cnn.queue('deleteUser_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			userDelete.deleteUser(message, function(err,res){
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

// Service to get list of hosts based on area
	cnn.queue('searchHosts_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			adminService.searchHosts(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//Service to get top properties with revenue
	cnn.queue('getTopProps_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			adminService.getTopProps(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//Service to get top hosts with revenue
	cnn.queue('getTopHosts_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			adminService.getTopHosts(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


//Service to get top hosts with revenue
	cnn.queue('getTopCities_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			adminService.getTopCities(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});






//==============================================================================================


//Service to post review for a property
	cnn.queue('savePropertyReview_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.saveReview(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

//Service to get reviews for a property
	cnn.queue('getPropertyReview_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				hostService.getReview(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});

//Service to post review for a user
	cnn.queue('saveUserReview_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				getProperties.saveReview(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});

//Service to get reviews for a user
	cnn.queue('getUserReview_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				hostService.getReview(message, function(err,res){
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
	//						BIDDING
	//
	//////////////////////////////////////////////////////////////////
		cnn.queue('updateBidLog_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				bidding.updateBidLog(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});

		cnn.queue('updatePropertyBids_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				bidding.updatePropertyCollection(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});

		cnn.queue('bidcheckout_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				bidding.checkout(message, function(err,res){
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
