airbnbApp.controller('controllerCheckout',function($scope,$http,$state,$stateParams){
	
	$scope.numberOfDays = $state.params.numberOfDays;
	$scope.property = $state.params.property;
	$scope.fromdate = $state.params.fromdate;
	$scope.tilldate = $state.params.tilldate;
	$scope.username = $state.params.username;

	console.log($scope.numberOfDays);
	console.log($scope.property);
	console.log($scope.fromdate);
	console.log($scope.tilldate);
	console.log($scope.username);




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
					userid: $scope.username
				}
			}).success(function(data) {
				console.log("Success");

			})
			.error(function(data){
				console.log("Error")
			})

	}
})