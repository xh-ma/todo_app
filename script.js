const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");

//Add task with Enter key
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && taskInput.value.trim() !== "") {
    addTask(taskInput.value, false);
    saveTasks();
    taskInput.value = "";
  }
});

// Load saved tasks + theme
document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTask(task.text, task.done));

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "₊⋆☀︎⋆";
  }
});

// Add task
addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() !== "") {
    addTask(taskInput.value, false);
    saveTasks();
    taskInput.value = "";
  }
});

function addTask(text, done) {
  const li = document.createElement("li");
  li.draggable = true;
  // Task text span
  const taskSpan = document.createElement("span");
  taskSpan.className = "tasks";
  taskSpan.textContent = text;
  if (done) taskSpan.classList.add("completed");

  // Actions container
  const actions = document.createElement("span");
  actions.className = "actions";

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "✔";
  toggleBtn.className = "pixel-btn";
  toggleBtn.onclick = () => {
    taskSpan.classList.toggle("completed");
    saveTasks();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.className = "pixel-btn";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  actions.appendChild(toggleBtn);
  actions.appendChild(deleteBtn);
  li.appendChild(taskSpan);
  li.appendChild(actions);
  taskList.appendChild(li);

  // Drag and drop events
  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", Array.from(taskList.children).indexOf(li));
    li.classList.add("dragging");
  });
  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
  });
  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    li.classList.add("drag-over");
  });
  li.addEventListener("dragleave", () => {
    li.classList.remove("drag-over");
  });
  li.addEventListener("drop", (e) => {
    e.preventDefault();
    li.classList.remove("drag-over");
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const toIndex = Array.from(taskList.children).indexOf(li);
    if (fromIndex !== toIndex) {
      const moving = taskList.children[fromIndex];
      if (toIndex > fromIndex) {
        taskList.insertBefore(moving, li.nextSibling);
      } else {
        taskList.insertBefore(moving, li);
      }
      saveTasks();
    }
  });
}
// Optional: Add drag-over style
const style = document.createElement('style');
style.textContent = `
.drag-over {
  outline: 3px dashed black !important;
}
.dragging {
  opacity: 0.5;
}
`;
document.head.appendChild(style);

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    const taskSpan = li.querySelector(".tasks");
    tasks.push({ text: taskSpan.textContent, done: taskSpan.classList.contains("completed") });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Toggle dark mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const darkMode = document.body.classList.contains("dark-mode");
  themeToggle.textContent = darkMode ? "₊⋆☀︎⋆" : "⋆☾⋆⁺";
  localStorage.setItem("darkMode", darkMode);
});

// Print task list
document.getElementById("print-list").addEventListener("click", () => {
  window.print();
});
