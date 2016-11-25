airbnbApp.controller('controllerProperties',function($scope,$http,$state,$stateParams){


  $scope.city = $state.params.city;
  $scope.noPropertiesFound = false;
  $scope.selectedProperty = $state.params.selectedProperty;
  

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
    if(data.statuscode == 0)
    {
      $scope.properties = data.data;
      console.log($scope.properties);
    }
    else
    {
      $scope.noPropertiesFound = true;
    }
  }).error(function(error) {
      console.log("Internal Server error occurred");
  });




  $scope.pageChanged = function(page){
    $http({
      method : "POST",
      url : '/properties',
      data : {
        city: $scope.city,
        page: page
      }
    }).success(function(data) {
      if(data.statuscode == 0)
      {
        $scope.properties = data.data;
      }
      else
      {
        $scope.noPropertiesFound = true;
      }
    }).error(function(error) {
        console.log("Internal Server error occurred");
    });

  }

  // $scope.getRange = function(n){
  //   console.log("------------------get range---------------");
  //   return new Array(n);
  // }

  $scope.transitionToProperty = function(propertyId){
    $scope.selectedProperty = [];
    for(var i=0; i<$scope.properties.length; i++) {
      if($scope.properties[i]._id == propertyId)
        $scope.selectedProperty = $scope.properties[i];
    }
    console.log($scope.selectedProperty);
    $state.go('home.property', {selectedProperty: $scope.selectedProperty});
  }

});
