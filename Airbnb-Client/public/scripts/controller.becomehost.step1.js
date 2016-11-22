airbnbApp.controller('controllerBecomeHostStep1',function($scope,$state,$log,$http,$state){

    $scope.typeofprop = "";
    $scope.guestoption = "";
    $scope.buildingopts = "";
    $scope.hometype = "";

    $scope.becomeHostBeds = function() {
        $scope.step1details = {
            propertytype : $scope.typeofprop,
            guestaccess : $scope.guestoption,
            roomsinproperety : $scope.buildingopts,
            popertyownership : $scope.hometype
        }
        $state.go('home.becomeHostBeds', {step1det : $scope.step1details });
    };

    $scope.becomeHost = function () {
        $state.go('home.becomeHost');
    };


})