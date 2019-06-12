
var media =
{
	record_state:		"stopped",
	record_position:	0,
	record_buffer_exists: false,

	play_state:			"stopped",
	play_position:		0,
	play_buffer_exists: false,

	button_event: function(button)
	{
		if(true === button.record.save)
		{
			if(0 != media.record_position)
			{
				button.play.discard = true;
			}
			else
			{
				button.record.save = false;
			}
		}
		if(true === button.play.discard)
		{
			button.play.rewind = true;
		}
		if(this.record_state == "stopped")
		{
			button.record.stop = false;
		}
		else
		{
			button.record.start = false;
		}
		if(this.play_state == "stopped")
		{
			button.play.stop = false;
		}
		else
		{
			button.play.start = false;
		}


		if(undefined !== button.ui)
		{
			if(true === button.ui.record)
			{
				ui.button_down("record");
			}
			if(true === button.ui.play)
			{
				ui.button_down("play");
			}
			if(true === button.ui.record_play)
			{
				ui.button_down("record_play");
			}
			if(true === button.ui.stop)
			{
				ui.button_down("stop");
			}
			if(true === button.ui.exit)
			{
				ui.button_down("exit");
			}
		}


		if(true === button.play.rewind)
		{
			console.log("media: play rewind");
		}
		if(true === button.play.discard)
		{
			console.log("media: play discard");

			this.play_buffer_exists = false;
		}
		if(true === button.record.save)
		{
			console.log("media: record save");

			this.play_buffer_exists = true;
		}
		if(true === button.record.discard)
		{
			console.log("media: record discard");

			this.record_buffer_exists = false;
		}
		if(true === button.record.start)
		{
			console.log("media: record start");

			this.record_state = "started";
			this.record_buffer_exists = true;
		}
		if(true === button.record.stop)
		{
			console.log("media: record stop");

			this.record_state = "stopped";
		}
		if(true === button.play.start)
		{
			console.log("media: play start");

			this.play_state = "started";
		}
		if(true === button.play.stop)
		{
			console.log("media: play stop");

			this.play_state = "stopped";
		}

		this.indicator_update();
	},

	indicator_update: function()
	{
		ui.indicator_recording_set("started" == this.record_state);
		ui.indicator_playing_set("started" == this.play_state);
		ui.indicator_record_buffer_set(true == this.record_buffer_exists);
		ui.indicator_play_buffer_set(true == this.play_buffer_exists);
	},
};

