	$(function () {

		chrome.runtime.sendMessage({message: "get_current_user", target: "background"}, function (user) {
			$("#select-user").val(user).on("change", function (event) {
				var newUser = event.target.value;
				chrome.runtime.sendMessage({message: "reset_content", target: "content"}, function (user) {});
				chrome.runtime.sendMessage({message: "set_current_user", target: "background", user: newUser}, function (user) {});
			});
		});


		$("#add-rfm").on("click", function () {

			chrome.runtime.sendMessage({message: "add_recommended", target: "content"}, function(response) {});

			$("#select-stories").attr("disabled", false).val(3).on("change", function (event) {
				event.preventDefault();

				chrome.runtime.sendMessage({message: "set_stories", num: this.value, target: "content"}, function() {
					return;
				});			

			});

		});

		$("#add-fbm").on("click", function () {

			chrome.runtime.sendMessage({message: "add_followed", target: "content"}, function(response) {});

		});

		$("#add-ncb").on("click", function () {

			chrome.runtime.sendMessage({message: "add_notifications_big", target: "content"}, function(response) {});

		});

		$("#breaking-news").on("click", function () {

			chrome.runtime.sendMessage({message: "add_breaking_news", target: "content"}, function(response) {});

		});

	});