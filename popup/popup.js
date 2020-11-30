const DEEZER_CONTROL_HOTKEYS = 'DEEZER_CONTROL_HOTKEYS';
const defaultLang = 'en-US';

langLoaded = null;

document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    let bufferPlayPause = [];
    let bufferPrevious = [];
    let bufferNext = [];

    initLang(navigator.language);
    loadStoredData(bufferPlayPause, bufferPrevious, bufferNext);
});

function initEvents(bufferPlayPause, bufferPrevious, bufferNext) {
    document.getElementById('play_pause_hotkey').addEventListener('keydown', listenKeyDown.bind({ buffer: bufferPlayPause }));
    document.getElementById('previous_hotkey').addEventListener('keydown', listenKeyDown.bind({ buffer: bufferPrevious }));
    document.getElementById('next_hotkey').addEventListener('keydown', listenKeyDown.bind({ buffer: bufferNext }));
    document.getElementById('save_button').addEventListener('click', saveHotkeys.bind({ bufferPlayPause, bufferPrevious, bufferNext }));
}

function initLang(lang) {
    loadLang(lang).then(lang => {
        langLoaded = lang;
        renderLabels(lang);
    }).catch(err => {
        initLangDefault();
    });
}

function initLangDefault() {
    loadLang(defaultLang).then((lang) => {
        langLoaded = lang;
        renderLabels(lang);
    });
}

function renderLabels(lang) {
    document.getElementById('play_pause_label').innerHTML = lang.playPauseLabel;
    document.getElementById('previous_song_label').innerHTML = lang.previousSongLabel;
    document.getElementById('next_song_label').innerHTML = lang.nextSongLabel;
    document.getElementById('save_button').innerHTML = lang.saveButtonLabel;
}

async function loadLang(param) {
    const response = await fetch(`../lang/${param}.json`);
    return await response.json();
}

function loadStoredData(bufferPlayPause, bufferPrevious, bufferNext) {
    let playPauseHotkeyInput = document.getElementById('play_pause_hotkey');
    let previousSongHotkeyInput = document.getElementById('previous_hotkey');
    let nextSongHotkeyInput = document.getElementById('next_hotkey');

    return chrome.storage.sync.get([DEEZER_CONTROL_HOTKEYS], function(result) {
        if (result[DEEZER_CONTROL_HOTKEYS]) {
            playPauseHotkeyInput.value = result[DEEZER_CONTROL_HOTKEYS].playPause.inputVal;
            previousSongHotkeyInput.value = result[DEEZER_CONTROL_HOTKEYS].previousSong.inputVal;
            nextSongHotkeyInput.value = result[DEEZER_CONTROL_HOTKEYS].nextSong.inputVal;
            
            bufferPlayPause = result[DEEZER_CONTROL_HOTKEYS].playPause.keyCodes.map((eachKey) => {
                return {
                    key: eachKey.key,
                    keyCode: eachKey.keyCode,
                }
            });
    
            bufferPrevious = result[DEEZER_CONTROL_HOTKEYS].previousSong.keyCodes.map((eachKey) => {
                return {
                    key: eachKey.key,
                    keyCode: eachKey.keyCode,
                }
            });
    
            bufferNext = result[DEEZER_CONTROL_HOTKEYS].nextSong.keyCodes.map((eachKey) => {
                return {
                    key: eachKey.key,
                    keyCode: eachKey.keyCode,
                }
            });
        }

        initEvents(bufferPlayPause, bufferPrevious, bufferNext);
    });
}

function listenKeyDown(event) {
    event.preventDefault();

    let key = event.key;
    let stop = false;

    switch(event.keyCode)
    {
        case 8:
        case 46:
            this.buffer.pop();
            event.srcElement.value = getInputText(this.buffer);
            stop = true;
            break;
        default:
            break;
    }

    if (stop) {
        return;
    }

    const currentTime = Date.now();

    this.buffer.push({
        key,
        keyCode: event.keyCode
    });

    lastKeyTime = currentTime;

    event.srcElement.value = getInputText(this.buffer);
}

function saveHotkeys() {
    const playPauseHotkeyVal = document.getElementById('play_pause_hotkey').value;
    const previousSongHotkeyVal = document.getElementById('previous_hotkey').value;
    const nextSongHotkeyVal = document.getElementById('next_hotkey').value;

    if (!playPauseHotkeyVal && !previousSongHotkeyVal && !nextSongHotkeyVal) {
        alert(langLoaded.validationError);
        return;
    }

    const data = {
        DEEZER_CONTROL_HOTKEYS: {
            playPause: { keyCodes: this.bufferPlayPause, inputVal: playPauseHotkeyVal },
            previousSong: { keyCodes: this.bufferPrevious, inputVal: previousSongHotkeyVal },
            nextSong: { keyCodes: this.bufferNext, inputVal: nextSongHotkeyVal },
        }
    }

    chrome.storage.sync.set(data, function() {
        window.close();
    });
}

function getInputText(buffer) {
    const reducer = (inputVal, currentValue) => {
        return inputVal + `${currentValue.key} + `;
    };
    
    return buffer.reduce(reducer, '').slice(0, -3);
}