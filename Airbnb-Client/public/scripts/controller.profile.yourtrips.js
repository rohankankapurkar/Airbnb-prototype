airbnbApp.controller('controllerYourTrips',function($scope,$state,$log,$http,$state){



  console.log("--------------in controllerYourTrips-----------");

    /*
     |-----------------------------------------------------------
     | User trips section
     |-----------------------------------------------------------
    */
    $scope.noPropertiesFoundMsg = false;

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
                            var allUserTrips = tripProperties.data,
                                upcomingTrips = [],
                                completedTrips = [];

                            //upcoming bookings
                            var todaysDate = Date.now();
                            for(var i=0; i<allUserTrips.length; i++)
                            {
                              if(allUserTrips[i].till_date < todaysDate)
                                upcomingTrips.push(allUserTrips[i]);
                              else
                                completedTrips.push(allUserTrips[i]);
                            }
                            console.log(upcomingTrips);
                            console.log(completedTrips);
                            //update scope values
                            $scope.upcomingTrips = upcomingTrips;
                            $scope.completedTrips = completedTrips;


                      }).error(function(error) {
                        console.log("error");
                      });


                }else {
                	$scope.noPropertiesFoundMsg = true;
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

})
