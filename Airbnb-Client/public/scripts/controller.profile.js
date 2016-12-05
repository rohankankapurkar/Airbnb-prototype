
airbnbApp.controller('controllerProfile',function($scope,$log,$http,$state,$sce){


$scope.inv_credit_card = "";
$scope.updatedListing = true;
$scope.updatedListingFailed = true;

//for delete user error msg
$scope.deleteUserErrorMsg = false;


$http({
	method : "GET",
	url : '/user/update_profile',
//	data : {
//
//		"username" : $scope.user_email,
//
//	}
}).success(function(data){
	console.log("--------udpatePrrofile--------------");
	console.log(data);

	if (data.statuscode == 0)
	{
		$scope.userId = data.id;
		$scope.inv_phone = "";
		$scope.inv_credit_card = "";
		console.log("got the show_prfile data"+data.username);
		console.log("got the videolink  " + data.videolink);
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
		$scope.videolink = data.videolink;


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



$scope.update_Profile = function() {
	$scope.inv_phone = "";
	$scope.inv_credit_card = "";


	if ($("#profile_pic").val()) {
		$scope.profile_pic = $("#profile_pic").val();
	}

	else {

		console.log($scope.profile_pic);

	}

	console.log("this is id" + $("#profile_pic").val());
	console.log($scope.profile_pic);

	if ($scope.user_creditcard == undefined) {
		$scope.inv_credit_card = "Please enter credit card details";
	}
	else {
		if ($scope.user_creditcard.length == 16 && !isNaN($scope.user_creditcard) && $scope.user_creditcard != null) {
			console.log("correct credit card")
		}
		else {
			$scope.inv_credit_card = "Invalid credit card";
		}
	}

	if ($scope.phone == undefined) {
		$scope.inv_phone = "Please enter your phone number";
	}
	else
	{
		if ($scope.phone.length == 10 && !(isNaN($scope.phone)) && $scope.phone != null) {
			console.log("corrct phone")
		}
		else {
			$scope.inv_phone = "Invalid phone number";

		}
	}





		if ( $scope.profile_pic != "" && $scope.user_creditcard.length == 16 && !isNaN($scope.user_creditcard) && $scope.phone.length == 10 && !isNaN($scope.phone) && $scope.user_creditcard != null && $scope.phone != null )




		{
			$scope.inv_phone = "";
			$scope.inv_credit_card = "";
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
			    "guestaccess" : document.getElementById("" + id + "-room-type").value,
			    "roomsinproperety" : document.getElementById("" + id + "-rooms").value,
			    "totbedsavailable" : document.getElementById("" + id + "-beds").value,
			    "noofguests" : document.getElementById("" + id + "-guests").value,
			    "bedsforuse" : document.getElementById("" + id + "-bedsForUse").value,
			    "bathsforuse" : document.getElementById("" + id + "-bathrooms").value,
			    "street" : document.getElementById("" + id + "-street").value,
			    "apt" : document.getElementById("" + id + "-apt").value,
			    "city" : document.getElementById("" + id + "-city").value,
			    "state" : document.getElementById("" + id + "-state").value,
			    "zip" : document.getElementById("" + id + "-zip").value,
			    "country" : document.getElementById("" + id + "-country").value,
			    "description" : document.getElementById("" + id + "-description").value,
			    "title" : document.getElementById("" + id + "-title").value,
			    "price" : document.getElementById("" + id + "-price").value,
			    "currency" : document.getElementById("" + id + "-currency").value,
			    "biddingavailable" : biddingavailable,
			    "id" : id
			}
		}).success(function(data){
			if (data.statuscode == 0)
			{
				console.log("updated the listing successfully");
				$scope.updatedListing = false;
			}
			else
			{
				if(data.message != null)
				{
					$scope.invEmail = "";
					$scope.invEmail = data.message;
				}
				$scope.updatedListingFailed = false;
			}
		}).error(function(error) {
			console.log("error");
		});
	};




	$scope.$watch('video', function(newVal, oldVal){
	    console.log("Search was changed to:"+newVal);

	    if (newVal != "" || newVal != null)
	    	{
	    $scope.videolink = newVal;
	    $http({
			method : "POST",
			url : '/host/uploadVideo',
			data : {"video" :  $scope.video}

	    }).success(function(data){
			if (data.statuscode == 0)
			{
				console.log("updated the video successfully");
				 //$scope.videolink = oldVal;
				//$scope.videolink = data.videolink;
			}





	  });
	    	}

	    else

	    	{
	        newVal = oldVal;
	        $scope.videolink = oldVal;

	    	}

	});

	 $scope.trustSrc = function(src) {
		    return $sce.trustAsResourceUrl(src);
		  }
	  $scope.movie = {src:"http://www.youtube.com/embed/Lx7ycjC8qjE", title:"Egghead.io AngularJS Binding"};





		//delete user
		$scope.deleteUser = function()
		{
				console.log("---------deleteUser--------");
				console.log($scope.userId);


				$http({
					method : "POST",
					url : '/user/deleteUser',
					data : {
						userId: $scope.userId
					}
				}).success(function(data){
						if (data.statuscode == 0)
						{
									$http({
											method : "POST",
											url : '/user/logout'
									}).success(function(data)
									{
											window.location = '/';

									}).error(function(error)
									{
											alert("Internal sever error occured");
											window.setTimeout(function()
											{
												window.location = '/';
											}, 3000);

									});
						}
						else
						{
								$scope.deleteUserErrorMsg = true;
						}
				}).error(function(error) {
					console.log("error");
				});


		}



})
