chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var re = new RegExp(request.regexp, "g");
		var html = document.getElementsByTagName('body')[0];
		recurse(html, re);
	});

function recurse(element, regexp)
{
	if (element.nodeName == "SPAN" &&
		element.className.indexOf("_regexp_highlight") != -1) {
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
		 * 4. Add the match as a span
		 * 5. After loop is finished, add remainder as text node
		 */
		var str = element.nodeValue;
		var matches = str.match(regexp);
		
		var parent = element.parentNode;
		if (matches != null) {
			parent.removeChild(element);
			
			var pos = 0;
			for (var i = 0; i < matches.length; i++) {
				var index = str.indexOf(matches[i], pos);
				var before = document.createTextNode(str.substring(pos, index));
				pos = index + matches[i].length;

				var span = document.createElement('span');
				span.className = parent.className + " _regexp_highlight";
				span.appendChild(document.createTextNode(matches[i]));

				parent.appendChild(before);
				parent.appendChild(span);
			}
			parent.appendChild(document.createTextNode(str.substring(pos)));
		}
	}
}
