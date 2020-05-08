const DEEZER_CONTROL_HOTKEYS = 'DEEZER_CONTROL_HOTKEYS';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    let playPauseHotkeyInput = document.getElementById('play_pause_hotkey');
    let previousSongHotkeyInput = document.getElementById('previous_hotkey');
    let nextSongHotkeyInput = document.getElementById('next_hotkey');

    loadStoredData(
        playPauseHotkeyInput,
        previousSongHotkeyInput,
        nextSongHotkeyInput
    );

    let bufferPlayPause = [];
    let bufferPrevious = [];
    let bufferNext = [];
    
    document.getElementById('play_pause_hotkey').addEventListener('keydown', listenKeyDown.bind({ buffer: bufferPlayPause }));
    document.getElementById('previous_hotkey').addEventListener('keydown', listenKeyDown.bind({ buffer: bufferPrevious }));
    document.getElementById('next_hotkey').addEventListener('keydown', listenKeyDown.bind({ buffer: bufferNext }));
    document.getElementById('save_button').addEventListener('click', saveHotkeys.bind({ bufferPlayPause, bufferPrevious, bufferNext }));
});

function loadStoredData(playPauseHotkeyInput, previousSongHotkeyInput, nextSongHotkeyInput) {
    chrome.storage.sync.get([DEEZER_CONTROL_HOTKEYS], function(result) {
        if (result) {
            playPauseHotkeyInput.value = result[DEEZER_CONTROL_HOTKEYS].playPause.inputVal;
            previousSongHotkeyInput.value = result[DEEZER_CONTROL_HOTKEYS].previousSong.inputVal;
            nextSongHotkeyInput.value = result[DEEZER_CONTROL_HOTKEYS].nextSong.inputVal;
        }
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

    if (!playPauseHotkeyVal && !previousSongVal && !nextSongVal) {
        alert('Preencha as hotkeys!');
        return;
    }

    const data = {
        DEEZER_CONTROL_HOTKEYS: {
            playPause: { keyCodes: getKeyCodes(this.bufferPlayPause), inputVal: playPauseHotkeyVal },
            previousSong: { keyCodes: getKeyCodes(this.bufferPrevious), inputVal: previousSongHotkeyVal },
            nextSong: { keyCodes: getKeyCodes(this.bufferNext), inputVal: nextSongHotkeyVal },
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

function getKeyCodes(buffer) {
    const reducer = (keyCodes, currentValue) => {
        keyCodes.push(currentValue.keyCode);
        return keyCodes;
    };

    return buffer.reduce(reducer, []);
}