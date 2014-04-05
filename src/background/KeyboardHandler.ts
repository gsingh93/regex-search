/// <reference path="../d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>
/// <reference path="../Utils.ts"/>
/// <reference path="../Log.ts"/>
/// <reference path="TabStateManager.ts"/>

module KeyboardHandler {
    var lastCalled: number = 0;

    export function init(tabStates: TabStateManager) {
        chrome.commands.onCommand.addListener(function(command: string) {
            Log.info("Received command " + command);
            Utils.withActiveTab(function(tab: chrome.tabs.Tab) {
                var id = tab.id;

                // The time hack is due to a bug in Chrome:
                // https://code.google.com/p/chromium/issues/detail?id=355559
                var d = new Date();
                if (tabStates.exists(id) && tabStates.get(id, "searching")
                    && d.getTime() - lastCalled > 50) {
                    if (command == "next" || command == "prev") {
                        Utils.sendCommand(command);
                    }
                    lastCalled = d.getTime();
                }
            });
        });
    }
}
