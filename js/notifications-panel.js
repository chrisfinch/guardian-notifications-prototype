var notificationsPrototype = function () {
	
	var self = this;

	var helpers = {
		scrollTo: function ($el) {
			$('html, body').animate({
	            scrollTop: $el.offset().top + 'px'
	        });
		}
	}

	return {
		insert_single: function () {
			var $cont = self.$rfm.find("ul.collection");
			var el = Math.floor((Math.random()*$cont.find("li").length));
			var $el = $cont.find("li").eq(el).clone();
			$cont.append($el);
		},

		set_stories: function (request) {
			var n = request.num;
			var $cont = self.$rfm.find("ul.collection");
			var $lis = $cont.find("li");
			
			if ($lis.length > n) {
				while ($lis.length > n) {
					$lis.last().remove();
					$lis = $cont.find("li");
				}
			} else {
				$.get(chrome.extension.getURL("/html/single.html"), function (data) {
					var $li = $(data);
					while ($lis.length < n) {
						$cont.append($li.clone());
						$lis = $cont.find("li");
					}
				});			
			}
		},

		add_recommended: function () {
			if (!self.rfm) {
				self.rfm = true;
				$.get(chrome.extension.getURL("/html/recommended_for_you.html"), function (data) {
					$('section.container').first().after(data);
					self.$rfm = $("#proto-panel-rfm");
					helpers.scrollTo(self.$rfm);
				});
			}
		},

		add_followed: function () {
			if (!self.fbm) {
				self.fbm = true;
				$.get(chrome.extension.getURL("/html/followed_by_you.html"), function (data) {
					$('section.container').first().after(data);
					self.$fbm = $("#proto-panel-fbm");
					helpers.scrollTo(self.$fbm);
				});
			}
		}	
	};
};

var messages = new notificationsPrototype();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    messages[request.message](request);
});