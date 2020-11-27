const DEEZER_CONTROL_HOTKEYS = 'DEEZER_CONTROL_HOTKEYS';

chrome.runtime.onMessage.addListener((msg => {
    chrome.storage.sync.get([DEEZER_CONTROL_HOTKEYS], function(result) {
        if (!result[DEEZER_CONTROL_HOTKEYS]) {
            return;
        }

        switch (msg.type) {
            case 'keydown':
                Object.keys(result[DEEZER_CONTROL_HOTKEYS]).forEach(function(action) {
                    if (JSON.stringify(msg.bufferKeys) === JSON.stringify(result[DEEZER_CONTROL_HOTKEYS][action].keyCodes)) {
                        dispatchAction(action);
                    }
                });
                break;
        }
    });
}));

function dispatchAction(action) {
    getDeezerTab().then((tabId) => {
        if (tabId) {
            chrome.tabs.sendMessage(tabId, action);
        }
    });
}

function getDeezerTab() {
    return new Promise((resolve, reject) => {
        return chrome.tabs.query({}, function(tabs) {
            let tab = tabs.filter((tab) => {
                return tab.url && tab.url.includes('deezer.com');
            });

            resolve(tab.shift().id);
        });
    });
}