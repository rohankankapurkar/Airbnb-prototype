airbnbApp.controller('controllerProperties',function($scope,$http,$state,$stateParams){

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
  $scope.property_max_price = 200;
  $scope.property_min_price = 0;
  $scope.markers = [];
  var infoWindow = new google.maps.InfoWindow();


  $scope.propertyPriceRangeFilter = function(property) {
    return (parseInt(property['price']) <= $scope.property_max_price);
  };
  
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
      $scope.property_max_price = Math.max.apply(Math,$scope.properties.map(function(property){return property.price;}));
      


      // Map initialization  
      var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng($scope.properties[0].lat, $scope.properties[0].lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      $scope.markers = [];


      console.log("==============");
      console.log($scope.properties);


      var info = [];
      var counter = 0;
      for(counter  =0; counter < $scope.properties.length; counter++){
        createMarker($scope.properties[counter].lat, $scope.properties[counter].lng,$scope.properties[counter].street+$scope.properties[counter].city, $scope.properties[counter].price,$scope.properties[counter].images[0]);
      }
    }
    else
    {
      $scope.noPropertiesFound = true;
    }
  }).error(function(error) {
    console.log("Internal Server error occurred");
  });


  var createMarker = function(lat, lng, address, price,img){


        var marker = new google.maps.Marker({
          map: $scope.map,
          position: new google.maps.LatLng(lat, lng),
          title: "$" + price.toString()+ "/ night" ,
          icon: "http://ruralshores.com/assets/marker-icon.png",
           
        });

        marker.content = '<div class="infoWindowContent">'+ address +' </div>';
        google.maps.event.addListener(marker, 'mouseover', function(){
          infoWindow.setContent('<h4>' + marker.title + '</h4>' + 
            marker.content + '<img width = 180px length = "150px "src = "'+img+'"/>' );
          infoWindow.open($scope.map, marker);
        });

        google.maps.event.addListener(marker, 'mouseout', function(){
          infoWindow.close($scope.map, marker);
        });

        $scope.markers.push(marker);
  }


  $scope.openInfoWindow = function(e, selectedMarker){
    e.preventDefault();
    google.maps.event.trigger(selectedMarker, 'click');
  }


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
        //$scope.property_max_price = Math.max.apply(Math,$scope.properties.map(function(property){return property.price;}));
        //$scope.property_min_price = Math.min.apply(Math,$scope.properties.map(function(property){return property.price;}));
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
    
    $scope.logPropertyClick($scope.selectedProperty.title, $scope.selectedProperty.city, $scope.selectedProperty.hostdata[0].username);
    $state.go('home.property', {selectedProperty: $scope.selectedProperty});
  }



  $scope.logPropertyClick = function(title,city,hostname){

    console.log(hostname);
    $http({
      method : 'POST',
      url : '/analytics/property/clicks',
      data : {
        property : title,
        city : city,
        hostname : hostname
      }

    }).success(function(data){


    }).error(function(error){

    })

  }


});
