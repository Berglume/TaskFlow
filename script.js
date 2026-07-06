const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskCounter = document.getElementById("taskCounter");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function getVisibleTasks() {
    if (currentFilter === "active") {
        return tasks.filter((task) => !task.done);
    } else if (currentFilter === "done") {
        return tasks.filter((task) => task.done)
    }
    return tasks;
}

function updateCounter() {
    const activeCount = tasks.filter((task) => !task.done).length;
    const label = activeCount === 1 ? "task" : "tasks";

    taskCounter.textContent = `${activeCount} active ${label}`;
}

function renderTasks() {
    const visibleTasks = getVisibleTasks();

    taskList.innerHTML = "";
    emptyState.classList.toggle("is-visible", visibleTasks.length === 0);

    visibleTasks.forEach((task) => {
        const item = document.createElement("li");
        item.className = `task-item${task.done ? " is-done" : ""}`;

        item.innerHTML = `
      <input class="task-check" type="checkbox" ${task.done ? "checked" : ""} aria-label="Mark task as done" />
      <span class="task-title"></span>
      <button class="delete-btn" type="button">Delete</button>
    `;

        item.querySelector(".task-title").textContent = task.title;

        item.querySelector(".task-check").addEventListener("change", () => {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        });

        item.querySelector(".delete-btn").addEventListener("click", () => {
            tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
            saveTasks();
            renderTasks();
        });

        taskList.append(item);
    });

    updateCounter();
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        return;
    }

    tasks.unshift({
        id: crypto.randomUUID(),
        title,
        done: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
            filterButton.classList.toggle("is-active", filterButton === button);
        });

        renderTasks();
    });
});

renderTasks();

