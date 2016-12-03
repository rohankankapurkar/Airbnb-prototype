airbnbApp.controller('controllerEditTrip',function($scope,$state,$log,$http,$state){



    console.log("--------------in controllerEditTrip-----------");
    var tripData = $state.params.trip;
    console.log(tripData);

    $scope.checkAvailabilityStatusForEditTrip = true;
    $scope.updateEditTrip = false;
    $scope.errorInCheckTrip = false;
    $scope.errorInUpdatingTrip = false;

    $scope.editTrip = $state.params.trip;
    $scope.fromdateEditTrip = new Date(tripData.from_date);
    $scope.tilldateEditTrip = new Date(tripData.till_date);

    console.log(tripData.from_date);
    console.log($scope.fromdateEditTrip);
    console.log($scope.tilldateEditTrip);


    $scope.checkPropertyAvailability = function(propertyId, fromdateData, tilldateData){
        console.log("--------------checkPropertyAvailability---------");
        console.log(fromdateData);
        console.log(tilldateData);

        $http({
          method : "POST",
          url : '/host/getavailabledates',
          data : {
            prop_id: propertyId
          }
        }).success(function(data){

            console.log(data);

            var dateArray = [];
            dateArray.push(fromdateData);
            dateArray.push(tilldateData);
            var firstDate = dateArray[0];
            var lastDate = dateArray[dateArray.length-1];

            if(data.statuscode == 0)
    				{
    					var dateForMessage = "";
    					$scope.availableDates = data.result.data;
    					var counter = 0;
    					var flag = false;
    					console.log($scope.availableDates);

    					for(var i = 0; i < dateArray.length; i++)
    					{
    						flag=false;
    						var dateRequired = moment(dateArray[i]).format('MM/DD/YYYY');
    						for(var j=0; j < $scope.availableDates.length; j++)
    						{
    							var datesAvailable = moment($scope.availableDates[j]).format('MM/DD/YYYY');

    							if(dateRequired == datesAvailable)
    							{
    								flag =true;
    								dateForMessage = dateRequired
    								break;
    							}
    						}
    						if(flag == false)
    						{
    							$scope.errorInCheckTrip = "Dates you Selected are not Available";

    							break;
    						}
    						else
    						{
    							counter++;
    						}
    					}
    					if(flag != false)
    					{
                  $scope.checkAvailabilityStatusForEditTrip = false;
                  $scope.errorInCheckTrip = false;
      						$scope.updateEditTrip = true;
    					}
    				}
    				else
    				{
    					console.log("No available Dates")
    				}

        }).error(function(error) {
          console.log("error");
        });


    }



    $scope.updateTrip = function(propid, userid, fromdate, tilldate) {

      $http({
        method : "POST",
        url : '/updateTrip',
        data: {
          prop_id: propid,
          user_id: userid,
          from_date_previous: moment($state.params.trip.from_date).format('YYYY-MM-DD'),
          till_date_previous: moment($state.params.trip.till_date).format('YYYY-MM-DD'),
          from_date: moment(fromdate).format('YYYY-MM-DD'),
          till_date: moment(tilldate).format('YYYY-MM-DD')
        }
      }).success(function(updatedTrip){

          if(updatedTrip.statuscode == 0) {
              $state.go('home.profile.trips.upcomingTrips');
          }else {
              $scope.errorInUpdatingTrip = true;
          }

      }).error(function(error) {
        console.log("error");
      });


    }


    $scope.deleteTrip = function(propid, userid) {

      console.log("--------------deleteTrip---------------");
      console.log(propid + userid + moment($state.params.trip.from_date).format('YYYY-MM-DD') + moment($state.params.trip.till_date).format('YYYY-MM-DD'));

      $http({
        method : "POST",
        url : '/deleteTrip',
        data: {
          prop_id: propid,
          user_id: userid,
          from_date: moment($state.params.trip.from_date).format('YYYY-MM-DD'),
          till_date: moment($state.params.trip.till_date).format('YYYY-MM-DD')
        }
      }).success(function(deleteTrip){

        console.log("--------success deleteTrip-------");
        console.log(deleteTrip);

          if(deleteTrip.statuscode == 0) {
              $state.go('home.profile.trips.pendingApprovalTrips');
          }else {
              $scope.errorInDeletingTrip = true;
          }

      }).error(function(error) {
        console.log("error");
      });


    }



});
