/// <reference path="../d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>

class TabStateManager {
    public tabStates: { [tabId: number]: TabState } = {};

    public remove(tabId: number) {
        delete this.tabStates[tabId];
    }

    public exists(tabId: number): boolean {
        return typeof (this.tabStates[tabId]) !== "undefined";
    }

    public resetState(tabId: number) {
        var caseInsensitiveVal = localStorage["caseInsensitive"] == "true";
        this.set(tabId, { query: "", searching: false, caseInsensitive: caseInsensitiveVal });
    }

    public isSearching(tabId: number): boolean {
        return this.get(tabId, "searching");
    }

    public set(tabId: number, tabState: TabState);
    public set(tabId: number, propName: string, propVal: any);
    public set(tabId: number, stateOrPropName: any, propVal?: any) {
        if (typeof propVal === "undefined") {
            Log.debug("Set " + tabId + " to:");
            Log.debug(stateOrPropName);
            this.tabStates[tabId] = stateOrPropName;
        } else {
            Log.debug("Set " + stateOrPropName + " for " + tabId + " to " + propVal);
            this.tabStates[tabId][stateOrPropName] = propVal;
        }
    }

    public get(tabId: number): TabState;
    public get(tabId: number, propName: string): any;
    public get(tabId: number, propName?: string) {
        if (typeof propName === "undefined") {
            return this.tabStates[tabId];
        } else {
            return this.tabStates[tabId][propName];
        }
    }
}

class TabState {
    public query: string;
    public searching: boolean;
    public caseInsensitive: boolean;
}
