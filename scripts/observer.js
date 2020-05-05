const NEXT_SONG = 'next-song';
const PREVIOUS_SONG = 'previous-song';
const PAUSE_PLAY = 'pause-play';

window.addEventListener('message', function(ev) {
    if (typeof dzPlayer === 'undefined') {
        return;
    }

    switch (ev.data) {
        case PAUSE_PLAY: 
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