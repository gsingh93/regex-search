/// <reference path="../d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>
/// <reference path="../bg-interface.ts"/>
/// <reference path="../ContentScript.ts"/>
var logging = false;

function log(message: string) {
    if (logging) {
        console.log(message);
    }
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
    console.assert(tabs.length == 1);

    var id = tabs[0].id;
    var tabStates = BackgroundInterface.getTabStateManager();

    // In most cases the map entry will already be initialized. However, there
    // may be a few edge cases where we need to initialize it ourselves.
    if (!tabStates.exists(id)) {
        log("ID doesn't exist. Initializing entry.")
        tabStates.set(id, { query: "", searching: false, caseInsensitive: false });
    }
    var tabState = tabStates.get(id);

    var prevButton  = document.getElementById("prev");
    var nextButton  = document.getElementById("next");
    var queryInput  = <HTMLInputElement> document.getElementById("query");
    var caseInsensitiveCheckbox = <HTMLInputElement> document.getElementById("case-insensitive");

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
        ContentScript.sendCommand("prev");
    });
    nextButton.addEventListener("click", function(event) {
        if (tabState.searching) {
            ContentScript.sendCommand("next");
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
        tabState.query = queryInput.value;

        if (tabState.searching) {
            tabState.searching = false;
            ContentScript.sendCommand("clear");
        }

        // Remove the invalid class if it's there
        queryInput.className = '';

        if (queryInput.value == "") {
            setEnabled("next", false);
        } else {
            setEnabled("next", true);
        }
    });

    queryInput.value = tabState.query;
    if (queryInput.value == "") {
        setEnabled("next", false);
    } else {
        setEnabled("next", true);
    }

    caseInsensitiveCheckbox.onclick = function() {
        log("Set checkbox state to " + this.checked);
        tabState.caseInsensitive = this.checked;
    }

    caseInsensitiveCheckbox.checked = tabState.caseInsensitive;

    function search() {
        var el = <HTMLInputElement> document.getElementById("query");
        if (validate(el.value)) {
            el.className = '';
            var checkbox = <HTMLInputElement> document.getElementById("case-insensitive");
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
            tabState.searching = true;
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
