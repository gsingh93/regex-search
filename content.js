var marks = new Array();
var cur = 0;
var logging = true;

function log(message) {
    if (logging) {
        console.log(message);
    }
}

var infoSpan = document.createElement('span');
infoSpan.id = "_regexp_search_count";
infoSpan.style.position = 'fixed';
infoSpan.style.top = 0;
infoSpan.style.left = 0;
infoSpan.style.padding = '8px';
infoSpan.style.background = 'rgba(255, 255, 0, 0.5)';
infoSpan.addEventListener('mouseover', function(event) {
    infoSpan.style.opacity = "0";
});
infoSpan.addEventListener('mouseout', function(event) {
    infoSpan.style.opacity = "1";
});

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
            log("Searching for regex: " + request.regexp)
            var flags = "g";
            if (request.caseInsensitive == true) {
                log("Case insensitive enabled")
                var flags = "gi";
            }
            clear();
            displayInfoSpan();
            setInfoSpanText("Searching...");
            var re = new RegExp(request.regexp, flags);
            makeTimeoutCall(function(re) {delayedSearch(re);}, re, 10);
        } else if (request.command == "clear") {
            clear();
        } else if (request.command == "prev") {
            moveToPrev();
        } else if (request.command == "next") {
            moveToNext();
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
    disp = $(element).css('display');
    if (element.nodeType != Node.TEXT_NODE &&
        (disp == 'none' || disp == 'hidden')) {
        return;
    }

    if (element.childNodes.length > 0) {
        for (var i = 0; i < element.childNodes.length; i++) {
            recurse(element.childNodes[i], regexp);
        }
    }

    if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() != '') {
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

        if (matches != null) {
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
                    parent.insertBefore(before, mark.nextSibling)
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

function displayCount() {
    if (marks.length > 0) {
        var num = cur + 1;
    } else {
        var num = 0;
    }
    setInfoSpanText(num + " of " + marks.length + " matches.");
    displayInfoSpan();
}

function removeInfoSpan() {
    var span = getInfoSpan();
    if (span.parentNode) {
        span.parentNode.removeChild(span);
    }
}

function displayInfoSpan() {
    var span = getInfoSpan();
    if (!span.parentNode) {
        document.getElementsByTagName('body')[0].appendChild(span);
    }
}

function moveToNext() {
    console.assert(cur >= 0 && cur < marks.length);
    marks[cur++].className = "";
    cur %= marks.length;
    marks[cur].className = "__regexp_search_selected";
    updatePosText();
}

function moveToPrev() {
    console.assert(cur >= 0 && cur < marks.length);
    marks[cur--].className = "";
    if (cur < 0) {
        cur += marks.length;
    }
    marks[cur].className = "__regexp_search_selected";
    updatePosText();
}

function updatePosText() {
    if (marks.length > 0) {
        setInfoSpanText((cur + 1) + " of " + marks.length + " matches.");
    }
}

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

    return top >= window.pageYOffset && left >= window.pageXOffset
        && (top + height) <= (window.pageYOffset + window.innerHeight)
        && (left + width) <= (window.pageXOffset + window.innerWidth);
}

