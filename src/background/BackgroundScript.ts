/// <reference path="../d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>
/// <reference path="KeyboardHandler.ts"/>
/// <reference path="TabStateManager.ts"/>

module BackgroundScript {
    var tabStates;
    export function getTabStateManager() {
        return tabStates;
    }
    function init() {
        tabStates = new TabStateManager();
        addTabStateListeners(tabStates);

        KeyboardHandler.init(tabStates);

        registerInstallationNotice();
    }

    // Show update or install pages if necessary
    function registerInstallationNotice() {
        chrome.runtime.onInstalled.addListener(function (details) {
            if (details.reason == "install") {
                chrome.tabs.create({ url: "pages/install.html" });
            } else if (details.reason == "update") {
                chrome.tabs.create({ url: "pages/update.html" });
            }
        });
    }

    function addTabStateListeners(tabStates: TabStateManager) {
        chrome.runtime.onMessage.addListener(function (request, sender) {
            var id = sender.tab.id;
            // Reset the tab state whenever it is loaded/reloaded
            if (request.event == "loaded") {
                if (tabStates.exists(id)) {
                    tabStates.set(id, { query: "", searching: false, caseInsensitive: false });
                } else {
                    // Don't change the query, only reset searching
                    tabStates.set(id, "searching", false);
                }
            }
        });

        // Remove state when tab is closed
        chrome.tabs.onRemoved.addListener(function (id) {
            tabStates.remove(id);
        });
    }

    init();
}