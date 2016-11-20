
airbnbApp.controller('controllerProfile',function($scope,$log,$http){
	
	
	$scope.update_Profile = function()
	{
		
		console.log("Inside update profile " + $scope.user_first_name);
		{
			$http({
				method : "POST",
				url : '/user/update_profile',
				data : {
					"user_first_name" : $scope.user_first_name,
					"user_last_name" : $scope.user_last_name,
					"user_sex" : $scope.user_sex,
					"user_birthday" : $scope.user_birthday_month+ $scope.user_birthday_date+$scope.user_birthday_date,
					"user_email" : $scope.user_email,
					"user_phone" : $scope.user_phone,
					"user_preferred_locale" : $scope.user_preferred_locale,
					"user_native_currency" :$scope.user_native_currency,
					"user_city" : $scope.user_city,
					"user_about":$scope.user_about
				}
			}).success(function(data){
				if (data.statuscode == 0)
				{
					//$state.go('signin');
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

})
