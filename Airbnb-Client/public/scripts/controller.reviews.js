/**
 * Created by Shruti Loya on 11/29/2016.
 */
airbnbApp.controller('controllerReview',function($scope,$state,$log,$http,$state,$window)
{
    $scope.booking = $state.params.bookings;
    $scope.total = $state.params.bookings.price + 300;
    $scope.nights = moment($state.params.bookings.till_date).diff(moment($state.params.bookings.from_date), 'days');
    $scope.saveReview = function (uname)
    {
        alert($window.rating);
        $http({
            method: "POST",
            url: '/host/userReview',
            data: {
                rating: $window.rating,
                username: uname,
                reviewPost: $scope.reviewPost
            }
        }).success(function (data) {

            console.log(data);
            $state.go('home.profile.history');

        }).error(function (error) {
            console.log("error");
        });

    }
    $scope.savePropReview = function (propId) {

        $http({
            method: "POST",
            url: '/user/hostReview',
            data: {
                ratings: $window.rating,
                propertyId: propId,
                propImage: $window.propimages,
                reviewPost: $scope.reviewProp
            }
        }).success(function (data) {

            console.log(data);
            $state.go('home.profile.trips.compeletedTrips');

        }).error(function (error) {
            console.log("error");
        });

    }

})