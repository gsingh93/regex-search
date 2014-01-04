var logging = false;

function log(message) {
    if (logging) {
        console.log(message);
    }
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
    console.assert(tabs.length == 1);

    var id = tabs[0].id;
    var map = getBackgroundVar("active_tabs")[id];

    // In most cases the map entry will already be initialized. However, there
    // may be a few edge cases where we need to initialize it ourselves.
    if (map == undefined) {
        log("ID doesn't exist. Initializing entry.")
        map = {query: "", searching: false};
        getBackgroundVar("active_tabs")[id] = map;
    }

    var prevButton  = document.getElementById("prev");
    var nextButton  = document.getElementById("next");
    var queryInput  = document.getElementById("query");

    function sendCommand(commandName, responseHandler) {
        (function (commandName, responseHandler) {
            chrome.tabs.getSelected(null, function(tab) {
                if (responseHandler == undefined) {
                    responseHandler = null;
                }
                log("Sending command " + commandName);
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
        if (map["searching"]) {
            sendCommand("next");
        } else {
            search();
        }
    });

    queryInput.addEventListener("keydown", function(event) {
        if (event.keyCode == 13) {
            log("Enter pressed");
            search();
        }
    });
    queryInput.addEventListener("input", function(event) {
        map["query"] = queryInput.value;

        if (map["searching"]) {
            map["searching"] = false;
            sendCommand("clear");
        }

        // Remove the invalid class if it's there
        queryInput.className = '';

        if (queryInput.value == "") {
            setEnabled("next", false);
        } else {
            setEnabled("next", true);
        }
    });

    queryInput.value = map["query"];
    if (queryInput.value == "") {
        setEnabled("next", false);
    } else {
        setEnabled("next", true);
    }

    function search() {
        var el = document.getElementById("query");
        if (validate(el.value)) {
            el.className = '';
            checkbox = document.getElementById("case-insensitive");
            if (checkbox.checked) {
                var insensitive = true;
            } else {
                var insensitive = false;
            }
            chrome.tabs.sendMessage(id,
                                    {
                                        command: "search",
                                        caseInsensitive: insensitive,
                                        regexp: el.value
                                    });
            map["searching"] = true;
        } else {
            log("Invalid regex");
            el.className = 'invalid';
        }
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
});
