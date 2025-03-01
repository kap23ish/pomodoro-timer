// DOM Elements
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const statusElement = document.getElementById('status');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeToggle = document.getElementById('mode-toggle');
const sessionCountElement = document.getElementById('session-count');
const introScreen = document.getElementById('intro-screen');
const mainApp = document.getElementById('main-app');

// Timer variables
let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let sessionCount = 0;
let currentMode = 'work';

// Timer durations (in minutes)
const WORK_TIME = 25;
const REST_TIME = 5;

// Audio notification
const alarmSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

// Handle intro screen
document.addEventListener('DOMContentLoaded', () => {
    // Intro screen will automatically fade out after 2 seconds (via CSS animation)
    // We'll just make sure the main app is ready after the intro
    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 2500); // A little extra time to ensure the fade out is complete
});

// Initialize the timer display
function updateTimerDisplay() {
    minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;
}

// Start the timer
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    statusElement.textContent = currentMode === 'work' ? 'Focus time!' : 'Break time!';
    
    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                alarmSound.play();
                isRunning = false;
                
                if (currentMode === 'work') {
                    sessionCount++;
                    sessionCountElement.textContent = sessionCount;
                    toggleMode();
                } else {
                    toggleMode();
                }
                
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        
        updateTimerDisplay();
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    if (!isRunning) return;
    
    clearInterval(timer);
    isRunning = false;
    statusElement.textContent = 'Paused';
}

// Reset the timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    
    // Reset to the current mode's time
    setTimerMode(currentMode);
    statusElement.textContent = currentMode === 'work' ? 'Ready to focus!' : 'Ready for a break!';
}

// Toggle between work and rest modes
function toggleMode() {
    if (currentMode === 'work') {
        setTimerMode('rest');
    } else {
        setTimerMode('work');
    }
}

// Set timer mode (work or rest)
function setTimerMode(mode) {
    currentMode = mode;
    
    if (mode === 'work') {
        minutes = WORK_TIME;
        seconds = 0;
        modeToggle.checked = false;
        statusElement.textContent = 'Ready to focus!';
    } else {
        minutes = REST_TIME;
        seconds = 0;
        modeToggle.checked = true;
        statusElement.textContent = 'Take a break!';
    }
    
    updateTimerDisplay();
    
    // Reset timer if it's running
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startTimer();
    }
}

// Handle mode toggle change
function handleModeToggleChange() {
    if (modeToggle.checked) {
        setTimerMode('rest');
    } else {
        setTimerMode('work');
    }
}

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
modeToggle.addEventListener('change', handleModeToggleChange);

// Initialize the timer display
updateTimerDisplay(); 