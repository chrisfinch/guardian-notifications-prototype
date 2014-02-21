$.get(chrome.extension.getURL("panel.html"), function (data) {
	$('section.container').first().after(data);
});

var messages = {
	insert_single: function () {
		$.get(chrome.extension.getURL("single.html"), function (data) {
			$('#proto-panel').find("ul.collection").append(data);
		});	
	}
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    messages[request.message]();
});