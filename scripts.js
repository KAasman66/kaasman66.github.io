const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const instruments = document.querySelectorAll('.instrument');
const stopButton = document.getElementById('stopButton');
const loopIndicator = document.getElementById('loopIndicator');

const BPM = 117;
const BEAT_DURATION = 60 / BPM;
const MEASURE_DURATION = BEAT_DURATION * 4;
const LOOP_DURATION = MEASURE_DURATION * 8;

let isPlaying = false;
let loopStartTime = 0;
let nextLoopStartTime = 0;
let activeInstruments = new Map();
let waitingInstruments = new Set();

async function loadSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

function scheduleLoop() {
    const currentTime = audioContext.currentTime;

    if (currentTime >= nextLoopStartTime) {
        loopStartTime = nextLoopStartTime;
        nextLoopStartTime = loopStartTime + LOOP_DURATION;

        activeInstruments.forEach((instrument, element) => {
            if (instrument.source) instrument.source.stop();
            startInstrument(element, instrument.buffer);
        });

        waitingInstruments.forEach(element => {
            const buffer = activeInstruments.get(element).buffer;
            startInstrument(element, buffer);
            waitingInstruments.delete(element);
            element.classList.remove('waiting');
            element.classList.add('active');
        });

        updateLoopIndicator();
    }

    if (isPlaying) {
        requestAnimationFrame(scheduleLoop);
    }
}

function startInstrument(element, buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(loopStartTime);
    activeInstruments.set(element, { buffer, source });
}

function updateLoopIndicator() {
    const dots = loopIndicator.children;
    const loopProgress = (audioContext.currentTime - loopStartTime) / LOOP_DURATION;
    const activeDotIndex = Math.floor(loopProgress * dots.length) % dots.length;

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === activeDotIndex);
    }

    if (isPlaying) {
        requestAnimationFrame(updateLoopIndicator);
    }
}

instruments.forEach(instrument => {
    instrument.addEventListener('click', async () => {
        if (!isPlaying) {
            isPlaying = true;
            loopStartTime = audioContext.currentTime;
            nextLoopStartTime = loopStartTime + LOOP_DURATION;
            scheduleLoop();
            updateLoopIndicator();
        }

        if (activeInstruments.has(instrument)) {
            activeInstruments.get(instrument).source.stop();
            activeInstruments.delete(instrument);
            instrument.classList.remove('active', 'waiting');
        } else {
            const soundUrl = instrument.dataset.sound;
            const buffer = await loadSound(soundUrl);

            if (audioContext.currentTime < nextLoopStartTime) {
                waitingInstruments.add(instrument);
                instrument.classList.add('waiting');
            } else {
                startInstrument(instrument, buffer);
                instrument.classList.add('active');
            }
        }
    });
});

stopButton.addEventListener('click', () => {
    isPlaying = false;
    activeInstruments.forEach(instrument => instrument.source.stop());
    activeInstruments.clear();
    waitingInstruments.clear();
    instruments.forEach(instrument => instrument.classList.remove('active', 'waiting'));
    loopIndicator.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
});
