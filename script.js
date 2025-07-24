const habitForm = document.getElementById("habit-form");
const newHabitInput = document.getElementById("new-habit");
const habitList = document.getElementById("habit-list");

const today = new Date().toDateString();
let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    const checkedToday = habit.lastChecked === today;

    const habitInfo = document.createElement("div");
    habitInfo.className = "habit-info";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checkedToday;
    checkbox.addEventListener("change", () => {
      if (!checkedToday) {
        habit.streak++;
        habit.lastChecked = today;
      } else {
        habit.streak = 0;
        habit.lastChecked = "";
      }
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

    li.appendChild(habitInfo);
    li.appendChild(removeBtn);
    habitList.appendChild(li);
  });
}

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const habitName = newHabitInput.value.trim();
  if (habitName) {
    habits.push({ name: habitName, streak: 0, lastChecked: "" });
    saveHabits();
    newHabitInput.value = "";
    renderHabits();
  }
});

renderHabits();
