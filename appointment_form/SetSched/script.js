const calendarDays = document.getElementById("calendar-days");
const monthLabel = document.getElementById("month-label");
const selectedDateHeading = document.getElementById("selected-date-heading");
const timeGrid = document.getElementById("time-grid");
const summaryDate = document.getElementById("summary-date");
const statusMessage = document.getElementById("status-message");

let displayedMonth = new Date(2026, 8, 1); // September 2026
let selectedDate = new Date(2026, 8, 15);
let selectedTime = "1:30 PM";

// Demonstration availability. Replace this object with data from your backend later.
const unavailableDates = {
  "2026-09-09": "booked",
  "2026-09-16": "booked"
};
const unavailableTimes = {
  "2026-09-15": ["10:00 AM", "2:00 PM"]
};
const times = [
  "9:00 AM", "9:30 AM", "10:00 AM",
  "10:30 AM", "11:00 AM", "1:00 PM",
  "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM"
];

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(date, options = { year: "numeric", month: "long", day: "numeric" }) {
  return date.toLocaleDateString("en-US", options);
}

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  monthLabel.textContent = displayedMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  calendarDays.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("span");
    blank.className = "day empty";
    blank.setAttribute("aria-hidden", "true");
    calendarDays.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = dateKey(date);
    const button = document.createElement("button");
    const isBooked = unavailableDates[key] === "booked";
    const isSelected = dateKey(selectedDate) === key;
    const isAvailable = !isBooked && date.getDay() !== 0 && date.getDay() !== 6;

    button.type = "button";
    button.textContent = day;
    button.className = "day";
    button.setAttribute("aria-label", formatDate(date));
    if (isBooked) {
      button.classList.add("booked");
      button.disabled = true;
      button.title = "Fully booked";
    } else if (isAvailable) {
      button.classList.add("available");
      button.addEventListener("click", () => {
        selectedDate = date;
        selectedTime = null;
        statusMessage.textContent = "";
        renderCalendar();
        renderTimes();
        updateSummary();
      });
    } else {
      button.disabled = true;
    }
    if (isSelected) button.classList.add("selected");
    if (key === "2026-09-04") button.classList.add("today");
    calendarDays.appendChild(button);
  }
}

function renderTimes() {
  const key = dateKey(selectedDate);
  const blocked = unavailableTimes[key] || [];
  selectedDateHeading.textContent = formatDate(selectedDate, { month: "short", day: "numeric", year: "numeric" });
  timeGrid.innerHTML = "";

  times.forEach(time => {
    const button = document.createElement("button");
    const isUnavailable = blocked.includes(time);
    button.type = "button";
    button.textContent = time;
    button.className = "time-slot";
    button.disabled = isUnavailable;
    if (isUnavailable) {
      button.title = "This time slot is unavailable";
    } else {
      button.addEventListener("click", () => {
        selectedTime = time;
        statusMessage.textContent = "";
        renderTimes();
        updateSummary();
      });
    }
    if (selectedTime === time) button.classList.add("selected");
    timeGrid.appendChild(button);
  });
}

function updateSummary() {
  summaryDate.textContent = selectedTime
    ? `${formatDate(selectedDate)} · ${selectedTime}`
    : `${formatDate(selectedDate)} · Select a time`;
}

document.getElementById("prev-month").addEventListener("click", () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
  renderCalendar();
});
document.getElementById("next-month").addEventListener("click", () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
  renderCalendar();
});

document.getElementById("continue-button").addEventListener("click", () => {
  if (!selectedDate || !selectedTime) {
    statusMessage.textContent = "Please select both an available date and a time.";
    return;
  }
  statusMessage.textContent = `Schedule selected: ${formatDate(selectedDate)} at ${selectedTime}. Connect this button to your next step.`;
});

document.getElementById("back-button").addEventListener("click", () => {
  statusMessage.textContent = "Back button clicked. Connect this to your previous form step.";
});

renderCalendar();
renderTimes();
updateSummary();
