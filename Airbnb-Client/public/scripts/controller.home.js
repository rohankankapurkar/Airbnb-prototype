
airbnbApp.controller('controllerHome',function($scope,$log){

	$scope.check = "";
	$scope.hmpgwhere = "";

	//hide signInError message on get signin page
	$scope.signInError = false;

	$scope.test = function()
	{
		$log.info("hello");
		$log.info($scope.hmpgwhere);
	}

	/*
   |-----------------------------------------------------------
   | User signin
   |-----------------------------------------------------------
  */
  $scope.signin = function() {
    $http({
      method : "POST",
      url : '/user/signin',
      data : {
        "email": $scope.email,
        "password": $scope.password
      }
    }).success(function(data) {
      if(data == 0) {
        window.location = '/';
			}
      else {
				//code to show error for signin
				$scope.signInError = true;
			}
    }).error(function(error) {
			alert("Internal sever error occured");
			window.setTimeout(function(){
				window.location = '/';
			}, 3000);
    });
  };

})
