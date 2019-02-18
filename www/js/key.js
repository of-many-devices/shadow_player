
var key =
{
	key_2_button: function(key)
	{
		var button = null;

		for(var i=0; i<button_map.length; i++)
		{
			if(button_map[i].key = key)
			{
				button = button_map[i];
			}
		}

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

