	$(function () {
		console.log("I'm popup.js");
		$("#add-single").on("click", function () {

			chrome.runtime.sendMessage({message: "insert_single"}, function(response) {
			  console.log(response.farewell);
			});

		});
	});