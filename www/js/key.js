
var key =
{
	key_2_button: function(key)
	{
		var button = {};

		for(var i=0; i<button_map.length; i++)
		{
			if(button_map[i].key == key)
			{
				button = JSON.parse(JSON.stringify(button_map[i])); //dictionary copy is surpisingly complicated!
			}
		}

		button.ui = {};
		if(button.record.start == true)
		{
			if(button.play.start == true)
			{
				button.ui.record_play = true;
			}
			else
			{
				button.ui.record = true;
			}
		}
		else
		{
			if(button.play.start == true)
			{
				button.ui.play = true;
			}
			else
			{
				if(	(button.record.stop == true) ||
					(button.play.stop == true) )
				{
					button.ui.stop = true;
				}
			}
		}

		//console.log("key_2_button: key:"+key+" button:"+JSON.stringify(button));

		return(button);
	},

	key_event: function(key)
	{
		media.button_event(key.key_2_button(key));
	},

	init: function()
	{
		key_events.init(this);
	},
};

