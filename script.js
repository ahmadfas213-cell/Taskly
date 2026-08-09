const STORAGE_KEY = "taskly_tasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let currentPage = "today";
let deferredPrompt = null;

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const modal = document.getElementById("modal");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const deadlineInput = document.getElementById("deadlineInput");

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");

const progressPercent =
    document.getElementById("progressPercent");

const ringNumber =
    document.getElementById("ringNumber");

const ringProgress =
    document.getElementById("ringProgress");

const completedText =
    document.getElementById("completedText");

const totalText =
    document.getElementById("totalText");

const remainingText =
    document.getElementById("remainingText");

const pageTitle =
    document.getElementById("pageTitle");

const greeting =
    document.getElementById("greeting");

const dateText =
    document.getElementById("dateText");


/* DATE */

const now = new Date();

dateText.textContent =
    now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

const hour = now.getHours();

if (hour < 12) {
    greeting.textContent = "Good morning.";
} else if (hour < 18) {
    greeting.textContent = "Good afternoon.";
} else {
    greeting.textContent = "Good evening.";
}


/* MODAL */

function openModal() {

    modal.classList.add("show");

    setTimeout(() => {
        taskInput.focus();
    }, 100);
}

function closeModal() {
    modal.classList.remove("show");
}

document
    .getElementById("desktopAdd")
    .addEventListener("click", openModal);

document
    .getElementById("mobileAdd")
    .addEventListener("click", openModal);

document
    .getElementById("closeModal")
    .addEventListener("click", closeModal);

document
    .querySelector(".modal-backdrop")
    .addEventListener("click", closeModal);


/* CREATE TASK */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) return;

    const newTask = {

        id: Date.now(),

        title: title,

        priority: priorityInput.value,

        deadline: deadlineInput.value,

        completed: false,

        createdAt: new Date().toISOString()

    };

    tasks.unshift(newTask);

    saveTasks();

    taskForm.reset();

    closeModal();

});


/* DELETE */

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
}


/* COMPLETE */

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();
}


/* FILTER */

function getVisibleTasks() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const priority =
        priorityFilter.value;

    return tasks.filter(task => {

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(search);

        const matchesPriority =
            priority === "all" ||
            task.priority === priority;

        if (!matchesSearch || !matchesPriority) {
            return false;
        }

        if (currentPage === "completed") {
            return task.completed;
        }

        if (currentPage === "today") {
            return !task.completed;
        }

        return true;
    });
}


/* RENDER */

function render() {

    const visibleTasks = getVisibleTasks();

    taskList.innerHTML = "";

    if (visibleTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

        visibleTasks.forEach(task => {

            const element =
                document.createElement("article");

            element.className =
                "task" +
                (task.completed ? " completed" : "");

            const priorityClass =
                task.priority.toLowerCase();

            const deadline =
                task.deadline
                    ? formatDate(task.deadline)
                    : "No deadline";

            element.innerHTML = `

                <div class="check"></div>

                <div class="task-info">

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-meta">

                        <span class="priority priority-${priorityClass}">
                            ${task.priority}
                        </span>

                        <span>
                            ${deadline}
                        </span>

                    </div>

                </div>

                <button class="delete-btn">
                    ×
                </button>

            `;

            element
                .querySelector(".check")
                .addEventListener("click", () => {
                    toggleTask(task.id);
                });

            element
                .querySelector(".delete-btn")
                .addEventListener("click", () => {
                    deleteTask(task.id);
                });

            taskList.appendChild(element);

        });
    }

    updateStats();
}


/* STATS */

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const remaining =
        total - completed;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    completedText.textContent = completed;

    totalText.textContent = total;

    remainingText.textContent = remaining;

    progressPercent.textContent = percentage;

    ringNumber.textContent =
        percentage + "%";

    const circumference = 301.6;

    const offset =
        circumference -
        (percentage / 100) * circumference;

    ringProgress.style.strokeDashoffset =
        offset;
}


/* NAVIGATION */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".nav-item")
                .forEach(item =>
                    item.classList.remove("active")
                );

            button.classList.add("active");

            currentPage =
                button.dataset.page;

            if (currentPage === "today") {
                pageTitle.textContent = "Today";
            }

            if (currentPage === "all") {
                pageTitle.textContent = "All Tasks";
            }

            if (currentPage === "completed") {
                pageTitle.textContent = "Completed";
            }

            render();
        });
    });


/* SEARCH */

searchInput.addEventListener(
    "input",
    render
);

priorityFilter.addEventListener(
    "change",
    render
);


/* STORAGE */

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

    render();
}


/* DATE FORMAT */

function formatDate(date) {

    return new Date(date + "T00:00:00")
        .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short"
        });
}


/* SECURITY */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* PWA INSTALL */

window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();

        deferredPrompt = event;

        document
            .getElementById("installBtn")
            .style.display = "block";
    }
);


document
    .getElementById("installBtn")
    .addEventListener("click", async () => {

        if (!deferredPrompt) {

            alert(
                "Install option belum tersedia. Buka lewat HTTPS atau localhost."
            );

            return;
        }

        deferredPrompt.prompt();

        await deferredPrompt.userChoice;

        deferredPrompt = null;

    });


/* SERVICE WORKER */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("sw.js")
            .catch(error => {
                console.error(
                    "Service Worker gagal:",
                    error
                );
            });

    });

}


/* INITIAL */

render();