var query = "";
var searching = false;

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.tabs.create({ url: "install.html" });
    } else if (details.reason == "update") {
        chrome.tabs.create({ url: "update.html" });
    }
});
