document.getElementById("clear").addEventListener("click", function(event) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {command: "clear"});
	});
});
document.getElementById("search").addEventListener("click", search);
document.getElementById("query").addEventListener("keydown", function(event) {
	if (event.keyCode == 13) {
		search();
	}
});

function search() {
	chrome.tabs.getSelected(null, function(tab) {
		var el = document.getElementById("query");
		console.log(validate(el.value));
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