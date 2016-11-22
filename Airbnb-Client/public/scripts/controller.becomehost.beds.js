airbnbApp.controller('controllerBecomeHostBeds',function($scope,$state,$log,$http,$state){

    $scope.step1det = $state.params.step1det;
    $scope.totalbeds = "";
    $scope.noofguests = "";
    $scope.bedsforuse = ""
    $scope.bathsforuse = "";
    $scope.step2det = {};

    console.log($scope.step1det.propertytype+" "+$scope.step1det.guestaccess+" "+$scope.step1det.roomsinproperety+" "+$scope.step1det.popertyownership)
    

    $scope.becomeHostLocation = function() {

        $scope.step2det = {
            propertytype : $scope.step1det.propertytype,
            guestaccess : $scope.step1det.guestaccess,
            roomsinproperety : $scope.step1det.roomsinproperety,
            popertyownership : $scope.step1det.popertyownership,
            totbedsavailable : $scope.totalbeds,
            noofguests : $scope.noofguests,
            bedsforuse : $scope.bedsforuse,
            bathsforuse : $scope.bathsforuse
        }
        console.log($scope.totalbeds+ " "+$scope.noofguests+" "+$scope.bedsforuse+" "+$scope.bathsforuse);
        $state.go('home.becomeHostLocation', {step2det : $scope.step2det});
    };


    $scope.startHosting1 = function () {
        $state.go('home.becomeHostStep1');
    };

})