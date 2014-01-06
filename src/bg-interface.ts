/// <reference path="d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>
/// <reference path="background/TabStateManager.ts"/>
/// <reference path="background/BackgroundScript.ts"/>

module BackgroundInterface {
    function getBgVar(name) {
        return chrome.extension.getBackgroundPage()[name];
    }

    export function getTabStateManager(): TabStateManager {
        return getBgVar("BackgroundScript").getTabStateManager();
    }
}