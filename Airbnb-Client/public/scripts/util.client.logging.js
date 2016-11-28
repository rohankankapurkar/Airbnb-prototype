$(document).ready(function()
	{
	    $(":button, a").click(function()
	    {
    		var viewURL = window.location.href;
			var clickid = this.id;
			console.log(clickid);
			var currentdate = new Date();

    		var datetime = currentdate.getDate() + "/"
            	    + (currentdate.getMonth()+1)  + "/"
                	+ currentdate.getFullYear() + " "
                	+ currentdate.getHours() + ":"
                	+ currentdate.getMinutes() + ":"
                	+ currentdate.getSeconds();

            $.post("/analytics/clicks",
    			    {
    			        url : viewURL,
    			        id : clickid,
    			        ts : datetime
    			    });
    	});
});
