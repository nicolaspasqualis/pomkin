var timers = {}
var currentTimerId = 0;

var activeTimerId = null;
var isTimerRunning = false;
var startTime;

function setUrl(newUrl) {
    window.location.href = newUrl;
}

function generateUrlForTimers(timers) {
    var timersString = JSON.stringify(timers);
    var encodedTimers = encodeURIComponent(timersString);
    
    var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    var newUrl = baseUrl + "#timers=" + encodedTimers;
    
    return newUrl;
}

function getTimersFromUrl() {
    var search = window.location.hash.substring(1); // Remove the leading '#'
    var vars = search.split("&");
    
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === "timers") {
            var decodedTimers = decodeURIComponent(pair[1]);
            return JSON.parse(decodedTimers);
        }
    }
    return null;
}

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
        '<div class="container pb3" id="' + timerId + '">' +
            '<input type="text" class="row" ' + 
                'id="' + timerId + '-label-input' + '" value="' + timerData.label + 
                '" onchange="saveLabel(\'' + timerId + '\')" />' +
            '<div class="row pb1">' +
                '<div class="timer-display col-3 pl0 text-big" id="' + timerId + '-display' + '">' + formatTime(timerData.duration)+ '</div>' +
                '<div class="p0 col-offset-6 col-3">' +
                    '<div class="pill pull-right mt1">' +
                        '<button class="time-minus-button" onclick="adjustTime(\'' + timerId + '\', -1)" id="' + timerId + '-minus' + '">−</button>' +
                        '<button class="time-plus-button" onclick="adjustTime(\'' + timerId + '\', 1)" id="' + timerId + '-plus' + '">+</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="row"><button id="' + timerId + '-start-stop' + '" class="col-12 pill full-width line-height-200" onclick="toggleTimer(\'' + timerId + '\')" >Start</button></div>' +
        '</div>'
    );

    document.getElementById('timers').insertAdjacentHTML('beforeend', timerHTML);
}

function showSaveModal() {
    var url = generateUrlForTimers(timers);
    setUrl(url);
    document.getElementById('save-modal-url').innerText = url.substring(0, 35) + "...";
    document.getElementById('save-modal-url').href = url;
    document.getElementById('save-modal').classList.remove('hidden');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");
}

var urlTimers = getTimersFromUrl();

if (urlTimers) {
    timers = urlTimers;
    for (var id in timers) {
        addNewTimer(timers[id].label, timers[id].duration);
    }
} else {
    addNewTimer('Pomodoro', 25 * 60);
    addNewTimer('Break', 5 * 60);
}