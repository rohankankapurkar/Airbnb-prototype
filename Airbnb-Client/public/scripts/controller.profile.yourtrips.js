airbnbApp.controller('controllerYourTrips',function($scope,$state,$log,$http,$state){



  console.log("--------------in controllerYourTrips-----------");

    /*
     |-----------------------------------------------------------
     | User trips section
     |-----------------------------------------------------------
    */
    $scope.noPendingTripsFoundMsg = false;
    $scope.noupcomingTripsFoundMsg = false;
    $scope.nocompletedTripsFoundMsg = false;

    $http({
      method : "POST",
      url : '/getusersession',
      data : {}
    }).success(function(user){

      if (user.statuscode == 0)
      {
          console.log("before get trips");
          console.log(user.credentials.id);
          $http({
            method : "POST",
            url : '/getUserTrips',
            data: {
              userId: user.credentials.id
            }
          }).success(function(userTrips){
              console.log("-----------------getUserTrips----------");
              console.log(userTrips);
              if (userTrips.statuscode == 0)
              {
                  console.log("-----------------userTrips.statuscode = 0----------");
                  if(userTrips.data.length > 0) {

                      $http({
                        method : "POST",
                        url : '/getPropertiesForUserTrips',
                        data: {
                          properties: userTrips.data
                        }
                      }).success(function(tripProperties){

                            console.log("-----------------getPropertiesForUserTrips----------");
                            console.log(tripProperties);

                            //get todays date
                            today = moment().format('YYYY-MM-DD');

                            var allUserTrips = userTrips.data,
                                tripsData = tripProperties.data,
                                pendingApprovalTrips = [],
                                upcomingTrips = [],
                                completedTrips = [];

                            //upcoming bookings
                            console.log("-----------before for loop--------");
                            console.log(allUserTrips);
                            console.log(tripsData);
                            for(var i=0; i<allUserTrips.length; i++)
                                for(var j=0; j<tripsData.length; j++)
                                    if(allUserTrips[i].prop_id == tripsData[j].id) {
                                        allUserTrips[i].from_date = moment(allUserTrips[i].from_date).format('YYYY-MM-DD');
                                        allUserTrips[i].till_date = moment(allUserTrips[i].till_date).format('YYYY-MM-DD');
                                        allUserTrips[i].propertyDetails = tripsData[j];
                                    }

                            console.log("-----------after for loop--------");
                            console.log(allUserTrips);


                            for(var i=0; i<allUserTrips.length; i++) {

                                console.log(allUserTrips[i].till_date+ " "+today);
                                if(allUserTrips[i].till_date > today && allUserTrips[i].approved == 0) {
                                  pendingApprovalTrips.push(allUserTrips[i]);
                                }
                                else if(allUserTrips[i].till_date > today && allUserTrips[i].approved == 1) {
                                  upcomingTrips.push(allUserTrips[i]);
                                }
                                else if(allUserTrips[i].till_date < today && allUserTrips[i].approved == 1) {
                                  completedTrips.push(allUserTrips[i]);
                                }

                            }




                            console.log("--------all user trips");
                            console.log(pendingApprovalTrips);
                            console.log(upcomingTrips);
                            console.log(completedTrips);
                            //update scope values
                            if(pendingApprovalTrips.length == 0)
                              $scope.noPendingTripsFoundMsg = true;
                            if(upcomingTrips.length == 0)
                              $scope.noupcomingTripsFoundMsg = true;
                            if(completedTrips.length == 0)
                              $scope.nocompletedTripsFoundMsg = true;

                            $scope.pendingApprovalTrips = pendingApprovalTrips;
                            $scope.upcomingTrips = upcomingTrips;
                            $scope.completedTrips = completedTrips;


                      }).error(function(error) {
                        console.log("error");
                      });


                }else {
                  $scope.noPendingTripsFoundMsg = true;
                	$scope.noupcomingTripsFoundMsg = true;
                  $scope.nocompletedTripsFoundMsg = true;
                }

              }
              else
              {
                console.log("--------------userTrips.statuscode = 1----------");
              }

          }).error(function(error) {
            console.log("error");
          });

      }
      else
      {

      }
    }).error(function(error) {
      console.log("error");
    });


    $scope.reviewTrip = function (bookingId)
    {

        for(var i=0; i<$scope.completedTrips.length; i++)
        {
            if($scope.completedTrips[i].id == bookingId)
            {
                $scope.booking = $scope.completedTrips[i];

            }
        }

        $state.go('home.profile.reviewTrip',{bookings : $scope.booking});

    };


    $scope.editTrip = function (bookingId, fromdate, tilldate, index)
    {
        console.log("-------in edit trip--------");
        console.log(fromdate);
        console.log(tilldate);
        console.log(index);

        // for(var i=0; i<$scope.pendingApprovalTrips.length; i++)
        // {
        //     console.log($scope.pendingApprovalTrips[i]);
        //
        //     if($scope.pendingApprovalTrips[i].id == bookingId && $scope.pendingApprovalTrips[i].from_date == fromdate && $scope.pendingApprovalTrips[i].till_date == tilldate)
        //     {
        //         console.log("-----found pendingApprovalTrips");
        //         console.log($scope.pendingApprovalTrips[i]);
        //         $scope.tripToEdit = $scope.pendingApprovalTrips[i];
        //
        //     }
        // }
        $scope.tripToEdit = $scope.pendingApprovalTrips[index];
        console.log("---------tripToEdit--------");
        console.log($scope.tripToEdit);
        $state.go('home.profile.trips.editTrip',{trip : $scope.tripToEdit});

    };


})
