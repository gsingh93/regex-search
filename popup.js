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
    sendCommand("clear", function(response) {
        setBackgroundVar("searching", false);
    });
});

queryInput.addEventListener("keydown", function(event) {
    setBackgroundVar("query", document.getElementById("query").value);
    if (event.keyCode == 13) {
        search();
    }
});

queryInput.value = getBackgroundVar("query");

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
                                    },
                                    function(response) {
                                        if (response.status == "success") {
                                            setBackgroundVar("searching", true);
                                        }
                                    });
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
