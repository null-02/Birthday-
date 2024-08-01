document.addEventListener('DOMContentLoaded', () => {
    const btnNext = document.getElementById('btn-next');
    const btnWish = document.getElementById('btn-wish');
    const blowText = document.getElementById('blow-text');
    
    const messageContainer = document.getElementById('message-container');
    const wishContainer = document.getElementById('wish-container');
    const presentContainer = document.getElementById('present-container');
    const flame = document.getElementById('flame');
    
    let microphoneActive = false;

    btnNext.addEventListener('click', () => {
        messageContainer.style.display = 'none';
        wishContainer.style.display = 'block';
    });
    
    btnWish.addEventListener('click', () => {
        wishContainer.style.display = 'none';
        presentContainer.style.display = 'block';
        startMicrophoneDetection(); // Start microphone detection when cake appears
    });
    
    blowText.addEventListener('click', () => {
        if (microphoneActive) {
            blowCandle();
        } else {
            console.log('Microphone detection is not active yet.');
        }
    });

    function blowCandle() {
        flame.style.opacity = 0; // Simulate blowing out the candle
        setTimeout(() => {
            flame.style.display = 'none'; // Hide the flame completely after the effect
        }, 1000);
    }

    function startMicrophoneDetection() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);
                
                microphone.connect(analyser);
                analyser.connect(audioContext.destination);
                
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                function detectBlow() {
                    analyser.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

                    // Adjust this threshold according to your environment
                    const threshold = 50;
                    
                    if (average > threshold) {
                        blowCandle();
                    }

                    requestAnimationFrame(detectBlow);
                }
                
                detectBlow();
                microphoneActive = true;
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    }
});
