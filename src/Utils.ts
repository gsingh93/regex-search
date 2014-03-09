/// <reference path="d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>

module Utils {
    var logging = true;
    export function log(message: string) {
        if (logging) {
            console.log(message);
        }
    }

    export interface ActiveTabCallback {
        (tab: chrome.tabs.Tab) : void;
    }

    export function withActiveTab(callback: ActiveTabCallback) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true },
            function (tabs: chrome.tabs.Tab[]) {

            console.assert(tabs.length == 1);
            callback(tabs[0]);
        });
    }

    export function sendCommand(commandName: string, responseHandler?: any): void {
        (function (commandName, responseHandler) {
            withActiveTab(function (tab: chrome.tabs.Tab) {
                if (typeof responseHandler === "undefined") {
                    responseHandler = null;
                }
                chrome.tabs.sendMessage(tab.id, { command: commandName },
                    responseHandler);
            });
        })(commandName, responseHandler);
    }
}
