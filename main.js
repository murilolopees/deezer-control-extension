function loadObserver() {
    if (isScriptLoaded(chrome.extension.getURL('scripts/dz_extension_observer.js'))) return;

    let s = document.createElement('script');
    s.src = chrome.extension.getURL('scripts/dz_extension_observer.js');
	(document.head || document.documentElement).appendChild(s);
	s.onload = function() { "use strict"; s.parentNode.removeChild(s); };
}

function isScriptLoaded(src)
{
    return document.querySelector('script[src="' + src + '"]') ? true : false;
}

function listenMessages() {
    function msgListener(msg, sender, sendResponse) {
        window.postMessage(msg);
    }

    chrome.runtime.onMessage.removeListener(msgListener);

    if (!chrome.runtime.onMessage.hasListeners()) {
        chrome.runtime.onMessage.addListener(msgListener);
    }
}

function ready(callback){
    if (document.readyState!='loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState == 'complete') callback();
    });
}

ready(function() {
    let buffer = [];

    const onKeyDown = function (event) {
        if (!buffer.includes(event.keyCode)) {
            buffer.push({
                key: event.key,
                keyCode: event.keyCode,
            });
        }

        chrome.runtime.sendMessage({ type: 'keydown', bufferKeys: buffer });
    }

    const onKeyUp = function (event) {
        buffer = buffer.filter(function(val) {
            return val.keyCode != event.keyCode;
        })
    }

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keyup', onKeyUp, true);

    loadObserver();
    listenMessages();
});