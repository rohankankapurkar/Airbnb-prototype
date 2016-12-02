airbnbApp.controller('controllerCheckout',function($scope,$http,$state,$stateParams){

	if (typeof(Storage) !== "undefined") {
    	if($state.params.numberOfDays != null && $state.params.numberOfDays != "" && $state.params.numberOfDays != undefined)
    	{
      		localStorage.setItem('numberOfDays',JSON.stringify($state.params.numberOfDays));
    	}
    	if($state.params.property != null && $state.params.property != "" && $state.params.property != undefined)
    	{
    		localStorage.setItem('property',JSON.stringify($state.params.property));	
    	}
    	if($state.params.fromdate != null && $state.params.fromdate != "" && $state.params.fromdate != undefined)
    	{
    		localStorage.setItem('fromdate',JSON.stringify($state.params.fromdate));	
    	}
    	if($state.params.tilldate != null && $state.params.tilldate != "" && $state.params.tilldate != undefined)
    	{
    		localStorage.setItem('tilldate',JSON.stringify($state.params.tilldate));	
    	}
    	if($state.params.username != null && $state.params.username != "" && $state.params.username != undefined)
    	{
    		localStorage.setItem('username',JSON.stringify($state.params.username));	
    	}
    	if($state.params.userid != null && $state.params.userid != "" && $state.params.userid != undefined)
    	{
    		localStorage.setItem('userid',JSON.stringify($state.params.userid));	
    	}
  	} 
	
	$scope.numberOfDays = JSON.parse(localStorage.getItem('numberOfDays'));
	$scope.property = JSON.parse(localStorage.getItem('property'));
	$scope.fromdate = JSON.parse(localStorage.getItem('fromdate'));
	$scope.tilldate = JSON.parse(localStorage.getItem('tilldate'));
	$scope.username = JSON.parse(localStorage.getItem('username'));
	$scope.userid = JSON.parse(localStorage.getItem('userid'));

	console.log($scope.numberOfDays);
	console.log($scope.property);
	console.log($scope.fromdate);
	console.log($scope.tilldate);
	console.log($scope.username);




	console.log($scope.property);
	console.log($scope.userid)

	var price = parseInt($scope.numberOfDays * parseInt($scope.property.price));
	//This function should be called after all validations.
	//Either call all the validaion functions from this function or call this from the validation funcitons in if-else
	//But should be called at the end
	$scope.finalCheckout = function(){
		$http({
				method : "POST",
				url : '/user/bookproperty',
				data :{
					propid : $scope.property.id,
					fromdate : $scope.fromdate,
					todate: $scope.tilldate,
					userid: $scope.userid,
					hostid: $scope.property.hostdata[0].id,
					city : $scope.property.city,
					price : price
					//hostdata:$scope.property.hostdata[0]
				}
			}).success(function(data) {
				console.log("Success");
		        $state.go('home.profile.trips')


			})
			.error(function(data){
				console.log("Error")
			})

	}
})