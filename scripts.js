const context = new (window.AudioContext || window.webkitAudioContext)();
let loops = {};

document.querySelectorAll('.instrument img').forEach(img => {
    img.addEventListener('click', () => {
        const choices = img.nextElementSibling;
        choices.style.display = choices.style.display === 'block' ? 'none' : 'block';
    });
});

document.querySelectorAll('.choices button').forEach(button => {
    button.addEventListener('click', async () => {
        const instrument = button.closest('.instrument').dataset.instrument;
        const soundUrl = button.dataset.sound;
        
        if (loops[instrument]) {
            loops[instrument].stop();
            delete loops[instrument];
        }

        const buffer = await fetchSound(soundUrl);
        const loop = playLoop(buffer);
        loops[instrument] = loop;
    });
});

async function fetchSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await context.decodeAudioData(arrayBuffer);
}

function playLoop(buffer) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(context.destination);
    source.start(0, context.currentTime % buffer.duration);
    return source;
}