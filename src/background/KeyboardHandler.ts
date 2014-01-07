/// <reference path="../d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>
/// <reference path="../ContentScript.ts"/>
/// <reference path="TabStateManager.ts"/>

module KeyboardHandler {
    var lastCalled: number;

    export function init(tabStates: TabStateManager) {
        chrome.commands.onCommand.addListener(function (command: string) {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
                console.assert(tabs.length == 1);
                var id = tabs[0].id;

                // The time hack is to get around this function being called twice when
                // the popup is open
                var d = new Date();
                if (tabStates.exists(id) && tabStates.get(id, "searching")
                    && d.getTime() - lastCalled > 50) {
                    if (command == "next" || command == "prev") {
                        ContentScript.sendCommand(command);
                    }
                    lastCalled = d.getTime();
                }
            });
        });
    }
}