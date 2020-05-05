const NEXT_SONG = 'next-song';
const PREVIOUS_SONG = 'previous-song';
const PAUSE_PLAY = 'pause-play';
const F1_KEY = 112;
const F2_KEY = 113;
const F3_KEY = 114;

chrome.runtime.onMessage.addListener((msg => {
    switch (msg.type) {
        case 'keydown':
            if (msg.ctrlKey) {
                switch (msg.keyCode) {
                    case F1_KEY:
                        dispatchAction(PAUSE_PLAY);
                        break;
                    case F2_KEY:
                        dispatchAction(PREVIOUS_SONG);
                        break;
                    case F3_KEY:
                        dispatchAction(NEXT_SONG);
                        break;
                }
            }
    }
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