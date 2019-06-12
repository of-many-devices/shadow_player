
var ui =
{
	initialise_first: function()
	{
		document.addEventListener("deviceready", ui.on_device_ready, false);
	},

	initialise_last: function()
	{
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
				setTimeout(navigator.app.exitApp, 500);
			}.bind(this)
		);

		media.indicator_update();
		key.init();
	},

	on_device_ready: function()
	{
		document.addEventListener("backbutton", ui.on_back_key_down, false);

		//initialise device dependant functionality
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

