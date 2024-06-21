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
                startTime = context.currentTime;
                nextStartTime = startTime + loopDuration;
                isPlaying = true;
                loops[instrument].start(0);
                icon.classList.add('pulsate');
            } else {
                icon.classList.add('waiting');
                const waitForNextLoop = nextStartTime - context.currentTime;
                setTimeout(() => {
                    icon.classList.remove('waiting');
                    loops[instrument].start(nextStartTime);
                    icon.classList.add('pulsate');
                }, waitForNextLoop * 1000);
            }
        }
    });
});

async function fetchSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await context.decodeAudioData(arrayBuffer);
}

document.getElementById('stop').addEventListener('click', () => {
    Object.values(loops).forEach(loop => loop.stop());
    loops = {};
    isPlaying = false;
    document.querySelectorAll('.icon').forEach(icon => {
        icon.classList.remove('pulsate', 'waiting');
    });
});

// Set version number based on creation date
const creationDate = new Date();
const versionNumber = `${creationDate.getFullYear()}.${creationDate.getMonth() + 1}.${creationDate.getDate()}`;
document.getElementById('version-number').textContent = versionNumber;
