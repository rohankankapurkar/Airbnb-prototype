airbnbApp.controller('controllerBecomeHostLocation',function($scope,$state,$log,$http,$state){

    $scope.step2det = $state.params.step2det;
    $scope.country = "";
    $scope.street = "";
    $scope.apt = "";
    $scope.city = "";
    $scope.state = "";
    $scope.zip = "";


    console.log($scope.step2det)
    

    $scope.becomeHost  = function() {

        var address = $scope.street+", "+$scope.city+", "+$scope.state+", "+$scope.zip+", "+$scope.country;
        $scope.step2det.street = $scope.street;
        $scope.step2det.apt = $scope.apt;
        $scope.step2det.city = $scope.city;
        $scope.step2det.state = $scope.state;
        $scope.step2det.zip = $scope.zip;
        $scope.step2det.country = $scope.country;
        
        /*bathsforuse, bedsforuse, guestaccess, noofguests, popertyownership, propertytype, roomsinproperety,totbedsavailable*/

        $state.go('home.becomeHost',{firstStep : $scope.step2det});
    };


   $scope.becomeHostBeds = function () {
        $state.go('home.becomeHostBeds');
    
    };

})