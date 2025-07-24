const habitForm = document.getElementById("habit-form");
const newHabitInput = document.getElementById("new-habit");
const habitList = document.getElementById("habit-list");

const today = new Date();
const todayKey = today.toISOString().split("T")[0]; // e.g. 2025-07-24
let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function getPast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const key = date.toISOString().split("T")[0];
    const label = date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1); // S, M, T, etc.
    days.push({ key, label });
  }
  return days;
}

function renderHabits() {
  habitList.innerHTML = "";
  const past7 = getPast7Days();

  habits.forEach((habit, index) => {
    const li = document.createElement("li");

    const habitInfo = document.createElement("div");
    habitInfo.className = "habit-info";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.history?.[todayKey] || false;

    checkbox.addEventListener("change", () => {
      habit.history = habit.history || {};
      habit.history[todayKey] = checkbox.checked;

      // Update streak based on consecutive past days
      habit.streak = 0;
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const key = date.toISOString().split("T")[0];
        if (habit.history[key]) {
          habit.streak++;
        } else if (key !== todayKey) {
          habit.streak = 0;
        }
      }

      habit.lastChecked = todayKey;
      saveHabits();
      renderHabits();
    });

    const label = document.createElement("span");
    label.textContent = habit.name;

    const streak = document.createElement("span");
    streak.className = "streak";
    streak.textContent = `🔥 ${habit.streak}`;

    habitInfo.appendChild(checkbox);
    habitInfo.appendChild(label);
    habitInfo.appendChild(streak);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.onclick = () => {
      habits.splice(index, 1);
      saveHabits();
      renderHabits();
    };

    // Add 7-day history row
    const historyRow = document.createElement("div");
    historyRow.className = "history-row";
    past7.forEach(day => {
      const box = document.createElement("div");
      box.className = "history-box";
      box.textContent = day.label;

      if (habit.history?.[day.key]) {
        box.classList.add("done");
      } else {
        box.classList.add("not-done");
      }

      historyRow.appendChild(box);
    });

    li.appendChild(habitInfo);
    li.appendChild(historyRow);
    li.appendChild(removeBtn);
    habitList.appendChild(li);
  });
}

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const habitName = newHabitInput.value.trim();
  if (habitName) {
    habits.push({ name: habitName, streak: 0, lastChecked: "", history: {} });
    saveHabits();
    newHabitInput.value = "";
    renderHabits();
  }
});

renderHabits();
