module Options {

    var caseInsensitiveKey = "caseInsensitive";
    var checkbox = <HTMLInputElement> document.getElementById("case-insensitive");
    restoreState();
    checkbox.onclick = saveState;

    function restoreState() {
        if (localStorage[caseInsensitiveKey] !== undefined) {
            checkbox.checked = localStorage[caseInsensitiveKey] == "true";
        }
    }

    function saveState() {
        if (checkbox.checked) {
            localStorage[caseInsensitiveKey] = true;
        } else {
            localStorage[caseInsensitiveKey] = false;
        }

        // Display saved message
        var status = document.getElementById("status");
        status.innerHTML = "Options Saved.";
        setTimeout(function() {
            status.innerHTML = "";
        }, 1000);
    }
}

