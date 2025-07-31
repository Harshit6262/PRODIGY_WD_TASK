let startTime = 0;
let elapsedTime = 0;
let timerInterval;
const display = document.getElementById("display");
const laps = document.getElementById("lap");

function timeToString(time) {
    let hrs = Math.floor(time / 3600000);
    let mins = Math.floor((time % 3600000) / 60000);
    let secs = Math.floor((time % 60000) / 1000);

    return (
        (hrs < 10 ? "0" + hrs : hrs) + ":" +
        (mins < 10 ? "0" + mins : mins) + ":" +
        (secs < 10 ? "0" + secs : secs)
    );
}

function print(txt) {
    display.innerHTML =txt;
}
let start = document.querySelector(".start");

start.addEventListener("click", function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval (function printTime() {
        elapsedTime = Date.now() - startTime;
        print(timeToString(elapsedTime));
    }, 1000);
});

let pause = document.querySelector(".pause");

pause.addEventListener("click", function pause() {
    clearInterval(timerInterval);
});

let reset = document.querySelector(".reset");

reset.addEventListener("click", function reset() {
    clearInterval(timerInterval);
    print("00:00:00");
    elapsedTime = 0;
    laps.innerHTML = "";
});

let lap = document.querySelector(".laps");

lap.addEventListener("click", function lap() {
    const lapTime = timeToString(elapsedTime);
    const li = document.createElement("li");
    li.textContent =`Lap ${laps.children.length + 1}: ${lapTime}`;
    laps.appendChild(li);
});
