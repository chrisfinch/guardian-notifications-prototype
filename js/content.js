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
		insert_single: function (req) {
			var $cont = self.$rfm.find("ul.collection");
			var el = Math.floor((Math.random()*$cont.find("li").length));
			var $el = $cont.find("li").eq(el).clone();
			$cont.append($el);
		},

		set_stories: function (req) {
			var n = req.num;
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

		add_recommended: function (req) {
			if (!self.rfm) {
				self.rfm = true;
				$.get(chrome.extension.getURL("/html/"+req.config.user+"/recommended_for_you.html"), function (data) {
					$('section.container').first().after(data);
					self.$rfm = $("#proto-panel-rfm");
					helpers.scrollTo(self.$rfm);
				});
			}
		},

		add_followed: function (req) {
			if (!self.fbm) {
				self.fbm = true;
				$.get(chrome.extension.getURL("/html/"+req.config.user+"/followed_by_you.html"), function (data) {
					$('section.container').first().after(data);
					self.$fbm = $("#proto-panel-fbm");
					helpers.scrollTo(self.$fbm);
				});
			}
		},

		add_notifications_big: function (req) {
			if (!self.ncb) {
				self.ncb = true;
				$.get(chrome.extension.getURL("/html/notifications_big.html"), function (data) {
					var $cont = $('.js-profile-nav').wrap("<div class='profile-group'></div>").parent();
					self.$ncb = $(data).appendTo($cont);
					window.notificationsBig();
					//helpers.scrollTo(self.$fbm);
				});				
			}
		},

		add_breaking_news: function () {
			$.get(chrome.extension.getURL("/html/breaking_news.html"), function (data) {
				setTimeout(function () {
					self.$breakingNews = $(data).appendTo("body");
				}, 5000);
			});
		},

		reset_content: function (req) {
			delete self.ncb;
			delete self.fbm;
			delete self.rfm;
			if (self.$ncb) self.$ncb.remove();
			if (self.$fbm) self.$fbm.remove();
			if (self.$rfm) self.$rfm.remove();
			$('html, body').animate({
	            scrollTop: '0px'
	        });			
		}
	};
};

var messages = new notificationsPrototype();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    messages[request.message](request);
});