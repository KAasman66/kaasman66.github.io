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
    console.log('Loading sound:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log('Sound loaded successfully:', url);
        return audioBuffer;
    } catch (error) {
        console.error('Error loading sound:', url, error);
        throw error;
    }
}

function playSound(buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
    return source;
}

instruments.forEach(instrument => {
    instrument.addEventListener('click', async () => {
        console.log('Instrument clicked:', instrument.dataset.sound);
        try {
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const soundUrl = instrument.dataset.sound;
            const buffer = await loadSound(soundUrl);
            
            // Play the sound immediately when clicked
            playSound(buffer);
            
            instrument.classList.add('active');
            setTimeout(() => instrument.classList.remove('active'), 500);

            console.log('Sound played successfully');
        } catch (error) {
            console.error('Error playing instrument:', error);
            alert('There was an error playing the instrument. Please check the console for details.');
        }
    });
});

stopButton.addEventListener('click', () => {
    console.log('Stop button clicked');
    // Add any stop functionality here if needed
});

// Set version info and what's new
const version = "1.2";
const whatsNew = "Added immediate sound playback on click, improved error handling and debugging";
versionInfo.innerHTML = `Version ${version}<br>What's new: ${whatsNew}`;

// Log version info to console
console.log(`Music Sync App - Version ${version}`);
console.log(`What's new: ${whatsNew}`);

// Check if audio files are accessible
instruments.forEach(instrument => {
    const soundUrl = instrument.dataset.sound;
    fetch(soundUrl)
        .then(response => {
            if (!response.ok) {
                console.error(`Error loading ${soundUrl}: ${response.status} ${response.statusText}`);
            } else {
                console.log(`${soundUrl} is accessible`);
            }
        })
        .catch(error => console.error(`Error checking ${soundUrl}:`, error));
});
