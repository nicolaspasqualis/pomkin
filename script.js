var timers = {}
var currentTimerId = 0;

var activeTimerId = null;
var isTimerRunning = false;
var startTime;

var getId = function () {
    var id = 0;
    return function () {
        id++;
        return id;
    }
}();

function adjustTime(timerId, adjustment) {
    if (isTimerRunning) return;

    timers[timerId].duration += adjustment * 60; 
    if(timers[timerId].duration < 0) timers[timerId].duration = 0; 

    updateDisplay(timerId);
}

function updateDisplay(timerId) {
    var minutes = Math.floor(timers[timerId].duration / 60);
    var seconds = timers[timerId].duration % 60;
    document.getElementById(timerId + '-display').innerText = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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
        var remainingTime = timers[timerId].duration - elapsedSeconds;
        document.getElementById(timerId + '-display').innerText = formatTime(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(activeTimerId);
            flickerScreen(function() {
                alert(timerId + " time is up!");
                stopTimer(timerId);
            });
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

function flickerScreen(callback) {
    var flickerCount = 0;
    var maxFlicker = 3;
    
    function performFlicker() {
        document.body.style.backgroundColor = flickerCount % 2 === 0 ? 'black' : 'white';
        document.body.style.color = flickerCount % 2 === 0 ? 'white' : 'black';

        flickerCount++;

        if (flickerCount < maxFlicker * 2) {
            setTimeout(performFlicker, 500);
        } else {
            callback && callback();
        }
    }

    performFlicker();
}

function saveLabel(timerId) {
    timers[timerId].label = document.getElementById(timerId + '-label-input').value;
}


function addNewTimer(label, duration) {
    var timerId = getId();
    var defaultTime = 25 * 60;

    var timerData = {
        label: label || 'Timer ' + timerId,
        duration: duration || defaultTime,
    }


    timers[timerId] = timerData;

    var timerHTML = (
        '<div class="timer-section" id="' + timerId + '">' +
            '<input type="text" class="timer-label-input" ' + 
                'id="' + timerId + '-label-input' + '" value="' + timerData.label + 
                '" onchange="saveLabel(\'' + timerId + '\')" />' +
            '<div class="margin-bottom">' +
                '<span id="' + timerId + '-display' + '" class="text-big">' + formatTime(timerData.duration)+ '</span>' +
                '<div class="pill float-right">' +
                    '<button class="time-minus-button" onclick="adjustTime(\'' + timerId + '\', -1)" id="' + timerId + '-minus' + '">-</button>' +
                    '<button class="time-plus-button" onclick="adjustTime(\'' + timerId + '\', 1)" id="' + timerId + '-plus' + '">+</button>' +
                '</div>' +
            '</div>' +
            '<button id="' + timerId + '-start-stop' + '" class="pill full-width" onclick="toggleTimer(\'' + timerId + '\')" >Start</button>' +
        '</div>'
    );

    document.getElementById('timers').insertAdjacentHTML('beforeend', timerHTML);
}

addNewTimer('Pomodoro', 25 * 60);
addNewTimer('Break', 5 * 60);
