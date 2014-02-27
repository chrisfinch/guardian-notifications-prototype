var config = {
	user: "none"
};

var backgroundTasks = (function () {
	
	var self = this;

	return {
		get_current_user: function (request, callback) {
			callback(config.user);
		},

		set_current_user: function (request, callback) {
			config.user = request.user;
			callback(config.user);
		}

	}
})();


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  	if (request.target === "background") {
  		console.log("recieving req");
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