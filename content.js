var marks = new Array();

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var re = new RegExp(request.regexp, "g");
		var html = document.getElementsByTagName('body')[0];
		clear();
		recurse(html, re);
	});

function recurse(element, regexp)
{
	if (element.nodeName == "MARK") {
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
			parent.removeChild(element);
			
			var pos = 0;
			for (var i = 0; i < matches.length; i++) {
				var index = str.indexOf(matches[i], pos);
				var before = document.createTextNode(str.substring(pos, index));
				pos = index + matches[i].length;

				var mark = document.createElement('mark');
				mark.appendChild(document.createTextNode(matches[i]));

				parent.appendChild(before);
				parent.appendChild(mark);

				marks.push(mark);
			}
			parent.appendChild(document.createTextNode(str.substring(pos)));
		}
	}
}

function clear() {
	for (var i = 0; i < marks.length; i++) {
		var mark = marks[i];
		mark.parentNode.replaceChild(mark.firstChild, mark);
	}
}
