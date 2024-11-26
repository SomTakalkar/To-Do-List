// Array to store tasks
let tasks = [];

// DOM Elements
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const categoryInput = document.getElementById("category-input");
const priorityInput = document.getElementById("priority-input");
const addTaskButton = document.getElementById("add-task");
const categoryFilter = document.getElementById("category-filter");
const statusAllRadio = document.getElementById("status-all");
const statusPendingRadio = document.getElementById("status-pending");
const statusCompletedRadio = document.getElementById("status-completed");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const noTaskMessage = document.getElementById("no-task-message");
const clearSearchButton = document.getElementById("clear-search");

// Event Listener to Add Task
addTaskButton.addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    const taskDueDate = dateInput.value;
    const taskCategory = categoryInput.value;
    const taskPriority = priorityInput.value;

    if (taskName) {
        const newTask = {
            name: taskName,
            dueDate: taskDueDate || "No Due Date", // Optional due date
            category: taskCategory,
            priority: taskPriority,
            completed: false,
        };

        tasks.push(newTask);
        renderTasks();
        taskInput.value = ""; // Clear input field
        dateInput.value = ""; // Clear date input
    } else {
        alert("Task name cannot be empty.");
    }
});

// Priority Dropdown Color Change
priorityInput.addEventListener("change", () => {
    const value = priorityInput.value;
    switch (value) {
        case "High":
            priorityInput.style.backgroundColor = "lightcoral";
            break;
        case "Medium":
            priorityInput.style.backgroundColor = "#f1e17f";
            break;
        case "Low":
            priorityInput.style.backgroundColor = "lightgreen";
            break;
        default:
            priorityInput.style.backgroundColor = "white";
    }
});

// Function to Render Tasks
function renderTasks() {
    taskList.innerHTML = "";

    // Get current filter values
    const selectedCategory = categoryFilter.value;
    const showAll = statusAllRadio.checked;
    const showPending = statusPendingRadio.checked;
    const showCompleted = statusCompletedRadio.checked;

    tasks
        .filter(task => {
            // Filter by Category
            const categoryMatch = selectedCategory === "All" || task.category === selectedCategory;

            // Filter by Status
            const statusMatch = showAll || (task.completed && showCompleted) || (!task.completed && showPending);

            return categoryMatch && statusMatch;
        })
        .sort((a, b) => {
            // Sort by Priority
            const priorityOrder = { High: 1, Medium: 2, Low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .forEach((task, index) => {
            const taskItem = document.createElement("li");
            taskItem.className = "task-item";
            taskItem.setAttribute("data-priority", task.priority);

            // Apply background color based on priority
            switch (task.priority) {
                case "High":
                    taskItem.style.backgroundColor = "lightcoral";
                    break;
                case "Medium":
                    taskItem.style.backgroundColor = "#f1e17f";
                    break;
                case "Low":
                    taskItem.style.backgroundColor = "lightgreen";
                    break;
                default:
                    priorityInput.style.backgroundColor = "white"; // Default background
            }

            // Apply strikethrough if completed
            if (task.completed) {
                taskItem.classList.add("completed");
            }

            // Checkbox to Mark as Complete
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                renderTasks();
            });

            // Task Text with Due Date, Category, and Priority
            const taskText = document.createElement("span");
            taskText.textContent = `${task.name}  (Due = ${task. dueDate}) (${task.category}) - Priority: ${task.priority}`;

            // Delete Button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                tasks.splice(index, 1);
                renderTasks();
                searchTasks(); // Refresh search results after deletion
            });

            // Append elements to task item
            taskItem.append(checkbox, taskText, deleteButton);
            taskList.appendChild(taskItem);
        });

    searchTasks(); // Reapply search after rendering
}

// Function to Search Tasks
function searchTasks() {
    const searchValue = searchInput.value.toLowerCase();
    const taskItems = document.querySelectorAll(".task-item");
    let hasMatch = false;

    taskItems.forEach(task => {
        const taskName = task.querySelector("span").textContent.toLowerCase();
        const category = taskName.match(/\((.*?)\)/)?.[1]?.toLowerCase();
        const priority = task.getAttribute("data-priority")?.toLowerCase();

        // Check if the task matches search input
        if (
            taskName.includes(searchValue) ||
            (category && category.includes(searchValue)) ||
            (priority && priority.includes(searchValue))
        ) {
            task.style.display = "flex"; // Show task
            hasMatch = true;
        } else {
            task.style.display = "none"; // Hide task
        }
    });

    // Show/Hide "No such task" message
    noTaskMessage.style.display = hasMatch ? "none" : "block";
}

// Event Listener for Search Input
searchInput.addEventListener("input", searchTasks);

// Event Listener to Clear Search
clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    searchTasks(); // Reset search
});

// Event Listeners for Filters
categoryFilter.addEventListener("change", renderTasks);
statusAllRadio.addEventListener("change", renderTasks);
statusPendingRadio.addEventListener("change", renderTasks);
statusCompletedRadio.addEventListener("change", renderTasks);
