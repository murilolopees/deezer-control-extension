function ready() {
    if (document.readyState !== "complete") {
		return;
    }

    document.addEventListener('keydown', function(event) {
        chrome.runtime.sendMessage({ type: 'keydown', keyCode: event.keyCode, ctrlKey: event.ctrlKey });
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