
var media =
{
	record_state:		"stopped",
	record_position:	0,

	play_state:			"stopped",
	play_position:		0,

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
		}
		if(true === button.play.discard)
		{
		}
		if(true === button.record.save)
		{
		}
		if(true === button.record.discard)
		{
		}
		if(true === button.record.start)
		{
		}
		if(true === button.record.stop)
		{
		}
		if(true === button.play.start)
		{
		}
		if(true === button.play.stop)
		{
		}
	},
};

