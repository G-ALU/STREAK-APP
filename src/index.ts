interface Habit {
  id?: string;
  habit: string;
  startDate: string;
  endDate: string;
  habitimage: string;
}

async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch("http://localhost:3000/habits");
  const data = await response.json();
  return data;
}

function calculateDaysPassed(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function displayHabits(habits: Habit[]) {
  const activities = document.querySelector('.activities') as HTMLElement;
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

async function handleAction(event: Event) {
  const button = event.target as HTMLButtonElement;
  const habitId = button.getAttribute('data-id');
  const action = button.getAttribute('data-action');

  if (action === 'update') {
    showUpdateForm(habitId);
  } else if (action === 'delete') {
    await deleteHabit(habitId);
    const habits = await fetchHabits();
    displayHabits(habits);
  } else if (action === 'reset') {
    await resetStreak(habitId);
    const habits = await fetchHabits();
    displayHabits(habits);
  }
}

function showUpdateForm(habitId: string | null) {
  const form = document.getElementById('update-form') as HTMLFormElement;
  form.style.display = 'block';

  form.onsubmit = async (event) => {
    event.preventDefault();
    await updateHabit(habitId);
    form.style.display = 'none';
    const habits = await fetchHabits();
    displayHabits(habits);
  };
}

async function updateHabit(habitId: string | null) {
  const habitInput = document.getElementById('update-text') as HTMLInputElement;
  const startDateInput = document.getElementById('update-date-start') as HTMLInputElement;
  const endDateInput = document.getElementById('update-date-end') as HTMLInputElement;
  const imageInput = document.getElementById('update-dropdown') as HTMLInputElement;
  const updatedHabit: Habit = {
    habit: habitInput.value,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    habitimage: imageInput.value,
  };

  await fetch(`http://localhost:3000/habits/${habitId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedHabit),
  });
}

async function deleteHabit(habitId: string | null) {
  await fetch(`http://localhost:3000/habits/${habitId}`, {
    method: 'DELETE',
  });
}

async function resetStreak(habitId: string | null) {
  const habit = await fetchHabitById(habitId);
  habit.endDate = habit.startDate; 

  await fetch(`http://localhost:3000/habits/${habitId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(habit),
  });
}

async function fetchHabitById(habitId: string | null): Promise<Habit> {
  const response = await fetch(`http://localhost:3000/habits/${habitId}`);
  const habit = await response.json();
  return habit;
}

async function handleSubmit(event: Event) {
  event.preventDefault();

  const habitInput = document.getElementById('text1') as HTMLInputElement;
  const startDateInput = document.getElementById('date-start') as HTMLInputElement;
  const endDateInput = document.getElementById('date-end') as HTMLInputElement;
  const imageInput = document.getElementById('dropdown') as HTMLInputElement;
  const newHabit: Habit = {
    habit: habitInput.value,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    habitimage: imageInput.value,
  };

  
  await fetch("http://localhost:3000/habits", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newHabit),
  });

  
  const habits = await fetchHabits();
  displayHabits(habits);
}

document.getElementById('mySubmit')?.addEventListener('click', handleSubmit);
fetchHabits().then(displayHabits);

