var timers = {
    'pomodoro': 25 * 60,
    'break': 5 * 60
};

var activeTimerId = null;
var isTimerRunning = false;
var startTime;

function adjustTime(timerId, adjustment) {
    if (isTimerRunning) return;

    timers[timerId] += adjustment * 60; 
    if(timers[timerId] < 0) timers[timerId] = 0; 

    updateDisplay(timerId);
}

function updateDisplay(timerId) {
    var minutes = Math.floor(timers[timerId] / 60);
    var seconds = timers[timerId] % 60;
    document.getElementById(timerId).innerText = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function toggleTimer(timerId) {
    if (isTimerRunning) {
        stopTimer(timerId);
    } else {
        startTimer(timerId);
    }
}

function startTimer(timerId) {
    isTimerRunning = true;
    document.getElementById(timerId + '-start-stop').innerText = 'Stop';
    document.getElementById(timerId + '-minus').disabled = true;
    document.getElementById(timerId + '-plus').disabled = true;

    startTime = new Date();

    activeTimerId = setInterval(function() {
        var elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
        var remainingTime = timers[timerId] - elapsedSeconds;
        document.getElementById(timerId).innerText = formatTime(remainingTime);

        if(remainingTime <= 0) {
            clearInterval(activeTimerId);
            alert(timerId + " time is up!");
            stopTimer(timerId);
        }
    }, 1000);
}

function stopTimer(timerId) {
    isTimerRunning = false;
    document.getElementById(timerId + '-start-stop').innerText = 'Start';
    document.getElementById(timerId + '-minus').disabled = false;
    document.getElementById(timerId + '-plus').disabled = false;
    
    clearInterval(activeTimerId);
    activeTimerId = null;
    updateDisplay(timerId)
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Initialize display
updateDisplay('pomodoro');
updateDisplay('break');
