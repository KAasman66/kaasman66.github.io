// Wrap the entire script in a try-catch block
try {
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
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            return await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error(`Error loading audio file ${url}:`, error);
            logToConsole(`Failed to load audio: ${url}`);
            throw error;
        }
    }

    // ... (rest of the functions remain the same)

    async function initializeApp() {
        try {
            const instruments = document.querySelectorAll('.instrument');
            for (const inst of instruments) {
                const soundUrl = inst.dataset.sound;
                const trackName = soundUrl.split('/')[1].split('.')[0];
                
                try {
                    tracks[trackName] = {
                        name: trackName,
                        buffer: await loadAudio(soundUrl),
                        isPlaying: false,
                        source: null,
                        startTime: 0
                    };

                    inst.addEventListener('click', () => toggleTrack(trackName));
                    updateUI(trackName);
                } catch (error) {
                    console.error(`Failed to initialize track ${trackName}:`, error);
                    logToConsole(`Failed to initialize track: ${trackName}`);
                }
            }

            document.getElementById('start').addEventListener('click', startApp);
            document.getElementById('stop').addEventListener('click', stopApp);

            logToConsole("App initialized");
        } catch (error) {
            console.error("Error during app initialization:", error);
            logToConsole("Error during app initialization. Check console for details.");
        }
    }

    // Call initializeApp and log any errors
    initializeApp().catch(error => {
        console.error("Failed to initialize app:", error);
        logToConsole("Failed to initialize app. Check console for details.");
    });

    // Set version number based on creation time
    const creationDate = new Date();
    const versionNumber = `${creationDate.getFullYear()}${(creationDate.getMonth() + 1).toString().padStart(2, '0')}${creationDate.getDate().toString().padStart(2, '0')}.${creationDate.getHours().toString().padStart(2, '0')}${creationDate.getMinutes().toString().padStart(2, '0')}`;
    const versionText = `${versionNumber}`;
    document.getElementById('version-number').textContent = versionText;

} catch (error) {
    console.error("Critical error in script execution:", error);
    logToConsole("Critical error in script execution. Check console for details.");
}

// Move logToConsole outside the main try-catch block to ensure it's always available
function logToConsole(message) {
    const console = document.getElementById('console');
    if (console) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        console.appendChild(logEntry);
        console.scrollTop = console.scrollHeight;
    } else {
        // If console element is not found, log to browser console
        console.warn("Console element not found. Logging to browser console:", message);
    }
}
