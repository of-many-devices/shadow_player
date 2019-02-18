var app =
{
	// Application Constructor
	initialize: function()
	{
		document.addEventListener('deviceready', app.on_device_ready, false);
		//window.setTimeout(app.onDeviceReady, 1);
	},

	on_device_ready: function()
	{
		if(window.localStorage.getItem("app_run") != "true")
		{
			window.localStorage.setItem("app_run", "true");
			app.reset();
		}

		window.location.replace("./ui.html");
	},

	reset: function()
	{
	},
};

app.initialize();
