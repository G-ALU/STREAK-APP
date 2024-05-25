"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
function fetchHabits() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:3000/habits");
        const data = yield response.json();
        return data;
    });
}
function calculateDaysPassed(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
function displayHabits(habits) {
    const activities = document.querySelector('.activities');
    activities.innerHTML = '';
    habits.forEach((habit) => {
        const daysPassed = calculateDaysPassed(habit.startDate, habit.endDate);
        const habitItem = document.createElement('div');
        habitItem.classList.add('activities1');
        habitItem.innerHTML = `
      <ion-icon name="${habit.habitimage}"></ion-icon>
      <p>${habit.endDate} <br> ${habit.habit}</p><br>
      <p>Streak: ${daysPassed} days</p>
      <button class="update1" data-id="${habit.id}" data-action="update">Update Habit</button>
      <button class="update1" data-id="${habit.id}" data-action="delete">Delete Habit</button>
      <button class="update1" data-id="${habit.id}" data-action="reset">Reset Streak</button>
    `;
        activities.appendChild(habitItem);
    });
    document.querySelectorAll('.update1').forEach(button => {
        button.addEventListener('click', handleAction);
    });
}
function handleAction(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const button = event.target;
        const habitId = button.getAttribute('data-id');
        const action = button.getAttribute('data-action');
        if (action === 'update') {
            showUpdateForm(habitId);
        }
        else if (action === 'delete') {
            yield deleteHabit(habitId);
            const habits = yield fetchHabits();
            displayHabits(habits);
        }
        else if (action === 'reset') {
            yield resetStreak(habitId);
            const habits = yield fetchHabits();
            displayHabits(habits);
        }
    });
}
function showUpdateForm(habitId) {
    const form = document.getElementById('update-form');
    form.style.display = 'block';
    form.onsubmit = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        yield updateHabit(habitId);
        form.style.display = 'none';
        const habits = yield fetchHabits();
        displayHabits(habits);
    });
}
function updateHabit(habitId) {
    return __awaiter(this, void 0, void 0, function* () {
        const habitInput = document.getElementById('update-text');
        const startDateInput = document.getElementById('update-date-start');
        const endDateInput = document.getElementById('update-date-end');
        const imageInput = document.getElementById('update-dropdown');
        const updatedHabit = {
            habit: habitInput.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            habitimage: imageInput.value,
        };
        yield fetch(`http://localhost:3000/habits/${habitId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedHabit),
        });
    });
}
function deleteHabit(habitId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`http://localhost:3000/habits/${habitId}`, {
            method: 'DELETE',
        });
    });
}
function resetStreak(habitId) {
    return __awaiter(this, void 0, void 0, function* () {
        const habit = yield fetchHabitById(habitId);
        habit.endDate = habit.startDate;
        yield fetch(`http://localhost:3000/habits/${habitId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(habit),
        });
    });
}
function fetchHabitById(habitId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:3000/habits/${habitId}`);
        const habit = yield response.json();
        return habit;
    });
}
function handleSubmit(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const habitInput = document.getElementById('text1');
        const startDateInput = document.getElementById('date-start');
        const endDateInput = document.getElementById('date-end');
        const imageInput = document.getElementById('dropdown');
        const newHabit = {
            habit: habitInput.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            habitimage: imageInput.value,
        };
        yield fetch("http://localhost:3000/habits", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newHabit),
        });
        const habits = yield fetchHabits();
        displayHabits(habits);
    });
}
(_a = document.getElementById('mySubmit')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', handleSubmit);
fetchHabits().then(displayHabits);
