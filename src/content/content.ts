/// <reference path="../d.ts/DefinitelyTyped/chrome/chrome.d.ts"/>
/// <reference path="../d.ts/DefinitelyTyped/jquery/jquery.d.ts"/>

var marks = [];
var cur = 0;
var logging = false;

// Notify background script that this page has just loaded
chrome.runtime.sendMessage({event: "loaded"});

// Global variable because prototypes are hard.
var infoSpan = document.createElement('span');
infoSpan.id = "_regexp_search_count";
infoSpan.style.position = 'fixed';
infoSpan.style.top = '0';
infoSpan.style.left = '0';
infoSpan.style.padding = '8px';
infoSpan.style.background = 'rgba(255, 255, 0, 0.5)';
infoSpan.addEventListener('mouseover', function(event) {
    infoSpan.style.opacity = "0";
});
infoSpan.addEventListener('mouseout', function(event) {
    infoSpan.style.opacity = "1";
});

function log(message) {
    if (logging) {
        console.log(message);
    }
}

function getInfoSpan() {
    return infoSpan;
}

function setInfoSpanText(text) {
    infoSpan.innerHTML = text;
}

function makeTimeoutCall(fn, data, timeout){
    setTimeout(function() {fn.call(null, data);}, timeout);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        log("Received command " + request.command);
        if (request.command == "search") {
            log("Searching for regex: " + request.regexp);
            var flags = "g";
            if (request.caseInsensitive === true) {
                log("Case insensitive enabled");
                flags = "gi";
            }
            clear();
            displayInfoSpan();
            setInfoSpanText("Searching...");
            var re = new RegExp(request.regexp, flags);

            // Search needs to be delayed because InfoSpan isn't updated fast
            // enough
            makeTimeoutCall(function(re) {delayedSearch(re);}, re, 10);
        } else if (request.command == "clear") {
            clear();
        } else if (request.command == "prev") {
            move(false);
        } else if (request.command == "next") {
            move(true);
        } else {
            log("Invalid command");
        }
        if (request.command != "search") {
            if (marks.length > 0) {
                marks[cur].className = "__regexp_search_selected";
                if (!elementInViewport(marks[cur])) {
                    $('body').scrollTop($(marks[cur]).offset().top - 20);
                }
            }
        }
    });

function delayedSearch(re) {
    var html = document.getElementsByTagName('body')[0];
    html.normalize();
    recurse(html, re);
    displayCount();
    if (marks.length > 0) {
            marks[cur].className = "__regexp_search_selected";
            if (!elementInViewport(marks[cur])) {
                $('body').scrollTop($(marks[cur]).offset().top - 20);
            }
        }
}

function recurse(element, regexp) {
    if (element.nodeName == "MARK" || element.nodeName == "SCRIPT" ||
        element.nodeName == "NOSCRIPT" ||
        element.nodeName == "STYLE" ||
        element.nodeType == Node.COMMENT_NODE) {
        return;
    }

    // Skipping infoSpan
    if (element.id == '_regexp_search_count') {
        return;
    }

    // Skip all invisible text nodes
    var disp = $(element).css('display');
    if (element.nodeType != Node.TEXT_NODE &&
        (disp == 'none' || disp == 'hidden')) {
        return;
    }

    if (element.childNodes.length > 0) {
        for (var i = 0; i < element.childNodes.length; i++) {
            recurse(element.childNodes[i], regexp);
        }
    }

    if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() !== '') {
        /*
         * 1. Find all regex matches
         * 2. Loop through matches, finding their starting positions
         * 3. Add everything between the last match and this match as a text node
         * 4. Add the match as a <mark>
         * 5. After loop is finished, add remainder as text node
         */
        var str = element.nodeValue;
        var matches = str.match(regexp);
        var parent = element.parentNode;

        if (matches !== null) {
            var pos = 0;
            var mark;
            for (var i = 0; i < matches.length; i++) {
                var index = str.indexOf(matches[i], pos);
                var before = document.createTextNode(str.substring(pos, index));
                pos = index + matches[i].length;

                /*
                 * We can only replace the child once, after that we insert after
                 * the previous mark element
                 */
                if (element.parentNode == parent) {
                    parent.replaceChild(before, element);
                } else {
                    parent.insertBefore(before, mark.nextSibling);
                }

                mark = document.createElement('mark');
                mark.appendChild(document.createTextNode(matches[i]));

                parent.insertBefore(mark, before.nextSibling);
                marks.push(mark);
            }
            var after = document.createTextNode(str.substring(pos));
            parent.insertBefore(after, mark.nextSibling);
        }
    }
}

// Remove all matches
function clear() {
    setInfoSpanText("Clearing...");
    setTimeout(function() {
        cur = 0;
        for (var i = 0; i < marks.length; i++) {
            var mark = marks[i];
            mark.parentNode.replaceChild(mark.firstChild, mark);
        }
        marks.length = 0;
        removeInfoSpan();
    }, 10);
}

// Set the infoSpan text to the number of matches
function displayCount() {
    var num;
    if (marks.length > 0) {
        num = cur + 1;
    } else {
        num = 0;
    }
    setInfoSpanText(num + " of " + marks.length + " matches.");
    displayInfoSpan();
}

// Remove the infoSpan from the screen
function removeInfoSpan() {
    var span = getInfoSpan();
    if (span.parentNode) {
        span.parentNode.removeChild(span);
    }
}

// Show the infoSpan on the screen
function displayInfoSpan() {
    var span = getInfoSpan();
    if (!span.parentNode) {
        document.getElementsByTagName('body')[0].appendChild(span);
    }
}

// Move the current match
function move(next) {
    if (marks.length > 0) {
        console.assert(cur >= 0 && cur < marks.length);
        marks[cur].className = "";
        if (next) {
            nextMatch();
        } else {
            prevMatch();
        }
        marks[cur].className = "__regexp_search_selected";
        setInfoSpanText((cur + 1) + " of " + marks.length + " matches.");
    }
}

// Move current match to the next match
function nextMatch() {
    cur++;
    cur %= marks.length;
}

// Move the current match to the previous match
function prevMatch() {
    cur--;
    if (cur < 0) {
        cur += marks.length;
    }
}

// Returns true if el is in the viewport, false otherwise
function elementInViewport(el) {
    var top    = el.offsetTop;
    var left   = el.offsetLeft;
    var width  = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return top >= window.pageYOffset && left >= window.pageXOffset &&
        (top + height) <= (window.pageYOffset + window.innerHeight) &&
        (left + width) <= (window.pageXOffset + window.innerWidth);
}
