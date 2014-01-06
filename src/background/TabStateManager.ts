/// <reference path="../d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>
/// <reference path="ContentScript.ts"/>

class TabStateManager {
    public tabStates: { [tabId: number]: TabState } = {};

    public remove(tabId: number) {
        delete this.tabStates[tabId];
    }

    public exists(tabId: number): boolean {
        return typeof (this.tabStates[tabId]) !== "undefined";
    }

    public set(tabId: number, tabState: TabState);
    public set(tabId: number, propName: string, propVal: any);
    public set(tabId: number, stateOrPropName: any, propVal?: any) {
        if (typeof propVal === "undefined") {
            this.tabStates[tabId] = stateOrPropName;
        }
        else {
            this.tabStates[tabId][stateOrPropName] = propVal;
        }
    }

    public get(tabId: number): TabState;
    public get(tabId: number, propName: string): boolean;
    public get(tabId: number, propName?: string) {
        if (typeof propName === "undefined") {
            return this.tabStates[tabId];
        }
        else {
            return this.tabStates[tabId][propName];
        }
    }
}

class TabState {
    public query: string;
    public searching: boolean;
    public caseInsensitive: boolean;
}