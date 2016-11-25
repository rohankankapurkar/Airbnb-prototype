airbnbApp.controller('controllerProperties',function($scope,$http,$state,$stateParams){


  $scope.city = $state.params.city;

  /*
   |-----------------------------------------------------------
   | get properties in the given city
   |-----------------------------------------------------------
  */

  
  $http({
    method : "POST",
    url : '/properties',
    data : {
      city: $scope.city,
      page: 1
    }
  }).success(function(data) {
    console.log("------------controllerProperties success----------");
    if(data.statuscode == 0)
    {
      $scope.properties = data.data;
      console.log($scope.properties);
    }
    else
    {
      alert("Error occured in fetching cities.")
      window.setTimeout(function()
			{
				$state.reload;
			}, 3000);
    }
  }).error(function(error) {
      console.log("Internal Server error occurred");
  });




  $scope.pageChanged = function(page){
    console.log("-------------pageChanged-----------");
    console.log("page number "+page);
    $http({
      method : "POST",
      url : '/properties',
      data : {
        city: $scope.city,
        page: page
      }
    }).success(function(data) {
      console.log("------------pageChanged success----------");
      if(data.statuscode == 0)
      {
        $scope.properties = data.properties;
        console.log(data.cities);
      }
      else
      {
        alert("Error occured in fetching properties.")
        window.setTimeout(function()
  			{
  				$state.reload;
  			}, 3000);
      }
    }).error(function(error) {
        console.log("Internal Server error occurred");
    });

  }

  // $scope.getRange = function(n){
  //   console.log("------------------get range---------------");
  //   return new Array(n);
  // }

});
