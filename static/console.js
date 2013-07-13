var $console = (function() {

var $ = jQuery;

var $console_screen = $("#console-screen");
var $console = $("#console");
var $caret  = $("#caret");

// Keyboard Handler ------------------------------------------------------------

var key_handlers = [];

var special_keys = {
	"8":   "BACKSPACE",
	"9":   "TAB",
	"13":  "ENTER",
	"27":  "ESC",
	"32":  "SPACE",
	"33":  "PAGEUP",
	"34":  "PAGEDOWN",
	"35":  "END",
	"36":  "HOME",
	"37":  "LEFT",
	"38":  "UP",
	"39":  "RIGHT",
	"40":  "DOWN",
	"45":  "INSERT",
	"46":  "DELETE",
	"112": "F1",
	"113": "F2",
	"114": "F3",
	"115": "F4",
	"116": "F5",
	"117": "F6",
	"118": "F7",
	"119": "F8",
	"120": "F9",
	"121": "F10",
	"122": "F11",
	"123": "F12",
};

function handle_keyboard(e) {
	var special = false;
	var event   = false;
	
	switch(e.type) {
		case "keydown":
			special = true;
			var key = special_keys[e.keyCode];
			if(key) {
				if(key == "SPACE") {
					event = {
						spec: false,
						key:  " "
					};
				} else {
					event = {
						spec: true,
						key:  key
					};
				}
			} else {
				if(e.ctrlKey != e.altKey) {
					return false;
				} else {
					return;
				}
			}
			
			break;
		
		case "keypress":
			if(e.which && e.charCode && e.charCode != 32) {
				event = {
					spec: false,
					key:  String.fromCharCode(e.charCode)
				};
			} else {
				return false;
			}
			
			break;
			
		default:
			throw "Unknow key event: " + e.type;
	}
	
	if(!event) {
		return;
	}
	
	key_handlers.forEach(function(handler) {
		try {
			handler(event);
		} catch(e) {
			setTimeout(function() {
				throw e;
			}, 0);
		}
	});
	
	return false;
}

$(document).keydown(handle_keyboard).keypress(handle_keyboard);

function register_key_handler(handler) {
	if(typeof handler != "function") {
		return;
	}
	
	key_handlers.push(handler);
}

function unregister_key_handler(handler) {
	if(typeof handler != "function") {
		return;
	}
	
	key_handlers = key_handlers.filter(function(l) {
		return l != handler;
	});
}

// Display ---------------------------------------------------------------------

var $escape_dummy = $("<span>");

function console_normalize() {
	$console[0].normalize();
}

function console_scroll() {
	$console_screen.scrollTop($console.height());
}

function console_write(text, rich) {
	if(typeof text == "string" && !rich) {
		text = $escape_dummy.text(text).html().replace(" ", "&nbsp;");
	}
	
	$console.append(text);
	
	console_normalize();
	console_scroll();
}

function console_clear() {
	$console.empty();
}

function console_caret(show) {
	if(show) {
		$caret.show();
	} else {
		$caret.hide();
	}
}

// Commands --------------------------------------------------------------------

function commands_api() {}

var readline_running = false;

// 
commands_api.prototype = {
	async: function() {
		if(this._returned) {
			return;
		}
		
		this._async = true;
		var args = Array.prototype.slice.call(arguments);
		
		var fn = args.shift();
		if(typeof fn != "function") {
			return;
		}
		
		if(args.length > 0) {
			var cb = args.pop();
			if(typeof cb != "function") {
				args.push(cb);
				cb = false;
			}
		}
		
		var self = this;
		
		setTimeout(function() {
			try {
				var ret = fn.apply(self, args);
				if(cb) {
					setTimeout(function() {
						console.log("called");
						cb.call(self, null, ret);
					}, 0);
				}
			} catch(e) {
				if(cb) {
					setTimeout(function() {
						cb.call(self, e);
					}, 0);
				} else {
					self.error(e);
				}
			}
		}, 0);
	},
	
	print: function(out, rich) {
		if(this._returned) {
			return;
		}
		
		console_write(out + "\n", rich);
	},
	
	write: function(out, rich) {
		if(this._returned) {
			return;
		}
		
		console_write(out, rich);
	},
	
	clear: function() {
		if(this._returned) {
			return;
		}
		
		console_clear();
	},
	
	registerInterrupt: function(handler) {
		if(this._returned) {
			return;
		}
		
		if(typeof handler == "function") {
			if(this._ihandlers.some(function(h) { return h == handler; })) {
				return;
			}
			
			this._ihandlers.push(handler);
		}
	},
	
	unregisterInterrupt: function(handler) {
		if(this._returned) {
			return;
		}
		
		this._ihandlers = this._ihandlers.filter(function(h) {
			return h != handler;
		});
	},
	
	pushKeyHandler: function(handler) {
		if(this._returned) {
			return;
		}
		
		var old_handler = this.onKey;
		if(typeof old_handler == "function") {
			this._keyHandlersStack.push(old_handler);
		}
		
		this.onKey = handler.bind(this);
	},
	
	popKeyHandler: function() {
		if(this._returned) {
			return;
		}
		
		var old_handler = this._keyHandlersStack.pop();
		if(typeof old_handler == "function") {
			this.onKey = old_handler;
		}
	},
	
	readline: function(opts, cb) {
		if(this._returned) {
			return;
		}
		
		if(readline_running) {
			throw new Error("Readline is already running");
		} else {
			readline_running = true;
		}
		
		this._async = true;
		
		if(typeof cb != "function" && typeof opts == "function") {
			cb = opts;
			opts = {};
		}
		
		if(typeof opts != "object") {
			opts = {};
		}
		
		var $buffer = $("<span>");
		var $caret = $("<span>").data({caret: true}).html(" ").css({ background: "green" });
		
		$buffer.append($caret);
		
		console_caret(false);
		console_write($buffer);
		
		function new_caret() {
			$caret = $("<span>").data({caret: true}).html(" ").css({ background: "green" });
			$buffer.append($caret);
		}
		
		var history_idx = opts.history ? opts.history.length : false;
		
		var self = this;
		
		function cleanup() {
			self.popKeyHandler();
			$buffer.remove();
			console_caret(true);
			readline_running = false;
		}
		
		this.registerInterrupt(cleanup);
		
		this.pushKeyHandler(function(e) {
			if(e.spec) {
				switch(e.key) {
					case "BACKSPACE":
						$caret.prev().remove();
						break;
					
					case "DELETE":
						var $next = $caret.next();
						if($next.length && !$caret.data("caret")) {
							$caret.remove();
							$caret = $next.css({ background: "green" });
						}
						break;
					
					case "LEFT":
						var $prev = $caret.prev();
						if($prev.length) {
							$caret.css({ background: "" });
							$caret = $prev.css({ background: "green" });
						}
						break;
					
					case "RIGHT":
						var $next = $caret.next();
						if($next.length) {
							$caret.css({ background: "" });
							$caret = $next.css({ background: "green" });
						}
						break;
					
					case "UP":
						if(opts.history) {
							if(history_idx <= 0) {
								break;
							}
							history_idx--;
							$buffer.empty();
							opts.history[history_idx].split("").forEach(function(c) {
								$buffer.append($("<span>").html(c));
							});
							new_caret();
						}
						break;
						
					case "DOWN":
						if(opts.history) {
							if(history_idx >= opts.history.length) {
								break;
							}
							history_idx++;
							$buffer.empty();
							if(opts.history[history_idx]) {
								opts.history[history_idx].split("").forEach(function(c) {
									$buffer.append($("<span>").html(c));
								});
							}
							new_caret();
						}
						break;
					
					case "ENTER":
						var text = [];
						$buffer.children().each(function(i, e) {
							var $e = $(e);
							if(!$e.data("caret")) {
								var c = $e.html();
								
								if(c.length > 1) {
									if(c == "&nbsp;") {
										c = " ";
									} else {
										c = $escape_dummy.html(c).text();
									}
								}
								
								text.push(c)
							}
						});
						
						cleanup();
						
						text = text.join("");
						console_write(text + "\n");
						
						this.async(cb, text);
						break;
				}
			} else {
				var $char = $("<span>");
				
				if(e.key == " ") {
					$char.html("&nbsp;");
				} else {
					$char.text(e.key);
				}
				
				$caret.before($char);
			}
		});
	},
	
	run: function(cmd, args, cb) {
		if(this._returned) {
			return;
		}
		
		run_command(cmd, args, cb.bind(this));
	},
	
	call: function(c, ca, cb) {
		if(this._returned) {
			return;
		}
		
		this._async = true;
		var self = this;
		
		$.ajax({
			type: "POST",
			url: "/console_api.php",
			data: { c: c, ca: ca },
			success: function(data) {
				if(data.error) {
					self.async(cb, new Error(data.error));
				} else {
					self.async(cb, null, data);
				}
			},
			error: function(e) {
				self.async(cb, e);
			},
			dataType: "json"
		});
	}
}

var commands = {};
var command_stack = [];

// Starts a command
function run_command(name, args, callback) {
	if(!Array.isArray(args)) {
		args = [];
	}
	
	var cmd = commands[name];
	
	if(!cmd) {
		return callback(new Error("Unknown command '" + name + "'"))
	}
	
	if(typeof callback != "function") {
		callback = false;
	}
	
	var env = cmd.env = new commands_api();
	
	env._returned         = false;
	env._async            = false;
	env._keyHandlersStack = [];
	env._ihandlers        = [];

	env.done = function(retval) {
		if(this._returned) {
			return;
		} else {
			this._returned = true;
		}
		
		command_stack.pop();
		callback(null, retval);
	};
	
	env.error = function(e) {
		if(this._returned) {
			return;
		} else {
			this._returned = true;
		}
		
		command_stack.pop();
		callback(e);
	};
	
	command_stack.push({name: cmd.name, env: env});
	
	try {
		var ret = cmd.fn.apply(env, args);
		if(!env._async) {
			env.done(ret);
		}
	} catch(e) {
		env.error(e);
	}
}

// Returns the currently running command
function running_command() {
	return command_stack[command_stack.length - 1];
}

// Handle global key dispatching
function global_key_dispatcher(e) {
	var cmd = running_command();
	
	// Specials system-wide handlers
	if(e.spec) {
		switch(e.key) {
			// ESC exits the running command
			case "ESC":
				if(cmd.name == "sh") {
					return;
				}
				
				// Call interrupts handlers
				cmd.env._ihandlers.forEach(function(h) {
					h.call(cmd.env);
				});
				
				// Force-return the command
				cmd.env.error(new Error("Interrupted"));
				
				return;
		}
	}

	// Forward to the running command handler
	var handler = cmd.env.onKey;
	if(typeof cmd.env.onKey == "function") {
		cmd.env.async(handler, e);
	}
}

register_key_handler(global_key_dispatcher);

// Init ------------------------------------------------------------------------

var init_done = false;

function init_console() {
	if(init_done) {
		return;
	}
	
	init_done = true;
	
	console_write("BlowTools Officier Console\n");
	
	run_command("sh", null, function(err, ret) {
		console_write("\n\nThe shell exited unexpectedly !\n");
		console_caret(false);
		if(err) {
			console_write(err.stack);
		}
	})
}

// Console API -----------------------------------------------------------------

return {
	init: function() {
		return init_console();
	},
	
	createCommand: function(name, fn) {
		commands[name] = {fn: fn, name: name};
	}
};

})();

// Commands --------------------------------------------------------------------

// Shell
$console.createCommand("sh", function() {
	var history = [];
	
	this.prompt = function() {
		this.write("[" + $bt_shell.user + "@blow]$ ");
		
		this.readline({ history: history }, function(line) {
			history.push(line);
			
			if(history.length > 20) {
				history.shift();
			}
			
			var args = (line.match(/"(\\.|[^"])*?"|(\\.|[^\s])+/g) || []).map(function(arg) {
				if(arg[0] == '"' && arg[arg.length - 1] == '"') {
					arg = arg.slice(1, -1);
				}
				
				return arg.replace(/\\(.)/, "$1");
			});
			
			if(args.length) {
				var cmd = args.shift();
				switch(cmd) {
					case "sh":
						// Shell nesting is useless, making this a noop
						break;
						
					default:
						this.run(cmd, args, function(err, ret) {
							if(err) {
								this.print("<span style='color:red'>"+ err + "</span>", true);
							}
							
							this.prompt();
						});
						
						// Don't prompt, run is async
						return;
				};
			}
			
			this.prompt();
		});
	}

	this.prompt();
});

$console.createCommand("date", function() {
	this.print(new Date);
});

$console.createCommand("whoami", function() {
	this.print($bt_shell.user);
});

$console.createCommand("clear", function() {
	this.clear();
});

$console.createCommand("ping", function() {
	var i = 0;
	var res = [];

	this.ping = function() {
		if(++i > 5) {
			var min = res.reduce(function(a, b) { return a < b ? a : b }, Infinity);
			var max = res.reduce(function(a, b) { return a > b ? a : b }, 0);
			var avg = res.reduce(function(a, b) { return [((a[0] * a[1]) + b) / (a[1] + 1), a[1] + 1]; }, [0, 0])[0];
			var med = res.sort()[(res.length / 2) | 0];
			
			this.print("Minimum = " + min + "ms, Maximum = " + max + "ms, Average = " + avg + "ms");
			return this.done();
		}
		
		var start = new Date().getTime();
		this.call("ping", null, function(e) {
			if(e) {
				this.error(e);
			} else {
				var time = (new Date().getTime()) - start;
				res.push(time);
				this.print("Reply from server: time = " + time + "ms");
				this.ping();
			}
		});
	};
	
	this.ping();
});

$console.createCommand("event", function(arg) {
	this.print(arg);
});

$console.createCommand("rl", function() {
	location.reload();
	this.async();
});

$console.init();
