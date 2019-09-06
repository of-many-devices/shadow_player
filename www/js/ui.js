var os_gap =
{
	check_permissions: function()
	{
		os_gap.permissions = cordova.plugins.permissions;

		os_gap.requested_permissions =	[
										os_gap.permissions.WRITE_EXTERNAL_STORAGE,
										os_gap.permissions.RECORD_AUDIO,
										os_gap.permissions.MODIFY_AUDIO_SETTINGS,
										os_gap.permissions.READ_PHONE_STATE
									];

		os_gap.permissions.checkPermission(os_gap.requested_permissions, os_gap.check_permissions_call_back, os_gap.permission_error);
	},

	check_permissions_call_back: function(status)
	{
		if( !status.hasPermission )
		{
			os_gap.permissions.requestPermissions(os_gap.requested_permissions, os_gap.request_permissions_call_back, os_gap.permission_error);
		}
	},

	request_permissions_call_back: function(status)
	{
		if( !status.hasPermission )
		{
			console.log("!!! PERMISSION REFUSAL, EXPECT DYSFUNCTION !!!");
		}
	},

	permission_error: function(error)
	{
		console.log("permission error: "+error);
	},
};

var ui =
{
	init: function()
	{
		document.addEventListener("deviceready", ui.on_device_ready, false);
	},

	on_device_ready: function()
	{
		os_gap.check_permissions();

		document.addEventListener("backbutton", ui.on_back_key_down, false);

		//initialise device dependant functionality
		media.init();

		document.getElementById("d_button_record").addEventListener("click",
			function(event)
			{
				media.button_event(key.key_2_button("C+3"));
			}.bind(this)
		);
		document.getElementById("d_button_record_play").addEventListener("click",
			function(event)
			{
				media.button_event(key.key_2_button("C+S"));
			}.bind(this)
		);
		document.getElementById("d_button_play").addEventListener("click",
			function(event)
			{
				media.button_event(key.key_2_button("6"));
			}.bind(this)
		);
		document.getElementById("d_button_stop").addEventListener("click",
			function(event)
			{
				media.button_event(key.key_2_button("S+G"));
			}.bind(this)
		);
		document.getElementById("d_button_exit").addEventListener("click",
			function(event)
			{
				media.button_event({ record: {}, play: {}, ui: { exit: true } });
			}.bind(this)
		);

		key.init();
	},

	button_down: function(button_id)
	{
		var element = document.getElementById("d_button_"+button_id);
		element.style.animation = "none";
		element.offsetHeight; /* trigger reflow */
		element.style.animation = null; 

		console.log("BUTTON: "+button_id);
	},

	on_back_key_down: function()
	{
	},

	indicator_recording_set: function(active)
	{
		document.getElementById("d_indicator_img_recording").className = (true === active) ? "indicator_recording_active" : "indicator_recording_inactive";
	},
	indicator_record_buffer_set: function(active)
	{
		document.getElementById("d_indicator_img_record_buffer").className = (true === active) ? "indicator_record_buffer_active" : "indicator_record_buffer_inactive";
	},
	indicator_playing_set: function(active)
	{
		document.getElementById("d_indicator_img_playing").className = (true === active) ? "indicator_playing_active" : "indicator_playing_inactive";
	},
	indicator_play_buffer_set: function(active)
	{
		document.getElementById("d_indicator_img_play_buffer").className = (true === active) ? "indicator_play_buffer_active" : "indicator_play_buffer_inactive";
	},
};

