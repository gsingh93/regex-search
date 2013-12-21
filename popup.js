var prevButton  = document.getElementById("prev");
var nextButton  = document.getElementById("next");
var clearButton = document.getElementById("clear");
var queryInput  = document.getElementById("query");

function sendCommand(commandName, responseHandler) {
    (function (commandName, responseHandler) {
        chrome.tabs.getSelected(null, function(tab) {
            if (responseHandler == undefined) {
                responseHandler = null;
            }
            chrome.tabs.sendMessage(tab.id, {command: commandName},
                                    responseHandler);
        });
    })(commandName, responseHandler);
}

function setBackgroundVar(name, val) {
    chrome.extension.getBackgroundPage()[name] = val;
}

function getBackgroundVar(name) {
    return chrome.extension.getBackgroundPage()[name];
}

function setEnabled(id, val) {
    document.getElementById(id).disabled = !val;
}

prevButton.addEventListener("click", function(event) {
    sendCommand("prev");
});
nextButton.addEventListener("click", function(event) {
    if (getBackgroundVar("searching")) {
        sendCommand("next");
    } else {
        search();
    }
});
clearButton.addEventListener("click", function(event) {
    sendCommand("clear");
    setBackgroundVar("searching", false);
    setEnabled("clear", false);
});

queryInput.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
        search();
    }
});
queryInput.addEventListener("input", function(event) {
    if (getBackgroundVar("query") != queryInput.value) {
        setBackgroundVar("query", queryInput.value);
        setBackgroundVar("searching", false);
    }

    // Remove the invalid class if it's there
    queryInput.className = '';

    if (queryInput.value == "") {
        setEnabled("next", false);
    } else {
        setEnabled("next", true);
    }
});

queryInput.value = getBackgroundVar("query");
if (queryInput.value == "") {
    setEnabled("next", false);
} else {
    setEnabled("next", true);
}

if (!getBackgroundVar("searching")) {
    setEnabled("clear", false);
}

function search() {
    chrome.tabs.getSelected(null, function(tab) {
        var el = document.getElementById("query");
        if (validate(el.value)) {
            el.className = '';
            checkbox = document.getElementById("case-insensitive");
            if (checkbox.checked) {
                var insensitive = true;
            } else {
                var insensitive = false;
            }
            chrome.tabs.sendMessage(tab.id,
                                    {
                                        command: "search",
                                        caseInsensitive: insensitive,
                                        regexp: el.value
                                    });
            setEnabled("clear", true);
            setBackgroundVar("searching", true);
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
