airbnbApp.controller('controllerProperties',function($scope,$http,$log,$state,$stateParams){

  if (typeof(Storage) !== "undefined") {
    if($state.params.city != null && $state.params.city != "" && $state.params.city != undefined )
    {
      console.log($state.params.city);
      localStorage.setItem('city',$state.params.city)
    }
  } 


  
  $scope.city = localStorage.getItem('city');
  $scope.noPropertiesFound = false;
  $scope.selectedProperty = $state.params.selectedProperty;

  $scope.property_min_price = 0;
  $scope.property_max_price = 0;

  $scope.startDateFilter = "";
  $scope.endDateFilter = "";

  $scope.typeOfProperty = "";

  $scope.prvRoom = true;
  $scope.shRoom = true;
  $scope.entRoom = true;

  $scope.guestsFilter = 1;

  
  $scope.propertyPriceRangeFilter = function(property) {
    return (parseInt(property['price']) >= $scope.property_min_price && parseInt(property['price']) <= $scope.property_max_price);
  };
  
<<<<<<< Updated upstream
  $scope.propertyDateRangeFilter = function(property){
    var startDate = new Date(property['from']);
    var endDate = new Date(property['till']);
    
    var checkin = "";
    var checkout = "";
    
    if($scope.startDateFilter != "")
      checkin = new Date($scope.startDateFilter);
     
    if($scope.endDateFilter != "")
      checkout = new Date($scope.endDateFilter);

    if(checkin == "" || checkout == "" )
      return true;
    else if(startDate <= checkin && endDate >= checkout)
      return true;
    else
      return false;
  }

  $scope.propertyTypeFilter = function(property){
    if(property['guestaccess'] == "entire_home" && $scope.entRoom == true)
      return property;
    if(property['guestaccess'] == "private_room" && $scope.prvRoom == true)
      return property;
    if(property['guestaccess'] == "shared_room" && $scope.shRoom == true)
      return property; 
  }

  $scope.propertyGuestsFilter = function(property){

    if(property['noofguests'] < $scope.guestsFilter)
      return false;
    else 
      return true;
  }

/*$scope.customMapFilter = function()
{

  /*if() conditions for date range
    {
       if()//condition for apartment type
       {
          if() //condition for price range
          {
            return property;
          }
       }
    } 
=======
  var cityToPlot = [];
  $scope.markers = [];

  // Code to center the map on the selected city;

  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(25,80),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var geoCoder = new google.maps.Geocoder();
  var infoWindow = new google.maps.InfoWindow();

  geoCoder.geocode({'address': $scope.city}, function(results, status) {
    if (status === 'OK') {
      $scope.map.setCenter(results[0].geometry.location);}
  }); 

>>>>>>> Stashed changes

}*/
  /*
   |-----------------------------------------------------------
   | get properties in the given city
   |-----------------------------------------------------------
  */

  $http({
    method : "POST",
    url : '/properties',
    data : {
      city: $scope.city,
      page: 1
    }
  }).success(function(data) {
    if(data.statuscode == 0)
    {
      $scope.properties = data.data;
<<<<<<< Updated upstream
      $scope.property_max_price = Math.max.apply(Math,$scope.properties.map(function(property){return property.price;}));
      $scope.property_min_price = Math.min.apply(Math,$scope.properties.map(function(property){return property.price;}));
      console.log($scope.properties);
=======
      getCities($scope.properties);
>>>>>>> Stashed changes
    }
    else
    {
      $scope.noPropertiesFound = true;
    }
  }).error(function(error) {
      console.log("Internal Server error occurred");
  });



var createMarker = function (info){

console.log('here while marking the cities' + info.price);
var marker = new google.maps.Marker({
      map: $scope.map,
      position: new google.maps.LatLng(info.lat, info.lng),
      title: "$" + info.price.toString()
    });
  marker.content = '';
  google.maps.event.addListener(marker, 'click', function(){
          infoWindow.setContent('<h2>' + marker.title + '</h2>' + 
          marker.content);
          infoWindow.open($scope.map, marker);
      });
    $scope.markers.push(marker);
}  
    
$scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'idle');
}

var getCities = function(allProperties){

  var count = 0;
  
  for(count = 0; count < allProperties.length; count++){
    var city = {};
    var property = allProperties[count];
    var address = property['street'] + ", "+property['city'] + ", "+property['state'] +", "+ property['country'];
    console.log(address + property['price']);

    $http.get('http://maps.google.com/maps/api/geocode/json?address='+address+'&sensor=false').success(function(mapData) {
      angular.extend($scope, mapData);
      city = mapData.results[0].geometry.location;
      city['price'] = property.price;
      city['city'] = property;
      createMarker(city);
      count++;
    }); 
  }

}



// ////////////////////////////////////////////////////////////

  $scope.pageChanged = function(page){
    $http({
      method : "POST",
      url : '/properties',
      data : {
        city: $scope.city,
        page: page
      }
    }).success(function(data) {
      if(data.statuscode == 0)
      {
        $scope.properties = data.data;
        $scope.property_max_price = Math.max.apply(Math,$scope.properties.map(function(property){return property.price;}));
        $scope.property_min_price = Math.min.apply(Math,$scope.properties.map(function(property){return property.price;}));
        console.log($scope.properties); 
      }
      else
      {
        $scope.noPropertiesFound = true;
      }
    }).error(function(error) {
        console.log("Internal Server error occurred");
    });

  }



  $scope.transitionToProperty = function(propertyId){
    $scope.selectedProperty = [];
    for(var i=0; i<$scope.properties.length; i++) {
      if($scope.properties[i]._id == propertyId)
        $scope.selectedProperty = $scope.properties[i];
    }
    
    $state.go('home.property', {selectedProperty: $scope.selectedProperty});
  }

});
