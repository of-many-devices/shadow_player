
var key =
{
	key_2_button: function(key_string)
	{
		var button = { key_string: "UNSUPPORTED", record: { start: false, stop: false, save: false, discard: false}, play: { start: false, stop: false, rewind: false, discard: false} };

		for(var i=0; i<button_map.length; i++)
		{
			if(button_map[i].key_string == key_string)
			{
				button = JSON.parse(JSON.stringify(button_map[i])); //dictionary copy is surprisingly complicated!
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

		console.log("key_2_button: key_string: "+key_string+" button:"+JSON.stringify(button));

		return(button);
	},

	key_event: function(key_string)
	{
		media.button_event(key.key_2_button(key_string));
	},

	init: function()
	{
		document.onkeydown = function(event)
		{
			event = event || window.event;

			if(event.keyCode >= 32 && event.keyCode <= 127)
			{
				var key_code_string = String.fromCharCode(event.keyCode);

				if(event.shiftKey)
				{
					key_code_string = "S+"+key_code_string;
				}
				if(event.ctrlKey)
				{
					key_code_string = "C+"+key_code_string;
				}

				key.key_event(key_code_string);
			}
		};

		//key_events.init(this);
	},
};

