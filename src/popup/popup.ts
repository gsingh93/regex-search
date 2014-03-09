/// <reference path="../d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>
/// <reference path="../bg-interface.ts"/>
/// <reference path="../Utils.ts"/>

module Popup {
    var prevButton  = document.getElementById("prev");
    var nextButton  = document.getElementById("next");
    var queryInput  = <HTMLInputElement> document.getElementById("query");
    var caseInsensitiveCheckbox = <HTMLInputElement> document.getElementById("case-insensitive");

    Utils.withActiveTab(function (tab: chrome.tabs.Tab) {
        var id = tab.id;
        var tabStates = BackgroundInterface.getTabStateManager();

        // In most cases the map entry will already be initialized. However, there
        // may be a few edge cases where we need to initialize it ourselves,
        // like if we enable/reload the extension
        if (!tabStates.exists(id)) {
            Utils.log("ID doesn't exist. Initializing entry.")
            tabStates.resetState(id);
        }

        addListeners(id, tabStates);
        restoreState(id, tabStates);
    });

    function addListeners(id: number, tabStates: TabStateManager) {
        var prevButtonClick = function() {
            Utils.sendCommand("prev");
        };

        var nextButtonClick = function() {
            if (tabStates.isSearching(id)) {
                Utils.sendCommand("next");
            } else {
                search(id, tabStates);
            }
        };

        var queryInputKeyDown = function(event) {
            if (event.keyCode == 13) {
                Utils.log("Enter pressed");
                search(id, tabStates);
            }
        }

        var queryInputInput = () => {
            tabStates.set(id, "query", this.value);

            if (tabStates.isSearching(id)) {
                tabStates.set(id, "searching", false);
                Utils.sendCommand("clear");
            }

            // Remove the invalid class if it's there
            this.className = '';

            if (this.value == "") {
                setEnabled("next", false);
            } else {
                setEnabled("next", true);
            }
        }

        var checkboxClick = function() {
            Utils.log("Set checkbox state to " + this.checked);
            tabStates.set(id, "caseInsensitive", this.checked);
        }

        prevButton.addEventListener("click", prevButtonClick);
        nextButton.addEventListener("click", nextButtonClick);
        queryInput.addEventListener("keydown", queryInputKeyDown);
        queryInput.addEventListener("input", queryInputInput);
        caseInsensitiveCheckbox.onclick = checkboxClick;
    }

    function restoreState(tabId: number, tabStates: TabStateManager) {
        queryInput.value = tabStates.get(tabId, "query");
        if (queryInput.value == "") {
            setEnabled("next", false);
        } else {
            setEnabled("next", true);
        }

        caseInsensitiveCheckbox.checked = tabStates.get(tabId, "caseInsensitive");
    }

    function search(tabId: number, tabStates: TabStateManager) {
        if (validate(queryInput.value)) {
            queryInput.className = '';
            var insensitive = caseInsensitiveCheckbox.checked;

            chrome.tabs.sendMessage(tabId,
                                    {
                                        command: "search",
                                        caseInsensitive: insensitive,
                                        regexp: queryInput.value
                                    });
            tabStates.set(tabId, "searching", true);
        } else {
            Utils.log("Invalid regex");
            queryInput.className = 'invalid';
        }
    }

    function validate(regexp: string): boolean {
        if (regexp != "") {
            try {
                "".match(regexp);
                return true;
            } catch (e) {
            }
        }
        return false;
    }

    function setEnabled(id: string, val: boolean) {
        document.getElementById(id).disabled = !val;
    }
}
