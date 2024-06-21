const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bpm = 117;
const beatDuration = 60 / bpm;
const measuresPerLoop = 8;
const beatsPerMeasure = 4;
const loopDuration = beatDuration * beatsPerMeasure * measuresPerLoop;

let tracks = {};
let isRunning = false;
let nextLoopStartTime = 0;

function createSilentAnchor() {
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * loopDuration, audioContext.sampleRate);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(audioContext.destination);
    return source;
}

let anchorTrack = createSilentAnchor();

async function loadAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

function scheduleTrack(track) {
    const source = audioContext.createBufferSource();
    source.buffer = track.buffer;
    source.loop = true;
    source.connect(audioContext.destination);
    
    const startTime = nextLoopStartTime;
    source.start(startTime);
    
    track.source = source;
    track.startTime = startTime;
    
    console.log(`${track.name} scheduled to start at ${startTime}`);
}

function stopTrack(track) {
    if (track.source) {
        track.source.stop();
        track.source = null;
    }
}

function toggleTrack(trackName) {
    if (!isRunning) startApp();
    
    const track = tracks[trackName];
    if (track.source) {
        stopTrack(track);
        track.isPlaying = false;
    } else {
        scheduleTrack(track);
        track.isPlaying = true;
    }
    updateUI(trackName);
}

function updateUI(trackName) {
    const element = document.querySelector(`.instrument[data-sound$="${trackName}.mp3"]`);
    const icon = element.querySelector('.icon');
    
    if (tracks[trackName].isPlaying) {
        icon.classList.add('pulsate');
        icon.classList.remove('hovering');
    } else {
        icon.classList.remove('pulsate');
        icon.classList.add('hovering');
    }
}

async function initializeApp() {
    const instruments = document.querySelectorAll('.instrument');
    for (const inst of instruments) {
        const soundUrl = inst.dataset.sound;
        const trackName = soundUrl.split('/')[1].split('.')[0];
        
        tracks[trackName] = {
            name: trackName,
            buffer: await loadAudio(soundUrl),
            isPlaying: false,
            source: null,
            startTime: 0
        };

        inst.addEventListener('click', () => toggleTrack(trackName));
        updateUI(trackName);
    }

    document.getElementById('start').addEventListener('click', startApp);
    document.getElementById('stop').addEventListener('click', stopApp);
}

function startApp() {
    if (isRunning) return;
    
    audioContext.resume();
    nextLoopStartTime = audioContext.currentTime;
    anchorTrack.start(nextLoopStartTime);
    isRunning = true;
    
    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;
    
    updateNextLoopStartTime();
}

function stopApp() {
    anchorTrack.stop();
    Object.values(tracks).forEach(stopTrack);
    isRunning = false;
    
    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
    
    Object.keys(tracks).forEach(updateUI);
}

function updateNextLoopStartTime() {
    nextLoopStartTime += loopDuration;
    setTimeout(updateNextLoopStartTime, (nextLoopStartTime - audioContext.currentTime) * 1000);
}

initializeApp();

// Set version number and display creation time
const versionNumber = '0.04';
const creationDate = new Date();
const versionText = `${versionNumber} - Created on ${creationDate.toLocaleString()}`;
document.getElementById('version-number').textContent = versionText;
