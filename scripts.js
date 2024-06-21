
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bpm = 117;
const beatDuration = 60 / bpm;
const measuresPerLoop = 8;
const beatsPerMeasure = 4;
const loopDuration = beatDuration * beatsPerMeasure * measuresPerLoop;

let tracks = {};
let isRunning = false;
let nextLoopStartTime = 0;
let currentBeat = 0;

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
    track.status = 'playing';
    
    logToConsole(`Track ${track.name} scheduled to start at ${startTime.toFixed(2)}`);
}

function stopTrack(track) {
    if (track.source) {
        track.source.stop();
        track.source = null;
        track.status = 'stopped';
        logToConsole(`Track ${track.name} stopped`);
    }
}

function toggleTrack(trackName) {
    if (!isRunning) startApp();
    
    const track = tracks[trackName];
    if (track.status === 'playing' || track.status === 'waiting') {
        stopTrack(track);
    } else {
        track.status = 'waiting';
        updateCountdown(track);
    }
    updateUI(trackName);
}

function updateUI(trackName) {
    const element = document.querySelector(`.instrument[data-sound$="${trackName}.mp3"]`);
    const icon = element.querySelector('.icon');
    const countdown = element.querySelector('.countdown');
    
    icon.classList.remove('pulsate', 'hovering');
    countdown.textContent = '';

    switch (tracks[trackName].status) {
        case 'playing':
            icon.classList.add('pulsate');
            break;
        case 'waiting':
            icon.classList.add('hovering');
            break;
    }
}

function updateCountdown(track) {
    const timeUntilStart = nextLoopStartTime - audioContext.currentTime;
    const element = document.querySelector(`.instrument[data-sound$="${track.name}.mp3"]`);
    const countdown = element.querySelector('.countdown');
    
    if (timeUntilStart > 0) {
        countdown.textContent = timeUntilStart.toFixed(1);
        requestAnimationFrame(() => updateCountdown(track));
    } else {
        countdown.textContent = '';
        scheduleTrack(track);
        updateUI(track.name);
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
            status: 'stopped',
            source: null,
            startTime: 0
        };

        inst.addEventListener('click', () => toggleTrack(trackName));
        updateUI(trackName);
    }

    document.getElementById('stop').addEventListener('click', stopApp);

    logToConsole(`Program created at: ${new Date().toLocaleString()}`);
}

function startApp() {
    if (isRunning) return;
    
    audioContext.resume();
    nextLoopStartTime = audioContext.currentTime;
    anchorTrack.start(nextLoopStartTime);
    isRunning = true;
    
    document.getElementById('stop').disabled = false;
    
    updateNextLoopStartTime();
    updateBeatCounter();
    logToConsole("App started");
}

function stopApp() {
    anchorTrack.stop();
    Object.values(tracks).forEach(stopTrack);
    isRunning = false;
    
    document.getElementById('stop').disabled = true;
    
    Object.keys(tracks).forEach(updateUI);
    logToConsole("App stopped");

    currentBeat = 0;
    updateBeatCounter();
    updateMeasureIndicator();
}

function updateNextLoopStartTime() {
    nextLoopStartTime += loopDuration;
    setTimeout(updateNextLoopStartTime, (nextLoopStartTime - audioContext.currentTime) * 1000);
}

function updateBeatCounter() {
    if (!isRunning) return;

    currentBeat = (currentBeat % 8) + 1;
    const beatCounter = document.querySelector('.beat-counter');
    beatCounter.textContent = currentBeat;
    beatCounter.style.opacity = 1;
    beatCounter.style.transform = 'translate(-50%, -50%) scale(1.2)';

    updateMeasureIndicator();

    setTimeout(() => {
        beatCounter.style.opacity = 0;
        beatCounter.style.transform = 'translate(-50%, -50%) scale(1)';
    }, beatDuration * 1000 / 2);

    setTimeout(updateBeatCounter, beatDuration * 1000);
}

function updateMeasureIndicator() {
    const dots = document.querySelectorAll('.measure-indicator .dot');
    dots.forEach((dot, index) => {
        if (index === currentBeat - 1) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function logToConsole(message) {
    const console = document.getElementById('console');
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    console.appendChild(logEntry);
    console.scrollTop = console.scrollHeight;
}

initializeApp();

// Set version number based on creation time
const creationDate = new Date();
const versionNumber = `${creationDate.getFullYear()}${(creationDate.getMonth() + 1).toString().padStart(2, '0')}${creationDate.getDate().toString().padStart(2, '0')}.${creationDate.getHours().toString().padStart(2, '0')}${creationDate.getMinutes().toString().padStart(2, '0')}`;
document.getElementById('version').textContent = `Version: ${versionNumber}`;
