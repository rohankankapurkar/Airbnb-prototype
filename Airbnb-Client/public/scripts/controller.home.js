
airbnbApp.controller('controllerHome',function($scope,$log){
	
	$scope.check = "";
	$scope.hmpgwhere = "";
	
	$scope.test = function()
	{
		$log.info("hello");
		$log.info($scope.hmpgwhere);
	}
	
})