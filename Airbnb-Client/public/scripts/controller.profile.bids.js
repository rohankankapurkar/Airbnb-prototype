airbnbApp.controller('controllerTripsBids',function($scope,$http,$state,$stateParams){

      console.log("--------------in controllerTripsBids------------");
      /*
       |-----------------------------------------------------------
       | Host approval
       |-----------------------------------------------------------
      */
      $scope.noBidsAvailable = true;
      $scope.userPendingBids = [];
      $scope.userApprovedBids = [];
      $scope.NoUserPendingBidsMsg = false;
      $scope.NoUserApprovedBidsMsg = false;

      console.log("--------------before get user bidding------------");
      $http({
        method : "GET",
        url : '/user/update_profile',
        data : {}
      }).success(function(user){

          console.log("--------------usertripsbids success------------");
          console.log(user);


          if(user.bids || user.bidswon) {

            //get all properties id from bids
            var propertyIds = [];
            for(var i=0; i<user.bids.length; i++) {
              propertyIds.push(user.bids[i].propertyid);
            }

            if(user.bidswon)
                for(var i=0; i<user.bidswon.length; i++) {
                  propertyIds.push(user.bidswon[i].propertyid);
                }
            console.log(propertyIds);

            $http({
              method : "POST",
              url : '/getPropertiesForBidding',
              data: {
                propertyIds: propertyIds
              }
            }).success(function(biddingWithProperties){

                console.log("---------------biddingWithProperties---------------");
                console.log(biddingWithProperties);

                $scope.userPendingBids = user.bids;
                $scope.userApprovedBids = user.bidswon;


                //upcoming bookings
                if($scope.userPendingBids)
                    for(var i=0; i<$scope.userPendingBids.length; i++)
                        for(var j=0; j<biddingWithProperties.data.length; j++) {
                            console.log();
                            if(biddingWithProperties.data[j].id == $scope.userPendingBids[i].propertyid) {
                                $scope.userPendingBids[i].propertyDetails = biddingWithProperties.data[j];
                                $scope.userPendingBids[i].propertyDetails.from = moment($scope.userPendingBids[i].propertyDetails.from).format('YYYY-MM-DD');
                                $scope.userPendingBids[i].propertyDetails.till = moment($scope.userPendingBids[i].propertyDetails.till).format('YYYY-MM-DD');
                              }
                        }
                else
                    $scope.NoUserPendingBidsMsg = true;

                //approved bookings
                if($scope.userApprovedBids)
                    for(var i=0; i<$scope.userApprovedBids.length; i++)
                        for(var j=0; j<biddingWithProperties.data.length; j++)
                        {
                            if(biddingWithProperties.data[j].id == $scope.userApprovedBids[i].propertyid) {
                                $scope.userApprovedBids[i].propertyDetails = biddingWithProperties.data[j];
                                $scope.userApprovedBids[i].propertyDetails.from = moment($scope.userApprovedBids[i].propertyDetails.from).format('YYYY-MM-DD');
                                $scope.userApprovedBids[i].propertyDetails.till = moment($scope.userApprovedBids[i].propertyDetails.till).format('YYYY-MM-DD');
                            }
                        }
                else
                    $scope.NoUserApprovedBidsMsg = true;

                console.log("-------------------user all bids------------------------");
                console.log($scope.userPendingBids);
                console.log($scope.userApprovedBids);


            }).error(function(error) {
              console.log("error");
            });

          }else {
            $scope.NoUserPendingBidsMsg = true;
            $scope.NoUserApprovedBidsMsg = true;
          }


      }).error(function(error) {
        console.log("error");
      });


      $scope.AcceptBid = function(userBids){
          $http({
            method : "POST",
            url : '/trips/acceptBid',
            data : {
              userBids: userBids
            }
          }).success(function(acceptBid){

              console.log("--------------acceptBid success------------");
              console.log(acceptBid);
              $state.go('home.profile.trips.upcomingTrips');

          }).error(function(error) {
            console.log("error");
          });
      }

})
