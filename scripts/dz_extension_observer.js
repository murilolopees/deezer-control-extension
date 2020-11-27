const NEXT_SONG = 'nextSong';
const PREVIOUS_SONG = 'previousSong';
const PLAY_PAUSE = 'playPause';

window.addEventListener('message', function(ev) {
    if (typeof dzPlayer === 'undefined') {
        return;
    }

    switch (ev.data) {
        case PLAY_PAUSE: 
            if (window.dzPlayer.isPlaying()) {
                dzPlayer.control.pause();
            } else {
                dzPlayer.control.play();
            }
            break;
        case NEXT_SONG:
            dzPlayer.control.nextSong();
            break;
        case PREVIOUS_SONG:
            dzPlayer.control.prevSong();
            break;
    }
}, true);