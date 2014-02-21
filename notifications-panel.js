$.get(chrome.extension.getURL("panel.html"), function (data) {
	$('section.container').first().after(data);
});