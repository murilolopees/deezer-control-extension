function ready() {
    if (document.readyState !== "complete") {
		return;
    }

    let buffer = [];

    document.addEventListener('keydown', function(event) {
        if (!buffer.includes(event.keyCode)) {
            buffer.push(event.keyCode);
        }

        chrome.runtime.sendMessage({ type: 'keydown', bufferKeys: buffer });
    });

    document.addEventListener('keyup', function(event) {
        buffer = buffer.filter(function(val) {
            return val != event.keyCode;
        });
    });

    loadObserver();
    listenMessages();
}

function loadObserver() {
    let s = document.createElement('script');
    s.src = chrome.extension.getURL('scripts/observer.js');
	(document.head || document.documentElement).appendChild(s);
	s.onload = function() { "use strict"; s.parentNode.removeChild(s); };
}

function listenMessages() {
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
        window.postMessage(msg);
    });
}

document.addEventListener("readystatechange", ready);