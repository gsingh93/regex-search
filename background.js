var query = "";
var searching = false;

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.tabs.create({ url: "install.html" });
    } else if (details.reason == "update") {
        chrome.tabs.create({ url: "update.html" });
    }
});

var lastCalled = 0;
chrome.commands.onCommand.addListener(function(command) {
    // The time hack is to get around this function being called twice when the
    // popup is open
    var d = new Date();
    if (searching && d.getTime() - lastCalled > 50) {
        if (command == "next") {
            sendCommand("next");
        } else if (command == "prev") {
            sendCommand("prev");
        }
        lastCalled = d.getTime();
    }
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
