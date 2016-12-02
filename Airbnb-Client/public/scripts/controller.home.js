
airbnbApp.controller('controllerHome',function($scope,$log,$http,$state,$stateParams){

	//Signup variables
	$scope.regfname="";
	$scope.reglname="";
	$scope.regpassword="";
	$scope.regemail="";
	$scope.regbday="";
	$scope.regtest="";
	$scope.regsuccess="";
	//Invalid signup message holders
	$scope.invFname = "";
	$scope.invLname = "";
	$scope.invPaswd = "";
	$scope.invEmail = "";
	$scope.invBday = "";
	$scope.invLogin = "";

	//Header scope variables
	$scope.default = true;
	$scope.signedin = false;
	$scope.signedhost = false;
	$scope.admin = false;

	//city search module
	$scope.resultCities = '';
  $scope.cityOptions = null;
  $scope.cityDetails = '';

	/*
	 |-----------------------------------------------------------
	 | Check for user session
	 |-----------------------------------------------------------
	*/
	if(!$scope.session)
	{
		$http({
			method : "POST",
			url : '/getusersession'
		}).success(function(data) {

			if(data.statuscode == 0)
			{
				$scope.session = true;
				if(data.credentials.isadmin == true)
				{

					$scope.admin = true;
    				$scope.signedin = false;
					$scope.default = false;
					$scope.signedinhost = false;
					$state.go('home.admin');
				}
				else
				{
					if(data.credentials.ishost == true)
					{
						$scope.signedin = false;
						$scope.signedhost = true;
						$scope.admin = false;
						$scope.default = false;
					}
					else
					{
						$scope.signedhost = false;
						$scope.signedin = true;
						$scope.default = false;
						$scope.admin = false;
					}
				}
			}
			else
			{
				$scope.signedin = false;
				$scope.signedhost = false;
				$scope.admin = false;
				$scope.default = true;
			}
		}).error(function(error) {
			console.log("Internal Server error occurred")
			$scope.signedin = false;
			$scope.signedhost = false;
			$scope.default = true;
		});	
	}




	//This function will called after submitting the signup form
	/*
	   |-----------------------------------------------------------
	   | User register
	   |-----------------------------------------------------------
	  */
	$scope.signup = function()
	{
		$scope.clearInvSignUpMessages();

		if(!$scope.applyValidations())
		{
			$http({
				method : "POST",
				url : '/user/register',
				data : {
					"username" : $scope.regemail,
					"password" : $scope.regpassword,
					"firstname" : $scope.regfname,
					"lastname" : $scope.reglname,
					"birthday" : $scope.regbday
				}
			}).success(function(data){
				if (data.statuscode == 0)
				{
					$scope.regsuccess = "Successfully Registered. Please Log In"
					$scope.regemail = "";
					$scope.regfname = "";
					$scope.reglname = "";
					$scope.regbday = "";
					$scope.regpassword = "";
				}
				else
				{
					if(data.message != null)
					{
						$scope.invEmail = "";
						$scope.invFname = "";
						$scope.invLname = "";
						$scope.invPaswd = "";
						$scope.invBday = "";
						$scope.invEmail = data.message;
					}
				}
			}).error(function(error) {
				console.log("error");
			});
		}
		else
		{
			console.log("Error in submitted values");
		}
	}

	//Function for clearing up the invalid input messages showed after sign up
	/*
	   |-----------------------------------------------------------
	   | Clear Invalid Input Messages
	   |-----------------------------------------------------------
	  */
	$scope.clearInvSignUpMessages = function(){
		$scope.invFname = "";
		$scope.invLname = "";
		$scope.invPaswd = "";
		$scope.invemail = "";
		$scope.invBday = "";
		$scope.regsuccess = "";
	}

	//Function applies validations to the input values submitted by the user upon sign up
	/*
	   |-----------------------------------------------------------
	   | Apply Validations
	   |-----------------------------------------------------------
	  */
	$scope.applyValidations = function(){

		var validationsFlag = false;
		var fnameValidation = "";
		var lnameValidation ="";

		if($scope.regfname  != "")
			fnameValidation = $scope.regfname.match(/\d+/g);
		if($scope.reglname != "")
			lnameValidation = $scope.reglname.match(/\d+/g);

		if(fnameValidation != null && lnameValidation == null)
		{
			$scope.invFname = "Invalid First Name";
			validationsFlag = true;
		}
		else if(fnameValidation == null && lnameValidation != null)
		{
			$scope.invLname = "Invalid Last Name";
			validationsFlag = true;
		}
		else if(fnameValidation != null && lnameValidation != null)
		{
			$scope.invLname = "First Name & Last Name Invalid";
			validationsFlag = true;
		}

		if($scope.regpassword.length < 8)
		{
			$scope.invPaswd = "Password should have 8 or more characters";
			validationsFlag = true;
		}

		var bday = new Date($scope.regbday);
		var currdate = new Date();
		if(bday > currdate)
		{
			invBday = "Incorrect Birthday";
			validationsFlag = true;
		}
		return validationsFlag;
	}

	//Function for sign in
	/*
   |-----------------------------------------------------------
   | User signin
   |-----------------------------------------------------------
  */
  $scope.signin = function()
  {
	    $http({
      		method : "POST",
      		url : '/user/signin',
      		data : {
        		"username": $scope.email,
        		"password": $scope.password
      		}
    	}).success(function(data)
    	{
    	  	if(data.statuscode == 0)
    		{
    			window.location = "/";
    		}
    		else
    		{
    			$scope.invLogin = "Invalid Username or Password";
    		}

    	}).error(function(error)
    	{
			alert("Internal sever error occured");
			window.setTimeout(function()
			{
				window.location = '/';
			}, 3000);

    	});
  	};


  	//Function for sign in
	/*
   |-----------------------------------------------------------
   | User Logout
   |-----------------------------------------------------------
  */
  $scope.logout = function()
  {
	    $http({
      		method : "POST",
      		url : '/user/logout'
    	}).success(function(data)
    	{
    		$scope.session = false;
    	  	if(data.statuscode == 0)
    		{

    			$scope.signedin = false;
				$scope.signedhost = false;
				$scope.default = true;
				window.location = '/';
    		}
    		else
    		{
    			$scope.signedin = false;
				$scope.signedhost = false;
				$scope.default = true;
				window.location = '/';
    		}

    	}).error(function(error)
    	{
			alert("Internal sever error occured");
			window.setTimeout(function()
			{
				window.location = '/';
			}, 3000);

    	});
  	};

  	//Function for making the transition to
	/*
   |-----------------------------------------------------------
   | Transition to Properties
   |-----------------------------------------------------------
  */
  $scope.transitToProperties = function(city){
  	console.log("In transition to cities");
		if(city.indexOf(',') > -1)
			var getCityName = city.substring(0, city.indexOf(','));
		else
			var getCityName = city;
  	$state.go('home.properties',{city : getCityName})
  }

	$scope.getHosts = function()
	{
		$http({
			method : "POST",
			url : '/admin/searchHosts',
			data :{
				area : $scope.area,
			}
		}).success(function(data)
		{
			$scope.Hosts = data.data;
			$state.go('home.getHosts',{Hosts : $scope.Hosts});
			console.log("Success");

		})
			.error(function(data){
				console.log("Error")
			})

	}

	$scope.viewHostDetails =function (host)
	{
		var hostid= host.id;
		var properties =[];
		for(var i=0; i<$scope.Hosts.resultProperties.length; i++)
		{
			if($scope.Hosts.resultProperties[i].host_id == hostid)
			{
				properties.push($scope.Hosts.resultProperties[i]);

			}
		}
		var hostdetails = {
			hostdata : host,
			propertydata : properties
		}
		$state.go('home.hostdetails',{Hostdetail : hostdetails});
	}


})
