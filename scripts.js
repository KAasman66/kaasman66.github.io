const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const instruments = document.querySelectorAll('.instrument');
const stopButton = document.getElementById('stopButton');
const loopIndicator = document.getElementById('loopIndicator');
const versionInfo = document.getElementById('versionInfo');

const BPM = 117;
const BEAT_DURATION = 60 / BPM;
const MEASURE_DURATION = BEAT_DURATION * 4;
const LOOP_DURATION = MEASURE_DURATION * 8;

let isPlaying = false;
let loopStartTime = 0;
let nextLoopStartTime = 0;
let activeInstruments = new Map();
let waitingInstruments = new Set();
let schedulerInterval;

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
    }
}

function startInstrument(element, buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(nextLoopStartTime);
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

function stopAllSounds() {
    isPlaying = false;
    clearInterval(schedulerInterval);
    activeInstruments.forEach(instrument => {
        if (instrument.source) instrument.source.stop();
    });
    activeInstruments.clear();
    waitingInstruments.clear();
    instruments.forEach(instrument => instrument.classList.remove('active', 'waiting'));
    loopIndicator.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
}

instruments.forEach(instrument => {
    instrument.addEventListener('click', async () => {
        try {
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            if (activeInstruments.has(instrument)) {
                const activeInstrument = activeInstruments.get(instrument);
                if (activeInstrument.source) activeInstrument.source.stop();
                activeInstruments.delete(instrument);
                instrument.classList.remove('active', 'waiting');
                
                if (activeInstruments.size === 0 && waitingInstruments.size === 0) {
                    stopAllSounds();
                }
            } else {
                const soundUrl = instrument.dataset.sound;
                const buffer = await loadSound(soundUrl);

                if (!isPlaying) {
                    isPlaying = true;
                    loopStartTime = audioContext.currentTime;
                    nextLoopStartTime = loopStartTime;
                    schedulerInterval = setInterval(scheduleLoop, 20);
                    updateLoopIndicator();
                }

                if (audioContext.currentTime < nextLoopStartTime) {
                    waitingInstruments.add(instrument);
                    instrument.classList.add('waiting');
                } else {
                    startInstrument(instrument, buffer);
                    instrument.classList.add('active');
                }
                activeInstruments.set(instrument, { buffer });
            }
        } catch (error) {
            console.error('Error playing instrument:', error);
            alert('There was an error playing the instrument. Please try again.');
        }
    });
});

stopButton.addEventListener('click', stopAllSounds);

// Set version info and what's new
const version = "1.1";
const whatsNew = "Improved error handling, larger icons, and enhanced layout";
versionInfo.innerHTML = `Version ${version}<br>What's new: ${whatsNew}`;

// Log version info to console
console.log(`Music Sync App - Version ${version}`);
console.log(`What's new: ${whatsNew}`);
