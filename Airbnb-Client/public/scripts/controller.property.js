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
		console.log($scope.bidfromdate+" "+$scope.bidtilldate)
	}
	
		
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
					return false;
				}
				else
				{
					if(data.credentials.ishost == true)
					{	
						return true;
					}
					else
					{	
						return true;
					}
				}
			}
			else 
			{
				return false
			}
		}).error(function(error) {
			return false;
		});
	

   $scope.addDays = function(date, days){
   		var newDate = date;
   		newDate.setDate(newDate.getDate()+days)
   		return newDate;
   }

   $scope.getDates = function(checkin, checkout){
   	var dateArray = [];
   	var currentDate = checkin;
   	while(currentDate <= checkout){
   		dateArray.push(new Date(currentDate));
   		currentDate = $scope.addDays(currentDate,1);
   		console.log($scope.fromdate);
   	}
   	return dateArray;
   }


	$scope.getAvailableDates = function(){
		

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
							$scope.invDates = "Not Available : "+dateForMessage;
							alert($scope.invDates);
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


	$scope.placeYourBid = function(){
		$http({
			method : "POST",
			url : '/bid',
			data :{
				propertyid : $scope.selectedProperty.id,
				title : $scope.selectedProperty.title,
				bidamount : $scope.bidamount,
				bidder : $scope.username
			}

		}).success(function(data){
			console.log("success");
		}).error(function(error){
			console.log("error")
		});
	}
	
	
	var address = 	$scope.selectedProperty.street+",+"+
	$scope.selectedProperty.apt+",+" +
	$scope.selectedProperty.city+",+" +
	$scope.selectedProperty.state	
console.log("printing address here "+address);

 var map = 'https://maps.googleapis.com/maps/api/geocode/json?address= '+ address+' &key=AIzaSyD0bGUrKgw3YOQ2vHn_P16GazpXlnon2h4';
 $scope.display= "https://www.google.com/maps/embed/v1/search?key=AIzaSyD0bGUrKgw3YOQ2vHn_P16GazpXlnon2h4&q='+address+'";
 //console.log("printing the map url here"+map)

	
	$http({
		method : "GET",
		url : map

	}).success(function(data) {
		console.log("Success while for google maps who yaa");
		console.log(data.results[0].geometry.location.lat);
		console.log("map"+data.results[0].geometry.location.lng);
		console.log("map"+data.status);
		
		$scope.lat = data.results[0].geometry.location.lat;
		$scope.lng = data.results[0].geometry.location.lng;
	}).error(function(data){
		console.log("Error in google maps ");
	})





})