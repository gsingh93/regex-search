/// <reference path="d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>

module ContentScript {
    export function sendCommand(commandName: string, responseHandler?: any): void {
        (function (commandName, responseHandler) {
            chrome.tabs.query({ active: true }, function (tabs: chrome.tabs.Tab[]) {
                var tab: chrome.tabs.Tab = tabs[0];

                if (responseHandler == undefined) {
                    responseHandler = null;
                }
                chrome.tabs.sendMessage(tab.id, { command: commandName },
                    responseHandler);
            });
        })(commandName, responseHandler);
    }
}