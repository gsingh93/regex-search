document.getElementById("search").addEventListener("click", search);
document.getElementById("query").addEventListener("keydown", function(event) {
	if (event.keyCode == 13) {
		search();
	}
});

function search() {
	chrome.tabs.getSelected(null, function(tab) {
		var el = document.getElementById("query");
		if (el.value != "") {
			chrome.tabs.sendMessage(tab.id, {regexp: el.value});
		}
	});
}



