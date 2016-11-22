airbnbApp.controller('controllerBecomeHostStep2',function($scope,$state,$log,$http,$state, $window){


    $scope.firststepdet = $state.params.firstStep;

    $scope.becomeHostDesc = function () {
        $scope.firststepdet.images = $window.images;
        $state.go('home.becomeHostDesc',{ imagestep : $scope.firststepdet});
    };


    $scope.becomeHost = function(){
        $state.go('home.becomeHost')
    }

/*
    $scope.startHosting2 = function () {
        $state.go('home.becomeHostStep2');
    };
    /*
    $scope.startHosting3 = function () {
        $state.go('home.becomeHostStep3');
    };


    $scope.becomeHostDesc = function () {
        $state.go('home.becomeHostDesc');
    };


    $scope.becomeHostDates = function () {
        $state.go('home.becomeHostDates');
    };*/


})