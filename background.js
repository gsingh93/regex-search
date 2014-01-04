// Map from tab ID to search state {string, bool}
var active_tabs = {};

// Show update or install pages if necessary
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.tabs.create({ url: "install.html" });
    } else if (details.reason == "update") {
        chrome.tabs.create({ url: "update.html" });
    }
});

// Handle keyboard shortcuts
var lastCalled = 0;
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        console.assert(tabs.length == 1);
        var id = tabs[0].id;

        // The time hack is to get around this function being called twice when
        // the popup is open
        var d = new Date();
        if (active_tabs[id] != undefined && active_tabs[id].searching
            && d.getTime() - lastCalled > 50) {
            if (command == "next") {
                sendCommand("next");
            } else if (command == "prev") {
                sendCommand("prev");
            }
            lastCalled = d.getTime();
        }
    });
});

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

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        var id = sender.tab.id;
        // Reset the tab state whenever it is loaded/reloaded
        if (request.event == "loaded") {
            if (active_tabs[id] == undefined) {
                active_tabs[id] = {query: "", searching: false};
            } else {
                // Don't change the query, only reset searching
                active_tabs[id].searching = false;
            }
        }
    }
);

// Remove state when tab is closed
chrome.tabs.onRemoved.addListener(function(id) {
    delete active_tabs[id];
});
