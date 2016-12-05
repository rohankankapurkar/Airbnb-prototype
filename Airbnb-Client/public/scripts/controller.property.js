airbnbApp.controller('controllerProperty',function($scope,$http,$state,$stateParams){

	if (typeof(Storage) !== "undefined") {
    	if($state.params.selectedProperty != null && $state.params.selectedProperty != "" && $state.params.selectedProperty != undefined )
    	{
      		localStorage.setItem('selectedProperty',JSON.stringify($state.params.selectedProperty));
    	}
  	} 
	$scope.selectedProperty = JSON.parse(localStorage.getItem('selectedProperty'));


	$scope.checkinDate = "";
	$scope.checkoutDate = "";
	$scope.bidfromdate = "";
	$scope.bidtilldate ="";
	$scope.fromdate = "";
	$scope.tilldate = "";
	$scope.bidamount = "";
	

	$scope.minDate = $scope.selectedProperty.from;
	$scope.maxDate = $scope.selectedProperty.till;


	$scope.username = "";
	$scope.userid = "";

	$scope.bidBtn = true;
	$scope.bidError = "";
	$scope.bidSuccess = "";

	$scope.datesAvailableError = "";
	

	if($scope.selectedProperty.biddingavailable == "")
	{
		$scope.isBiddingAvailable = false;
		$scope.noBidding = true;
	}
	else if($scope.selectedProperty.biddingavailable == true)
	{
		$scope.isBiddingAvailable = true;
		$scope.noBidding = false;
		$scope.bidfromdate = new Date($scope.selectedProperty.from);
		$scope.bidtilldate = new Date($scope.selectedProperty.till);
	}
	

	$scope.getAvailableDates = function(){
		
		$http({
			method : "POST",
			url : '/getusersession'
		}).success(function(data) {
			if(data.statuscode == 0) 
			{
				$scope.username = data.username;
				$scope.userid = data.credentials.id;
				if(data.credentials.isadmin == true)
				{
					alert("You are an Admin!");
				}
				else
				{
					$scope.invDates = "";
					var frmd = moment($scope.fromdate).format('MM/DD/YYYY');
					var tilld = moment($scope.tilldate).format('MM/DD/YYYY');
					console.log(frmd+" "+tilld);
					if(tilld <= frmd)
					{
						$scope.invDates = "Invalid Dates";

					}
					else
					{
						var dateArray = $scope.getDates($scope.fromdate,$scope.tilldate);
						var firstDate = dateArray[0];
						var lastDate = dateArray[dateArray.length-1];

						$http({
							method : "POST",
							url : '/host/getavailabledates',
							data :{
								prop_id : $scope.selectedProperty.id
							}
						}).success(function(data) {
							if(data.statuscode == 0) 
							{	
								var dateForMessage = "";
								$scope.availableDates = data.result.data;
								var counter = 0;
								var flag = false;
								console.log($scope.availableDates);

								for(var i = 0; i < dateArray.length; i++)
								{	
									flag=false;
									var dateRequired = moment(dateArray[i]).format('MM/DD/YYYY');
									for(var j=0; j < $scope.availableDates.length; j++)
									{
										var datesAvailable = moment($scope.availableDates[j]).format('MM/DD/YYYY');
							
										if(dateRequired == datesAvailable)
										{
											flag =true;
											dateForMessage = dateRequired
											break;
										}	
									}
									if(flag == false)
									{
										$scope.invDates = "Dates you Selected are not Available";
										break;
									}
									else
									{
										counter++;
									}	
								}
								if(flag != false)
								{
								
									$state.go('home.finalPayment',{
										fromdate : firstDate, 
										tilldate : lastDate, 
										numberOfDays : counter,
										property : $scope.selectedProperty,
										userid: $scope.userid,
										username : $scope.username});
									}
								}	
								else 
								{
									console.log("No available Dates")
								}
						}).error(function(error) {
							console.log("No available Dates");
						});
					}
				}
			}
			else 
			{
				alert("Please Login!");
			}
	}).error(function(error) {
		return false;
	});
}
	

   $scope.addDays = function(date, days)
   {
   		var newDate = date;
   		newDate.setDate(newDate.getDate()+days)
   		return newDate;
   }

   $scope.getDates = function(checkin, checkout)
   {
   		var dateArray = [];
   		var currentDate = checkin;
   		while(currentDate <= checkout)
   		{
   			dateArray.push(new Date(currentDate));
   			currentDate = $scope.addDays(currentDate,1);
   			console.log($scope.fromdate);
   		}
   		return dateArray;
   }

	$scope.placeYourBid = function(){
		
		$scope.bidError = "";
		$scope.bidSuccess = "";

		$http({
			method : "POST",
			url : '/getusersession'
		}).success(function(data){
			
			if(data.statuscode == 0)
			{
				username = data.username;
				if(data.credentials.isadmin == true)
				{
					alert("You are an Admin!");
				}
				else
				{					
					if(!isNaN($scope.bidamount) && angular.isNumber(+$scope.bidamount))
					{
   						if(parseFloat($scope.bidamount) <= parseFloat($scope.selectedProperty.currentBid))
						{
							$scope.bidError = "Bid Amount should be greater than the Current Bid!"
						}
						else
						{
							$http({
								method : "POST",
								url : '/bid',
								data :{
									propertyid : $scope.selectedProperty.id,
									title : $scope.selectedProperty.title,
									bidamount : $scope.bidamount,
									bidder : username
								}
							}).success(function(data){
								console.log("success");
								$scope.bidSuccess = "Bid submitted";
								$scope.bidBtn = false;
							}).error(function(error){
								console.log("error")
							});	
						}
					}
					else 
					{
   						$scope.bidError = "Please Enter a valid bid amount";
					}
				}
			}
			else
			{
				alert("Please Login!")
			}
			
		});
		
	}
	
	
	var address = 	$scope.selectedProperty.street+",+"+
	$scope.selectedProperty.apt+",+" +
	$scope.selectedProperty.city+",+" +
	$scope.selectedProperty.state	


 var map = 'https://maps.googleapis.com/maps/api/geocode/json?address= '+ address+' &key=AIzaSyD0bGUrKgw3YOQ2vHn_P16GazpXlnon2h4';
 $scope.display= "https://www.google.com/maps/embed/v1/search?key=AIzaSyD0bGUrKgw3YOQ2vHn_P16GazpXlnon2h4&q='+address+'";
 

	
	$http({
		method : "GET",
		url : map

	}).success(function(data) {
		console.log(data.results[0].geometry.location.lat);
		console.log("map"+data.results[0].geometry.location.lng);
		console.log("map"+data.status);
		
		$scope.lat = data.results[0].geometry.location.lat;
		$scope.lng = data.results[0].geometry.location.lng;


		var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng($scope.lat, $scope.lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

		$scope.markers = [];
		
		var infoWindow = new google.maps.InfoWindow();
		
		
		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng($scope.lat, $scope.lng),
			title: "$" + $scope.selectedProperty.price.toString()
		});
		marker.content = '<div class="infoWindowContent">' +  $scope.selectedProperty.street+ '<br>'+ $scope.selectedProperty.city +' </div>';
		
		google.maps.event.addListener(marker, 'mouseover', function(){
			infoWindow.setContent('<h2>' + marker.title + '</h2>' + 
				marker.content);
			infoWindow.open($scope.map, marker);
		});
		
		$scope.markers.push(marker);
                    

	}).error(function(data){
		console.log("Error in google maps ");
	})


	$scope.getStars = function(rating) {
		// Get the value
		var val = parseFloat(rating);
		// Turn value into number/100
		var size = val/5*100;
		return size + '%';
	}




	$scope.openInfoWindow = function(e, selectedMarker){
                  e.preventDefault();
                  google.maps.event.trigger(selectedMarker, 'click');
              }


})