let sessionCount = 0;
let totalMinutes = 0;
let isRunning = true;
let timerInterval;
let currentTime = 30 * 60;
let totalDuration = 30 * 60;
const circleLength = 2 * Math.PI * 45;

const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const sessionsEl = document.getElementById("sessions");
const totalEl = document.getElementById("total");
const progressCircle = document.getElementById("progress");
const logEl = document.getElementById("log");
const beep = document.getElementById("beep");

function updateTimerDisplay(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  timerEl.textContent = `${min}:${sec}`;
  const progress = (seconds / totalDuration) * circleLength;
  progressCircle.setAttribute("stroke-dashoffset", circleLength - progress);
}

function addToLog(type) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' });
  const entry = `${type} - ${timeStr}`;
  const li = document.createElement("li");
  li.textContent = entry;
  logEl.prepend(li);

  let logs = JSON.parse(localStorage.getItem("pomodoro-log")) || [];
  logs.unshift(entry);
  localStorage.setItem("pomodoro-log", JSON.stringify(logs));
}

function loadLogFromStorage() {
  let logs = JSON.parse(localStorage.getItem("pomodoro-log")) || [];
  logs.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    logEl.appendChild(li);
  });
}

function clearLog() {
  localStorage.removeItem("pomodoro-log");
  logEl.innerHTML = "";
}

function toggleTimer() {
  isRunning = !isRunning;
  statusEl.textContent = isRunning ? "استئناف..." : "مؤقت متوقف مؤقتاً";
}

function runSession(duration) {
  clearInterval(timerInterval);
  statusEl.textContent = "وقت العمل";
  addToLog("بدأت جلسة عمل");
  currentTime = totalDuration = duration;
  updateTimerDisplay(currentTime);

  timerInterval = setInterval(() => {
    if (!isRunning) return;
    currentTime--;
    updateTimerDisplay(currentTime);
    if (currentTime <= 0) {
      clearInterval(timerInterval);
      sessionCount++;
      totalMinutes += 35;
      sessionsEl.textContent = sessionCount;
      totalEl.textContent = `${totalMinutes} دقيقة`;
      runBeepAndBreak();
    }
  }, 1000);
}

function runBeepAndBreak() {
  statusEl.textContent = "تنبيه...";
  beep.play();
  setTimeout(() => {
    runBreak(5 * 60);
  }, 5000);
}

function runBreak(duration) {
  clearInterval(timerInterval);
  statusEl.textContent = "وقت الراحة";
  addToLog("بدأت راحة");
  currentTime = totalDuration = duration;
  updateTimerDisplay(currentTime);

  timerInterval = setInterval(() => {
    if (!isRunning) return;
    currentTime--;
    updateTimerDisplay(currentTime);
    if (currentTime <= 0) {
      clearInterval(timerInterval);
      runSession(30 * 60);
    }
  }, 1000);
}

window.onload = () => {
  loadLogFromStorage();
  runSession(30 * 60);
};