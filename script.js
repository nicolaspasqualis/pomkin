var workDuration = 25 * 60;
var breakDuration = 5 * 60;
var remaining = workDuration;
var interval;
var isWork = true; // flag to check if it's work or break time

function startPomodoro() {
    isWork = true;
    startTimer(workDuration);
}

function startBreak() {
    isWork = false;
    startTimer(breakDuration);
}

function startTimer(duration) {
    clearInterval(interval);
    remaining = duration;
    interval = setInterval(function() {
        remaining -= 10;
        if (remaining % 10 === 0) {
            displayTime(remaining);
        }

        if (remaining <= 0) {
            clearInterval(interval);
            alert(isWork ? "Work time is up! Take a break." : "Break is over! Back to work.");
        }
    }, 10000); // update every 10 seconds
}

function resetTimer() {
    clearInterval(interval);
    if (isWork) {
        displayTime(workDuration);
    } else {
        displayTime(breakDuration);
    }
}

function displayTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    
    var timeStr = padNumber(minutes) + ":" + padNumber(remainingSeconds);
    document.getElementById("timer").textContent = timeStr;
}

function padNumber(num) {
    return num < 10 ? "0" + num : num;
}

function changeDuration(type, change) {
    if (type === 'work') {
        workDuration += change * 60;
        document.getElementById('workDuration').textContent = workDuration / 60;
        if (isWork) displayTime(workDuration);
    } else {
        breakDuration += change * 60;
        document.getElementById('breakDuration').textContent = breakDuration / 60;
        if (!isWork) displayTime(breakDuration);
    }
}
