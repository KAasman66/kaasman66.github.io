
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
let masterLoop;

async function fetchSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await context.decodeAudioData(arrayBuffer);
}

function startMasterLoop() {
    const silenceBuffer = context.createBuffer(1, context.sampleRate * loopDuration, context.sampleRate);
    masterLoop = context.createBufferSource();
    masterLoop.buffer = silenceBuffer;
    masterLoop.loop = true;
    masterLoop.connect(context.destination);
    masterLoop.start(0);
    startTime = context.currentTime;
    nextStartTime = startTime + loopDuration;
    console.log('Master loop started at', startTime);
    console.log('Next start time:', nextStartTime);

    masterLoop.onended = () => {
        nextStartTime += loopDuration;
        console.log('Master loop ended. Next start time updated to:', nextStartTime);
        startMasterLoop();  // Restart the master loop
    };
}

document.querySelectorAll('.instrument').forEach(inst => {
    inst.addEventListener('click', async () => {
        const soundUrl = inst.dataset.sound;
        const instrument = soundUrl.split('/')[1].split('.')[0];
        const icon = inst.querySelector('.icon');
        
        if (loops[instrument]) {
            loops[instrument].stop();
            delete loops[instrument];
            icon.classList.remove('pulsate', 'waiting');
        } else {
            const buffer = await fetchSound(soundUrl);
            loops[instrument] = context.createBufferSource();
            loops[instrument].buffer = buffer;
            loops[instrument].loop = true;
            loops[instrument].connect(context.destination);

            if (!isPlaying) {
                startMasterLoop();
                isPlaying = true;
                loops[instrument].start(0);
                icon.classList.add('pulsate');
            } else {
                icon.classList.add('waiting');
                const waitForNextLoop = nextStartTime - context.currentTime;
                console.log('Instrument clicked:', instrument);
                console.log('Wait time for next loop:', waitForNextLoop);
                setTimeout(() => {
                    icon.classList.remove('waiting');
                    loops[instrument].start(nextStartTime);
                    icon.classList.add('pulsate');
                    console.log('Instrument started at', nextStartTime);
                }, waitForNextLoop * 1000);
            }
        }
    });
});

document.getElementById('stop').addEventListener('click', () => {
    Object.values(loops).forEach(loop => loop.stop());
    if (masterLoop) masterLoop.stop();
    loops = {};
    isPlaying = false;
    document.querySelectorAll('.icon').forEach(icon => {
        icon.classList.remove('pulsate', 'waiting');
    });
});

// Set version number to 0.02 and display creation time
const versionNumber = '0.02';
const creationDate = new Date();
const versionText = \`\${versionNumber} - Created on \${creationDate.toLocaleString()}\`;
document.getElementById('version-number').textContent = versionText;
