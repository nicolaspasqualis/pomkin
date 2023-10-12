var duration = 25 * 60; // 25 minutes in seconds
var remaining = duration;
var interval;

function startPomodoro() {
    clearInterval(interval);
    interval = setInterval(function() {
        remaining -= 1;
        displayTime(remaining);

        if (remaining <= 0) {
            clearInterval(interval);
            alert("Pomodoro complete! Take a break.");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(interval);
    remaining = duration;
    displayTime(remaining);
}

function displayTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds % 60;
    
    var timeStr = padNumber(minutes) + ":" + padNumber(seconds);
    document.getElementById("timer").textContent = timeStr;
}

function padNumber(num) {
    return num < 10 ? "0" + num : num;
}
