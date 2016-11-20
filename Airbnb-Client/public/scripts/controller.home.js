
airbnbApp.controller('controllerHome',function($scope,$log,$http,$state,$stateParams){

	//Signup variables
	$scope.regfname="";
	$scope.reglname="";
	$scope.regpassword="";
	$scope.regemail="";
	$scope.regbday="";
	$scope.regtest="";
	//Invalid signup message holders
	$scope.invFname = "";
	$scope.invLname = "";
	$scope.invPaswd = "";
	$scope.invEmail = "";
	$scope.invBday = "";

	//Header scope variables
	$scope.default = true;
	$scope.signedin = false;
	$scope.signedhost = false;

	/*
	 |-----------------------------------------------------------
	 | Check for user session
	 |-----------------------------------------------------------
	*/
	$http({
		method : "POST",
		url : '/getusersession'
	}).success(function(data) {
		if(data.statuscode == 0) 
		{
			signedinhost = true;
			$scope.signedin = true;
			$scope.default = false;
		}
		else 
		{
			$scope.signedin = false;
			$scope.signedHost = false;
			$scope.default = true;
		}
	}).error(function(error) {
			console.log("Internal Server error occurred")
			$scope.signedin = false;
			$scope.signedHost = false;
			$scope.default = true;
	});



	//This function will called after submitting the signup form
	/*
	   |-----------------------------------------------------------
	   | User register
	   |-----------------------------------------------------------
	  */
	$scope.signup = function()
	{
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
					//$state.go('signin');
				}
				else
				{
					if(data.message != null)
					{
						$scope.invEmail = "";
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
    			if(data.user.ishost == true)
				{
					$scope.signedinhost = true;
					$scope.signedin = true;
					$scope.default = false;
					window.location = '/';
				}	
				else
				{
					$scope.signedin = true;
					$scope.signedhost = false;
					$scope.default = false;	
					window.location = '/';
				}		
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



})
