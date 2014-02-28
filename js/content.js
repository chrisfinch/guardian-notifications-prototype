var notifications = function (config) {
	this.state = config.state || {};
	this.user = config.user || "none";
	this.classes = {
		notificationsBig: "#nav-notifications",
		followedByYou: "#proto-panel-followedByYou",
		recommendedForYou: "#proto-panel-recommendedForYou"
	};
	this.parseState();
};

notifications.prototype = {
	parseState: function () {
		for (var key in this.state) {
			if (this.state[key]) {
				this.state[key] = false;
				this["add_"+key]({config:{user:this.user}}); // :-/
			}
		}
	},

	insert_single: function (req) {
		var self = this;
		var $cont = self.state.$recommendedForYou.find("ul.collection");
		var el = Math.floor((Math.random()*$cont.find("li").length));
		var $el = $cont.find("li").eq(el).clone();
		$cont.append($el);
	},

	set_stories: function (req) {
		var self = this;
		var n = req.num;
		var $cont = self.state.$recommendedForYou.find("ul.collection");
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

	add_recommendedForYou: function (req) {
		var self = this;
		if (!self.state.recommendedForYou) {
			self.state.recommendedForYou = true;
			$.get(chrome.extension.getURL("/html/"+req.config.user+"/recommended_for_you.html"), function (data) {
				$('section.container').first().after(data);
				//self.scrollTo($("#proto-panel-recommendedForYou"));
				self.sync();
			});
		}
	},

	add_followedByYou: function (req) {
		var self = this;
		if (!self.state.followedByYou) {
			self.state.followedByYou = true;
			$.get(chrome.extension.getURL("/html/"+req.config.user+"/followed_by_you.html"), function (data) {
				$('section.container').first().after(data);
				//self.scrollTo($("#proto-panel-followedByYou"));
				self.sync();					
			});
		}
	},

	add_notificationsBig: function (req) {
		var self = this;
		if (!self.state.notificationsBig) {
			self.state.notificationsBig = true;
			$.get(chrome.extension.getURL("/html/notifications.html"), function (data) {
				var $cont = $('.js-profile-nav').addClass("nav-profile").wrap("<div class='identity-group'></div>").parent();
				$(data).appendTo($cont);
				window.notificationsBig();
				self.sync();
			});				
		}
	},

	add_breaking_news: function (req) {
		var self = this;
		$.get(chrome.extension.getURL("/html/breaking_news.html"), function (data) {
			
			var delay = (1000 * 60) * 10;

			setTimeout(function () {
				$(data).appendTo("body");
				$("#breaking_news .close").on("click", function (event) {
					event.preventDefault();
					$("#breaking_news").addClass("hide");
					setTimeout(function () {
						$("#breaking_news").remove(); // Bleeeegggghhhh
					}, 1500);
				});
				self.sync();
			}, delay);
		});
	},

	reset_content: function (req) {
		if (this.state.notificationsBig) 
		if (this.state.followedByYou) 
		if (this.state.recommendedForYou) 
		delete this.state.notificationsBig;
		delete this.state.followedByYou;
		delete this.state.recommendedForYou;
		$('html, body').animate({
            scrollTop: '0px'
        });			
	},

	scrollTo: function ($el) {
		$('html, body').animate({
            scrollTop: $el.offset().top + 'px'
        });
	},

	sync: function () {
		var sync = $.extend({}, this.state);
		chrome.runtime.sendMessage({message: "set_sync", target: "background", sync: sync}, function () {});			
	}	
};

$(function () {
	chrome.runtime.sendMessage({message: "get_sync", target: "background"}, function (response) {

		var messages = new notifications(response);

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		    messages[request.message](request);
		});

	});
});