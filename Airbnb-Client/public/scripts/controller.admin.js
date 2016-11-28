airbnbApp.controller('controllerAdmin',function($scope,$log,$http,$state,$stateParams){


	// TODO : make API call her to get all the data for ploting the graphs
	// and store it int the array. This is to be done after api is written.

	// This is bar chart


// Plot bar chart for property revenue
		$http({
			method : "POST",
			url : '/admin/top_properties'
		}).success(function(data) {
			console.log('Hey' + data.data[0]['prop_id']);

			var propData = data.data;
			var counter = 0;
			var props = [];
			var propsCosts = [];
			var propsColors = []			

			
			for(counter = 0; counter < propData.length; counter++ ){
				props.push(propData[counter]['prop_id']);
				propsCosts.push(propData[counter]['total']);
				propsColors.push('rgba(54, 162, 235, 0.2)');
			}

			var barChartData = {
				labels: props,
				datasets: [{
					label: 'Revenue/Year ($)',
					data: propsCosts,
					backgroundColor: propsColors,
					borderWidth: 0
				}]
			};

			var barChartElement = document.getElementById("admin-bar-chart");
			var barChart = new Chart(barChartElement, {
				type: 'bar',
				data: barChartData,
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero:true
							}
						}]
					}
				}
			});

		}).error(function(error) {
			return false;
		});

// Pie chart for city revenue

	
		$http({
			method : "POST",
			url : '/admin/top_cities'
		}).success(function(data) {
			console.log('Hey' + data.data[0]['prop_id']);

			var propData = data.data;
			var counter = 0;
			var city = [];
			var cityCosts = [];
			var allColors = ['#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56','#FFCE56'];
			var cityColors = [];
			
			for(counter = 0; counter < propData.length; counter++ ){
				city.push(propData[counter]['city']);
				cityCosts.push(propData[counter]['total']);
				cityColors.push(allColors[counter]);
			}

				pieChartData = {
				labels: city,
				datasets: [
				{
					data: cityCosts,
					borderWidth	:[0,0,0],
					backgroundColor: cityColors,
					hoverBackgroundColor: cityColors
				}]
			};
			
			var pieChartElement = document.getElementById('admin-pie-chart');
			var myPieChart = new Chart(pieChartElement,{
				type: 'doughnut',
				animation:{
		        animateScale:true
		    	},
				data: pieChartData,
				options: {
		     	   elements: {
		        	    arc: {
		            	    borderColor: "#000000"
		            	}
		       		 }
		    	}
			});

		}).error(function(error) {
			return false;
		});


// Plot bar chart for top host revenu

		$http({
			method : "POST",
			url : '/admin/top_hosts'
		}).success(function(data) {
			console.log('Hey' + data.data[0]['prop_id']);

			var propData = data.data;
			var counter = 0;
			var hosts = [];
			var hostsCosts = [];
			var hostsColors = []			

			
			for(counter = 0; counter < propData.length; counter++ ){
				hosts.push(propData[counter]['host_id']);
				hostsCosts.push(propData[counter]['total']);
				hostsColors.push('rgba(54, 162, 235, 0.2)');
			}

			var barChartData = {
				labels: hosts,
				datasets: [{
					label: 'Revenue/Year ($)',
					data: hostsCosts,
					backgroundColor: hostsColors,
					borderWidth: 0
				}]
			};

			var barChartElement = document.getElementById("admin-bar-chart-1");
			var barChart = new Chart(barChartElement, {
				type: 'bar',
				data: barChartData,
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero:true
							}
						}]
					}
				}
			});

		}).error(function(error) {
			return false;
		});





});