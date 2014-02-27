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
			callback(self.sync);
		},

		set_sync: function (req, callback) {
			console.log("set called", req);
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