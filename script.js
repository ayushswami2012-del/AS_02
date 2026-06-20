const display = document.getElementById("display");
const millisecondsDisplay = document.getElementById("milliseconds");

const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");

const eventMessage = document.getElementById("eventMessage");

const laps = document.getElementById("laps");
const clearLapsBtn = document.getElementById("clearLaps");

const lapCount = document.getElementById("lapCount");
const fastestLap = document.getElementById("fastestLap");
const slowestLap = document.getElementById("slowestLap");

let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let lapCounter = 1;
let lapTimes = [];

function formatTime(ms){

    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function updateDisplay(){

    display.textContent = formatTime(elapsedTime);

    millisecondsDisplay.textContent =
        String(elapsedTime % 1000).padStart(3,"0");
}

function startPause(){

    if(!isRunning){

        startTime = Date.now() - elapsedTime;

        timer = setInterval(() => {

            elapsedTime = Date.now() - startTime;
            updateDisplay();

        },10);

        startPauseBtn.innerHTML =
        `<i class="fa-solid fa-pause"></i> Pause`;

        startPauseBtn.classList.remove("start");
        startPauseBtn.classList.add("lap");

        isRunning = true;
    }
    else{

        clearInterval(timer);

        startPauseBtn.innerHTML =
        `<i class="fa-solid fa-play"></i> Start`;

        startPauseBtn.classList.remove("lap");
        startPauseBtn.classList.add("start");

        isRunning = false;
    }
}

function resetTimer(){

    clearInterval(timer);

    elapsedTime = 0;
    lapCounter = 1;
    lapTimes = [];
    isRunning = false;

    laps.innerHTML = "";

    lapCount.textContent = "0";
    fastestLap.textContent = "--";
    slowestLap.textContent = "--";

    startPauseBtn.innerHTML =
    `<i class="fa-solid fa-play"></i> Start`;

    startPauseBtn.classList.remove("lap");
    startPauseBtn.classList.add("start");

    updateDisplay();
}

function addLap() {

    if (!isRunning) return;

    lapTimes.push(elapsedTime);

    const note =
        eventMessage.value.trim() || "No Event";

    const li = document.createElement("li");

    li.innerHTML = `
        <div class="lap-info">
            <strong>🏁 Lap ${lapCounter}</strong>
            <span class="lap-event">
                ${note}
            </span>
        </div>

        <span class="lap-time">
            ${formatTime(elapsedTime)}
        </span>
    `;

    laps.prepend(li);

    eventMessage.value = "";

    lapCounter++;

    updateStats();
}

function updateStats(){

    lapCount.textContent = lapTimes.length;

    if(lapTimes.length === 0) return;

    const fast = Math.min(...lapTimes);
    const slow = Math.max(...lapTimes);

    fastestLap.textContent = formatTime(fast);
    slowestLap.textContent = formatTime(slow);
}

function clearLaps(){

    laps.innerHTML = "";
    lapTimes = [];
    lapCounter = 1;

    lapCount.textContent = "0";
    fastestLap.textContent = "--";
    slowestLap.textContent = "--";
}
eventMessage.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        addLap();
    }

});
document.addEventListener("keydown", (e) => {

    // Ignore shortcuts when typing in input fields
    if (
        document.activeElement === eventMessage ||
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
    ) {
        return;
    }

    if (e.code === "Space") {
        e.preventDefault();
        startPause();
    }

    if (e.key.toLowerCase() === "l") {
        addLap();
    }

    if (e.key.toLowerCase() === "r") {
        resetTimer();
    }

});

startPauseBtn.addEventListener("click",startPause);
resetBtn.addEventListener("click",resetTimer);
lapBtn.addEventListener("click",addLap);
clearLapsBtn.addEventListener("click",clearLaps);

updateDisplay();