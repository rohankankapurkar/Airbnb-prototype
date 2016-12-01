
airbnbApp.controller('controllerProfile',function($scope,$log,$http,$state){


$scope.inv_credit_card = "";


$http({
	method : "GET",
	url : '/user/update_profile',
//	data : {
//
//		"username" : $scope.user_email,
//
//	}
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
	$scope.inv_phone = "";
	$scope.inv_credit_card = "";



		console.log("Inside update profile " + $scope.user_first_name);
		console.log("bc profile pic");
			
		
		if ($("#profile_pic").val()){
		$scope.profile_pic = $("#profile_pic").val();
		}
		
		else
			{
			
			console.log( $scope.profile_pic);

			}
		
		console.log("this is id"+$("#profile_pic").val());
		console.log( $scope.profile_pic);
		
		if ($scope.user_creditcard.length == 16 && !isNaN($scope.user_creditcard))
			{
			console.log("correct credit card")
			}
		else
			{
			$scope.inv_credit_card = "Invalid credit card";
			}
		
		if ($scope.phone.length == 10 && !isNaN($scope.phone))
			{
			console.log("corrct phone")
			}
		else
			
		{
			$scope.inv_phone = "Invalid phone number";

		}
		
		
		
		
		
		
		if ( $scope.profile_pic != "" && $scope.user_creditcard.length == 16 && !isNaN($scope.user_creditcard) && $scope.phone.length == 10 && !isNaN($scope.phone))

		
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
				alert("updated information successfully");
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
		
		else
			{
			alert("incorrect info");
			
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


	$http({
		method : "POST",
		url : '/host/getPropertyHistory',
		data : {}
	}).success(function(property1){
		if (property1.statuscode == 0)
		{

			$scope.propertiesused = property1.result.data;
		}
		else
		{
			if(property1.message != null)
			{
				$scope.invEmail = "";
				$scope.invEmail = data.message;
			}
		}
	}).error(function(error) {
		console.log("error");
	});





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
				url : '/host/getPropertyHistory',
				data : {
					hostid: user.credentials.id
				}
			}).success(function(property){



				if (property.statuscode == 0)
				{

					$http({
						method : "POST",
						url : '/getUserAndProperty',
						data : {
							pendingApprovalsData: property.result.data
						}
					}).success(function(data){


						var pendingApprovals = property.result.data,
							pendingApprovalsToMerge = data.result,
							updatedPendingApprovalsClient = {};


						//mergin properties and user data to ids
						for(var i=0; i<pendingApprovals.length; i++) {
							for(var j=0; j<pendingApprovalsToMerge.updatedProperties.length; j++) {
								if(pendingApprovals[i].prop_id == pendingApprovalsToMerge.updatedProperties[j].id) {
									pendingApprovals[i].propertyDetails = pendingApprovalsToMerge.updatedProperties[j];
									pendingApprovals[i].from_date = moment(pendingApprovals[i].from_date).format("YYYY-MM-DD");
									pendingApprovals[i].till_date = moment(pendingApprovals[i].till_date).format("YYYY-MM-DD");
								}
							}
							for(var j=0; j<pendingApprovalsToMerge.updatedUser.length; j++) {
								if(pendingApprovals[i].user_id == pendingApprovalsToMerge.updatedUser[j].id) {
									pendingApprovals[i].userDetails = pendingApprovalsToMerge.updatedUser[j];
								}
							}
						}

						console.log(pendingApprovals);

						$scope.allCompletedBookings = pendingApprovals;

					}).error(function(error){
						console.log("error in getpendingpropertyrequests");
					})

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

	$scope.viewBill = function (bookingId)
	{

		for(var i=0; i<$scope.allCompletedBookings.length; i++)
		{
			if($scope.allCompletedBookings[i].id == bookingId)
			{
				$scope.booking = $scope.allCompletedBookings[i];

			}
		}

		$state.go('home.profile.viewBill',{bookings : $scope.booking});

	};
	$scope.reviewUser = function (bookingId)
	{

		for(var i=0; i<$scope.allCompletedBookings.length; i++)
		{
			if($scope.allCompletedBookings[i].id == bookingId)
			{
				$scope.booking = $scope.allCompletedBookings[i];

			}
		}

		$state.go('home.profile.reviewUser',{bookings : $scope.booking});

	};

	$scope.update_Listing = function(id){
		var biddingavailable = document.getElementById("" + id + "-bidding-available").checked;
		$http({
			method : "POST",
			url : '/host/updateThisListing',
			data : {
			    "guestaccess" : document.getElementById("" + id + "-room-type"),
			    "roomsinproperety" : document.getElementById("" + id + "-rooms"),
			    "popertyownership" : document.getElementById("" + id + "-"),
			    "totbedsavailable" : document.getElementById("" + id + "-beds"),
			    "noofguests" : document.getElementById("" + id + "-guests"),
			    "bedsforuse" : document.getElementById("" + id + "-bedsForUse"),
			    "bathsforuse" : document.getElementById("" + id + "-bathrooms"),
			    "street" : document.getElementById("" + id + "-street"),
			    "apt" : document.getElementById("" + id + "-apt"),
			    "city" : document.getElementById("" + id + "-city"),
			    "state" : document.getElementById("" + id + "-state"),
			    "zip" : document.getElementById("" + id + "-zip"),
			    "country" : document.getElementById("" + id + "-country"),
			    "description" : document.getElementById("" + id + "-description"),
			    "title" : document.getElementById("" + id + "-title"),
			    "price" : document.getElementById("" + id + "-price"),
			    "currency" : document.getElementById("" + id + "-currency"),
			    "biddingavailable" : biddingavailable,
			    "id" : id
			}
		}).success(function(data){
			if (data.statuscode == 0)
			{
				console.log("updated the listing successfully");
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
	};
})
