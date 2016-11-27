airbnbApp.controller('controllerProperty',function($scope,$http,$state,$stateParams){

	$scope.checkinDate = "";
	$scope.checkoutDate = "";

/*	if (typeof(Storage) !== "undefined") {
    	if($state.params.selectedProperty != null && $state.params.selectedProperty != "" && $state.params.selectedProperty != undefined )
    	{
      		localStorage.setItem('selectedProperty',$state.params.selectedProperty);
    	}
  	}*/ 

	//$scope.selectedProperty = localStorage.getItem('selectedProperty');
	$scope.selectedProperty = $state.params.selectedProperty;
	$scope.username = "";
	console.log($scope.selectedProperty);
		

	$scope.checkUserSession = function(){
			$http({
			method : "POST",
			url : '/getusersession'
		}).success(function(data) {
		
			if(data.statuscode == 0) 
			{
				$scope.username = data.username;
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
	}




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
   	}
   	return dateArray;
   }


	$scope.checkAvailability = function(){

		$scope.checkUserSession()
		//{
			var checkin = new Date($scope.fromdate);
			var checkout = new Date($scope.tilldate);
			
			
			var dateArray = $scope.getDates(checkin,checkout);

			$http({
				method : "POST",
				url : '/host/getavailabledates',
				data :{
					prop_id : $scope.selectedProperty.id
				}
			}).success(function(data) {

				//Algo for checking if the dates selected by the user are valid or not
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
							fromdate : checkin, 
							tilldate : checkout, 
							numberOfDays : counter,
							property : $scope.selectedProperty,
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
			/*
*/		//}
		//else
		//{
	//		alert("Please Sign up!!");
	//	}
		/*$state.go('home.finalPayment');*/
	}
})