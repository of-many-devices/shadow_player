var file_gap = 
{
	mv: function(old_path, new_path, next_function)
	{
		var new_path_directory = new_path.split("/").slice(0,-1).join("/");
		var new_path_file = new_path.split("/").slice(-1)[0];

		window.resolveLocalFileSystemURL(old_path, function (entry_old_path)
			{
				window.resolveLocalFileSystemURL(new_path_directory, function (entry_new_path_directory)
					{
						entry_old_path.moveTo(entry_new_path_directory, new_path_file, function ()
							{
								console.log("mv: success");
								next_function();
							}, function (error)
							{
								console.log("mv: ("+entry_old_path.name+" -> "+entry_new_path_directory.name+"/"+new_path_file+") error: " + error.code);
								next_function();
							});
					});
			}, function (error)
			{
				console.log("mv ("+old_path+") : error: " + error.code);
				next_function();
			});
	},
	
	rm: function(path, next_function)
	{
		window.resolveLocalFileSystemURL(path, function (entry)
			{
				entry.remove(function (file)
					{
						console.log("rm: success");
						next_function();
					}, function (error)
					{
						console.log("rm: error: " + error.code);
						next_function();
					});
			}, function (error)
			{
				console.log("rm ("+path+") : error: " + error.code);
				next_function();
			});
	},

	mkdir: function(path, next_function)
	{
		var parent_directory = path.split("/").slice(0,-1).join("/");
		var directory = path.split("/").slice(-1)[0];

		window.resolveLocalFileSystemURL(parent_directory, function (entry_parent_directory)
			{
				entry_parent_directory.getDirectory(directory, { create: true }, function (entry_directory)
					{
						console.log("mkdir: success");
						next_function();
					}, function (error)
					{
						console.log("mkdir: error: " + error.code);
						next_function();
					});
			}, function (error)
			{
				console.log("mkdir: error getting parent ("+parent_directory+") : " + error.code);
				next_function();
			});
	},

	which: function(path, next_function)
	{
		window.resolveLocalFileSystemURL(path, function (entry)
			{
				console.log("which: "+path+" -> "+entry.toURL());
				next_function();
			}, function (error)
			{
				console.log("which: ("+path+") error: "+error.code);
				next_function();
			});
	},
};

var media_file_root_dir = cordova.file.externalDataDirectory+"shadow_player";

var media =
{
	record_file:		media_file_root_dir + "/record.3gp",
	recorder:			null,
	record_state:		"stopped",
	record_buffer_exists: false,

	play_file:			media_file_root_dir + "/play.3gp",
	player:				null,
	play_state:			"stopped",
	play_buffer_exists: false,

	attach: function(media_file, media_cb_status)
	{
		var media_object = new Media(media_file, function()
			{
				media.plugin_cb_success();
			}, function(error)
			{
				media.plugin_cb_error(error);
			}, media_cb_status);

		return(media_object);
	},

	button_event: function(button)
	{
		console.log("button_event_1");

		if(true === button.record.save)
		{
			if(true == media.record_buffer_exists)
			{
				button.play.discard = true;
			}
			else
			{
				button.record.save = false;
				button.play.discard = false;
			}
		}
		if(true === button.play.discard)
		{
			button.play.rewind = true;
		}
		if(media.record_state == "stopped")
		{
			button.record.stop = false;
		}
		if(media.play_state == "stopped")
		{
			button.play.stop = false;
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
				media.exit();
				setTimeout(navigator.app.exitApp, 500);
			}
		}

		//detach
		if((true === button.record.discard) || (true === button.record.save))
		{
			console.log("media: record detach");
			if(media.record_state != "stopped")
			{
				media.recorder.stopRecord();
			}
			media.recorder.release();
		}
		if((true === button.play.discard) || (true === button.record.save))
		{
			console.log("media: play detach");
			if(media.play_state != "stopped")
			{
				media.player.stop();
			}
			media.player.release();
		}

		//mess with files:
		if((true === button.play.discard) || (true === button.record.save))
		{
			console.log("media: play delete");
			file_gap.rm(media.play_file, function()
				{
					if(true === button.record.save)
					{
						console.log("media: rename record->play");
						file_gap.mv(media.record_file, media.play_file, function()
							{
								media.record_buffer_exists = false;
								media.play_buffer_exists = true;
								media.button_event_2(button);
							});
					}
					else
					{
						media.play_buffer_exists = false;
						media.button_event_2(button);
					}
				});
		}
		else
		{
			media.button_event_2(button);
		}
	},
	
	button_event_2: function(button)
	{
		console.log("button_event_2");

		if(true === button.record.discard)
		{
			console.log("media: record delete");
			file_gap.rm(media.record_file, function()
				{
					media.record_buffer_exists = false;
					media.button_event_3(button);
				});
		}
		else
		{
			media.button_event_3(button);
		}
	},
	
	button_event_3: function(button)
	{
		console.log("button_event_3");

		//re-attach
		if((true === button.record.discard) || (true === button.record.save))
		{
			console.log("media: record attach");
			media.recorder = media.attach(media.record_file, media.plugin_cb_record_status);
		}

		if((true === button.play.discard) || (true === button.record.save))
		{
			console.log("media: play attach");
			media.player = media.attach(media.play_file, media.plugin_cb_play_status);
		}

		if(true === button.play.rewind)
		{
			console.log("media: play rewind");
			media.player.seekTo(0);
		}
		if(true === button.record.start)
		{
			console.log("media: record start");
			media.recorder.startRecord();

			media.record_buffer_exists = true;
		}
		if(true === button.record.stop)
		{
			console.log("media: record stop");
			media.recorder.stopRecord();
		}
		if(true === button.play.start)
		{
			console.log("media: play start");
			media.player.play();
		}
		if(true === button.play.stop)
		{
			console.log("media: play stop");
			media.player.stop();
		}

		media.indicator_update();
	},


	plugin_cb_success: function()
	{
		console.log("cordova-plugin-media callback success");
	},

	plugin_cb_error: function(error)
	{
		console.log("cordova-plugin-media callback error: "+error.code);
	},

	plugin_cb_play_status: function(status)
	{
		console.log("cordova-plugin-media callback play status: "+status);

		if(status == Media.MEDIA_NONE)
		{
		}
		if(status == Media.MEDIA_STARTING)
		{
		}
		if(status == Media.MEDIA_RUNNING)
		{
			console.log("play RUNNING");
			media.play_state = "started";
		}
		if(status == Media.MEDIA_PAUSED)
		{
		}
		if(status == Media.MEDIA_STOPPED)
		{
			console.log("play STOPPED");
			media.play_state = "stopped";
			media.player.seekTo(0);
		}

		media.indicator_update();
	},

	plugin_cb_record_status: function(status)
	{
		console.log("cordova-plugin-media callback record status: "+status);

		if(status == Media.MEDIA_NONE)
		{
		}
		if(status == Media.MEDIA_STARTING)
		{
		}
		if(status == Media.MEDIA_RUNNING)
		{
			console.log("record RUNNING");
			media.record_state = "started";
		}
		if(status == Media.MEDIA_PAUSED)
		{
		}
		if(status == Media.MEDIA_STOPPED)
		{
			console.log("record STOPPED");
			media.record_state = "stopped";
		}

		media.indicator_update();
	},
	
	indicator_update: function()
	{
		ui.indicator_recording_set("started" == media.record_state);
		ui.indicator_playing_set("started" == media.play_state);
		ui.indicator_record_buffer_set(true == media.record_buffer_exists);
		ui.indicator_play_buffer_set(true == media.play_buffer_exists);
	},

	init: function()
	{
		file_gap.which(media.record_file, function(){});
		file_gap.which(media.play_file, function(){});
		file_gap.which(media_file_root_dir, function(){});

		file_gap.mkdir(media_file_root_dir, function()
			{

				media.record_buffer_exists = false;
				window.resolveLocalFileSystemURL(media.record_file, function (entry)
					{
						media.record_buffer_exists = true;
						media.indicator_update();
					});

				media.play_buffer_exists = false;
				window.resolveLocalFileSystemURL(media.play_file, function (entry)
					{
						media.play_buffer_exists = true;
						media.indicator_update();
					});

				console.log("media: record attach (init)");
				media.recorder = media.attach(media.record_file, media.plugin_cb_record_status);

				console.log("media: play attach (init)");
				media.player = media.attach(media.play_file, media.plugin_cb_play_status);

				var get_duration_counter = 0;
				var get_duration_timer = setInterval(function()
					{
						get_duration_counter = get_duration_counter + 100;
						if (get_duration_counter > 2000)
						{
							console.log("media: get duration (record) timeout");
							clearInterval(get_duration_timer);
						}

						var duration = media.recorder.getDuration();
						if(duration > 0)
						{
							console.log("media: record duration = "+duration);
							media.recorder.seekTo(duration*1000);
							clearInterval(get_duration_timer);
						}
					}, 100);

				media.indicator_update();
			});
	},
	
	exit: function()
	{
		console.log("media: record detach (exit)");
		if(media.record_state != "stopped")
		{
			media.recorder.stopRecord();
		}
		media.recorder.release();

		console.log("media: play detach (exit)");
		if(media.play_state != "stopped")
		{
			media.player.stop();
		}
		media.player.release();

		console.log("audio resources released");
	},
};

