	$(function () {

		$("#add-rfm").on("click", function () {

			chrome.runtime.sendMessage({message: "add_recommended"}, function(response) {});

			$("#select-stories").attr("disabled", false).val(3).on("change", function (event) {
				event.preventDefault();

				chrome.runtime.sendMessage({message: "set_stories", num: this.value}, function() {
					return;
				});			

			});

		});

		$("#add-fbm").on("click", function () {

			chrome.runtime.sendMessage({message: "add_followed"}, function(response) {});

		});

		$("#add-ncb").on("click", function () {

			chrome.runtime.sendMessage({message: "add_notifications_big"}, function(response) {});

		});

	});