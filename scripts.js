const context = new (window.AudioContext || window.webkitAudioContext)();
let loops = {};
let isPlaying = false;
const bpm = 117;
const beatDuration = 60 / bpm;
const measureDuration = beatDuration * 4; // assuming 4 beats per measure
const numMeasures = 8;
const loopDuration = measureDuration * numMeasures;
let startTime;
let nextStartTime;
let animationInterval;

document.querySelectorAll('.instrument').forEach(inst => {
    inst.addEventListener('click', async () => {
        const soundUrl = inst.dataset.sound;
        const instrument = soundUrl.split('/')[1].split('.')[0];
        const icon = inst.querySelector('.icon');
        
        if (loops[instrument]) {
            icon.classList.remove('pulsate', 'waiting');
            delete loops[instrument];
        } else {
            const buffer = await fetchSound(soundUrl);
            loops[instrument] = {
                buffer: buffer,
                source: null
            };

            icon.classList.add('waiting');
            
            if (!isPlaying) {
                startPlaying();
            }
        }
    });
});

async function fetchSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await context.decodeAudioData(arrayBuffer);
}

function startPlaying() {
    startTime = context.currentTime;
    nextStartTime = startTime + loopDuration;
    isPlaying = true;
    playAllLoops();
    animateMeter();
}

function playAllLoops() {
    for (let instrument in loops) {
        if (loops[instrument].source) {
            loops[instrument].source.stop();
        }
        loops[instrument].source = context.createBufferSource();
        loops[instrument].source.buffer = loops[instrument].buffer;
        loops[instrument].source.loop = true;
        loops[instrument].source.connect(context.destination);
        loops[instrument].source.start(nextStartTime);
        
        const icon = document.querySelector(`.instrument[data-sound*="${instrument}"] .icon`);
        icon.classList.remove('waiting');
        icon.classList.add('pulsate');
    }
    nextStartTime += loopDuration;
}

function animateMeter() {
    const dots = document.querySelectorAll('#meter .dot');
    let index = 0;
    clearInterval(animationInterval);
    animationInterval = setInterval(() => {
        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[index].style.opacity = '1';
        index = (index + 1) % dots.length;
        
        if (index === 0) {
            playAllLoops();
        }
    }, loopDuration / dots.length * 1000);
}

document.getElementById('stop').addEventListener('click', () => {
    isPlaying = false;
    clearInterval(animationInterval);
    for (let instrument in loops) {
        if (loops[instrument].source) {
            loops[instrument].source.stop();
        }
        const icon = document.querySelector(`.instrument[data-sound*="${instrument}"] .icon`);
        icon.classList.remove('pulsate', 'waiting');
    }
    loops = {};
    document.querySelectorAll('#meter .dot').forEach(dot => dot.style.opacity = '0.5');
});

document.getElementById('creation-date').innerText = new Date().toLocaleString();
