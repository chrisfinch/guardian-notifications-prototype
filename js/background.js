var config = {
	user: "none"
};

var backgroundTasks = (function () {
	
	var self = this;

	return {
		get_current_user: function (req, callback) {
			callback(config.user);
		},

		set_current_user: function (req, callback) {
			config.user = req.user;
			callback(config.user);
		},

		get_sync: function (req, callback) {
			callback({state: self.sync, user: config.user});
		},

		set_sync: function (req, callback) {
			self.sync = req.sync;
		}

	}
})();


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  	if (request.target === "background") {
  		backgroundTasks[request.message](request, sendResponse);
  	} else {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  request.config = config;
		  chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
		  	sendResponse(response);
		  });
		});
  	}

});

var breakingTimer = (function () {
	var delay = (1000 * 60) * 10;
	var timer = setTimeout(function () {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  var request = {
		  	config: config,
		  	message: "add_breaking_news"
		  };
		  chrome.tabs.sendMessage(tabs[0].id, request, function (response) {});
		});		
	}, delay);
})();