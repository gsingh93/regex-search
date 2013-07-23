document.getElementById("prev").addEventListener("click", function(event) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {command: "prev"});
	});
});
document.getElementById("next").addEventListener("click", function(event) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {command: "next"});
	});
});
document.getElementById("search").addEventListener("click", search);
document.getElementById("query").addEventListener("keydown", function(event) {
	chrome.extension.getBackgroundPage().query = document.getElementById("query").value;
	if (event.keyCode == 13) {
		search();
	}
});

document.getElementById("query").value = chrome.extension.getBackgroundPage().query;

function search() {
	chrome.tabs.getSelected(null, function(tab) {
		var el = document.getElementById("query");
		if (validate(el.value)) {
			el.className = '';
			chrome.tabs.sendMessage(tab.id, {command: "search", regexp: el.value});
		} else {
			el.className = 'invalid';
		}
	});
}

function validate(regexp) {
	if (regexp != "") {
		try {
			"".match(regexp);
			return true;
		} catch (e) {
		}
	}
	return false;
}