/**
 * Created by Shruti Loya on 11/17/2016.
 */
/**
 * Created by Shruti Loya on 11/17/2016.
 */

airbnbApp.controller('controllerBecomeHost',function($scope,$state,$log,$http){

    $scope.startHosting = function () {
        $state.go('home.becomeHostRoom');
    };

})
