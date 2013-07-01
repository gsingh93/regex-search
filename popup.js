document.getElementById("search").addEventListener("click", function() {
	chrome.tabs.getSelected(null, function(tab) {
		var el = document.getElementById("query");
		chrome.tabs.sendMessage(tab.id, {regexp: el.value});
	});
});



