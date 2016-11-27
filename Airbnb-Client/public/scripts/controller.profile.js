
airbnbApp.controller('controllerProfile',function($scope,$log,$http){




	$http({
		method : "GET",
		url : '/user/update_profile',
//		data : {
//
//			"username" : $scope.user_email,
//
//		}
	}).success(function(data){
		if (data.statuscode == 0)
		{
			console.log("got the show_prfile data"+data.username);
			//printing the user name here babyslash@gmail.com{"_id":"5832d422402a63fcf41fc033","username":"slash@gmail.com","password":"f70feeaffcd3f592a4fb7812b7d86d","firstname":"bapu","lastname":"jamm","birthday":"2016-11-01","ishost":false,"id":"428-82-0311","lastLogin":"Mon Nov 21 2016 03:24:32 GMT-0800 (PST)","sex":"Female","phone":"1234","user_preferred_locale":"de","user_native_currency":"CLP","city":"lonfon","about":"man i aint cool"}

			$scope.user_first_name = data.firstname;
			$scope.user_last_name=data.lastname;
			$scope.user_email = data.username;
			$scope.sex=data.sex;
			$scope.phone=data.phone;
			$scope.city=data.city;
			$scope.about=data.about;
			$scope.user_native_currency= data.user_native_currency;
			$scope.user_preferred_locale=data.user_preferred_locale;
			$scope.user_creditcard = data.credit_card;
			$scope.profile_pic = data.profile_pic;


		}
		else
		{
			if(data.message != null)
			{
				$scope.invEmail = "";
				$scope.invEmail = data.message;
			}
		}
	}).error(function(error) {
		console.log("error");
	});



	$scope.update_Profile = function()
	{

		console.log("Inside update profile " + $scope.user_first_name);
		console.log("bc profile pic");

		  $scope.profile_pic = $("#profile_pic").val();
		  console.log( $scope.profile_pic);
		{
			$http({
				method : "POST",
				url : '/user/update_profile',
				data : {
					"user_first_name" : $scope.user_first_name,
					"user_last_name" : $scope.user_last_name,
					"user_sex" : $scope.sex,
					"user_birthday" : $scope.user_birthday_month+ $scope.user_birthday_date+$scope.user_birthday_date,
					"user_email" : $scope.user_email,
					"user_phone" : $scope.phone,
					"user_preferred_locale" : $scope.user_preferred_locale,
					"user_native_currency" :$scope.user_native_currency,
					"user_city" : $scope.city,
					"user_about":$scope.about,
					"credit_card" : $scope.user_creditcard,
					"profile_pic" :$scope.profile_pic
				}
			}).success(function(data){
				if (data.statuscode == 0)
				{
					console.log("updated the profile successfully");
				}
				else
				{
					if(data.message != null)
					{
						$scope.invEmail = "";
						$scope.invEmail = data.message;
					}
				}
			}).error(function(error) {
				console.log("error");
			});
		}

	}

	$http({
		method : "POST",
		url : '/host/getmyproperties',
		data : {}
	}).success(function(property){
		if (property.statuscode == 0)
		{
			//console.log("got the host property data"+property.result.data);


		   //console.log("sappaliga"+property.data[0].street);
		  //console.log("printing the received JSON obj" +JSON.stringify(property.result.data));


			$scope.properties = property.result.data;




		}
		else
		{
			if(property.message != null)
			{
				$scope.invEmail = "";
				$scope.invEmail = data.message;
			}
		}
	}).error(function(error) {
		console.log("error");
	});


	/*
	 |-----------------------------------------------------------
	 | Host approval
	 |-----------------------------------------------------------
	*/
	$scope.notAvailableMsg = false;
	$scope.userrequestapproved = false;
	$scope.checkAvailabilityStatus = false;

	$http({
	  method : "POST",
	  url : '/getusersession',
	  data : {}
	}).success(function(user){
	  console.log("user session");
	  if (user.statuscode == 0)
	  {
	    console.log(user);
	    $http({
	      method : "POST",
	      url : '/host/getpendingpropertyrequests',
	      data : {
	        hostid: user.credentials.id
	      }
	    }).success(function(property){
	      console.log("------------getpendingpropertyrequests--------------");
	      console.log(property.pendingApprovals);
	      if (property.statuscode == 0)
	      {
	        $scope.pendingApprovals = property.pendingApprovals;
	      }
	      else
	      {

	      }
	    }).error(function(error) {
	      console.log("error");
	    });

	  }
	  else
	  {

	  }
	}).error(function(error) {
	  console.log("error");
	});



	$scope.checkPropertyAvailability = function(propertyId){
	  $http({
	    method : "POST",
	    url : '/host/getpropertyavailable',
	    data : {
	      propid: propertyId,
	      userid: user
	      // formdate: ,
	      // tilldate:
	    }
	  }).success(function(property){
	    if (property.statuscode == 0)
	    {
	      if(property.data.available == true)
	        $scope.checkAvailabilityStatus = true;
	      else
	        $scope.checkAvailabilityStatus = false;
	    }
	    else
	    {
	      $scope.notAvailableMsg = true;
	    }
	  }).error(function(error) {
	    console.log("error");
	  });
	}

	$scope.ApproveBooking = function(propertyId){
	  $http({
	    method : "POST",
	    url : '/host/approveuserrequest',
	    data : {
	      propid: propertyId
	    }
	  }).success(function(property){
	    if (property.statuscode == 0)
	    {
	      $scope.userrequestapproved = true;
	    }
	    else
	    {
	      // $scope.notAvailableMsg = true;
	    }
	  }).error(function(error) {
	    console.log("error");
	  });
	}


	/*
	 |-----------------------------------------------------------
	 | User trips section
	 |-----------------------------------------------------------
	*/
	$scope.noPropertiesFoundMsg = false;

	$http({
	  method : "POST",
	  url : '/getusersession',
	  data : {}
	}).success(function(user){

	  if (user.statuscode == 0)
	  {
	      console.log("before get trips");
	      console.log(user.credentials.id);
	      $http({
	        method : "POST",
	        url : '/getUserTrips',
	        data: {
	          userId: user.credentials.id
	        }
	      }).success(function(userTrips){
	        console.log("-----------------getUserTrips----------");
	        console.log(userTrips);
	          if (userTrips.statuscode == 0)
	          {
	              console.log("-----------------userTrips.statuscode = 0----------");
	              // if(userTrips.data.length > 0) {

	                  $http({
	                    method : "POST",
	                    url : '/getPropertiesForUserTrips',
	                    data: {
	                      properties: userTrips.data
	                    }
	                  }).success(function(tripProperties){

	                        console.log("-----------------getPropertiesForUserTrips----------");
	                        console.log(tripProperties);
	                        var allUserTrips = tripProperties.data,
	                            upcomingTrips = [],
	                            completedTrips = [];

	                        //upcoming bookings
	                        var todaysDate = Date.now();
	                        for(var i=0; i<allUserTrips.length; i++)
	                        {
	                          if(allUserTrips[i].till_date < todaysDate)
	                            upcomingTrips.push(allUserTrips[i]);
	                          else
	                            completedTrips.push(allUserTrips[i]);
	                        }
	                        console.log(upcomingTrips);
	                        console.log(completedTrips);
	                        //update scope values
	                        $scope.upcomingTrips = upcomingTrips;
	                        $scope.completedTrips = completedTrips;


	                  }).error(function(error) {
	                    console.log("error");
	                  });


	            // }else {
	            // 	$scope.noPropertiesFoundMsg = true;
	            // }

	          }
	          else
	          {
	            console.log("--------------userTrips.statuscode = 1----------");
	          }

	      }).error(function(error) {
	        console.log("error");
	      });

	  }
	  else
	  {

	  }
	}).error(function(error) {
	  console.log("error");
	});


})



//this is for showing the listing for the host
