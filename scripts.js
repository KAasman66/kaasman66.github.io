const context = new (window.AudioContext || window.webkitAudioContext)();
let loops = {};
let isPlaying = false;
const bpm = 117;
const beatDuration = 60 / bpm;
const measureDuration = beatDuration * 4; // assuming 4 beats per measure
let startTime;

document.querySelector('#play').addEventListener('click', () => {
    if (!isPlaying) {
        startTime = context.currentTime;
        Object.values(loops).forEach(loop => loop.start(0, startTime % loop.buffer.duration));
        isPlaying = true;
        toggleControls();
    }
});

document.querySelector('#stop').addEventListener('click', () => {
    if (isPlaying) {
        Object.values(loops).forEach(loop => loop.stop(0));
        isPlaying = false;
        toggleControls();
        stopPulsate();
    }
});

document.querySelectorAll('.instrument').forEach(inst => {
    inst.addEventListener('click', async () => {
        const soundUrl = inst.dataset.sound;
        const instrument = soundUrl.split('/')[1].split('.')[0];
        
        if (loops[instrument]) {
            loops[instrument].stop();
            delete loops[instrument];
            inst.querySelector('.icon').classList.remove('pulsate');
        } else {
            const buffer = await fetchSound(soundUrl);
            loops[instrument] = context.createBufferSource();
            loops[instrument].buffer = buffer;
            loops[instrument].loop = true;
            loops[instrument].connect(context.destination);

            if (isPlaying) {
                loops[instrument].start(0, startTime % buffer.duration);
            }

            inst.querySelector('.icon').classList.add('pulsate');
        }
    });
});

async function fetchSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await context.decodeAudioData(arrayBuffer);
}

function toggleControls() {
    document.querySelector('#play').disabled = isPlaying;
    document.querySelector('#stop').disabled = !isPlaying;
}

function stopPulsate() {
    document.querySelectorAll('.icon').forEach(icon => icon.classList.remove('pulsate'));
}

document.getElementById('creation-date').innerText = new Date().toLocaleString();
