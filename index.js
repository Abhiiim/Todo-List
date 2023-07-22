// Creating a checkbox for checking whether a particular task is complete or not
function createCheckbox (newItem, task) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = task.id;
    if (task.isCompleted) checkbox.checked = true;
    checkbox.addEventListener("click", function() {
        taskCompleted(this);
    });
    checkbox.classList.add("checkbox-1");
    newItem.appendChild(checkbox);
}

// Creating a paragraph element for the title of the task
function addPara(newItem, task) {
    let paraDiv = document.createElement("div");

    let taskTitle = document.createElement("p");
    taskTitle.innerText = task.title;
    if (task.isCompleted) {
        taskTitle.style.textDecoration = "line-through";
    }
    paraDiv.appendChild(taskTitle);
    newItem.appendChild(paraDiv);

    let subtaskList = document.createElement("ul");
    for (let i=0; i<task.subtasks.length; i++) {
        let subtaskItem = document.createElement("li");
        subtaskItem.innerHTML = task.subtasks[i];
        subtaskList.appendChild(subtaskItem);
    }
    subtaskList.classList.add("subtask-list");
    paraDiv.appendChild(subtaskList);

    let taskCategory = document.createElement("div");
    taskCategory.innerText = task.category + " | " + task.due_date + " | " + task.priority;
    taskCategory.classList.add("para-options");
    paraDiv.appendChild(taskCategory);

    let taskTags = document.createElement("div");
    let tag = "";
    for (let i=0; i<task.tags.length; i++) {
        if (i == 0) {
            tag = task.tags[i];
        } else {
            tag += " | " + task.tags[i];
        }
    }
    taskTags.innerHTML = tag;
    taskTags.classList.add("para-options");
    paraDiv.appendChild(taskTags);

    newItem.appendChild(paraDiv);
}

// Creating a edit button for editing the title of a task
function editButton (newItem, taskId) {
    let editBtn = document.createElement("button");
    editBtn.innerHTML = "Edit";
    editBtn.id = taskId;
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", function () {
        editItem(this);
    })
    newItem.appendChild(editBtn);
}

// Creating a delete button for deleting a particular task
function deleteButton (newItem, taskId) {
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function() {
        deleteItem(this);
    });
    deleteBtn.id = taskId;
    newItem.appendChild(deleteBtn);
}

function createTaskHTML(list, task) {
    // Creating a new div element for list of item
    let newItem = document.createElement("div");
    newItem.classList.add("item")

    createCheckbox (newItem, task);
    addPara (newItem, task);
    editButton (newItem, task.id);
    deleteButton (newItem, task.id);

    list.appendChild(newItem);
    document.getElementById("new-work").value = "";
}

// Function for rendering the html using the content stored inside the array
function renderTasks (list, taskList) {
    for (let i=0; i<taskList.length; i++) {
        createTaskHTML(list, taskList[i]);
    }
}

let subtasks = [], tags = [];
function addSubtask () {
    let subtask = document.getElementById("subtask").value;
    if (subtask.trim() !== "") subtasks.push(subtask);
    document.getElementById("subtask").value = "";
}

function addTags () {
    let tag = document.getElementById("tags").value;
    if (tag.trim() !== "") tags.push(tag);
    document.getElementById("tags").value = "";
}

// Function for adding a new element into the array and rerenders the whole html
function addNewItem () {
    let newWork = document.getElementById("new-work").value;
    let category = document.getElementById("category-option").value;
    let due_date = document.getElementById("date-picker").value;
    let priority = document.getElementById("priority-option").value;

    if (newWork.trim() !== "" && category.trim() !== "" && due_date.trim() !=="" && priority.trim() != "") {

        let taskItems = JSON.parse(localStorage.getItem("tasks")) || [];
        let taskId = localStorage.getItem("taskId");
        if (taskId === null) taskId = 1;
        taskId = parseInt(taskId);

        taskItems.push({
            id: taskId, 
            title: newWork, 
            category: category,
            due_date: due_date,
            priority: priority, 
            isCompleted: false,
            subtasks: subtasks, 
            tags: tags
        });
        taskId++;

        subtasks = [];
        tags = [];

        localStorage.setItem("tasks", JSON.stringify(taskItems));
        localStorage.setItem("taskId", taskId.toString());

        document.getElementById("category-option").value = "Category 1";
        document.getElementById("date-picker").value = "";
        document.getElementById("priority-option").value = "Low"

        let list = document.getElementById('list');
        list.innerHTML = "";
        renderTasks(list, taskItems);

        let activity = JSON.parse(localStorage.getItem("activity")) || [];
        activity.push("Added a new task with title " + newWork);
        localStorage.setItem("activity", JSON.stringify(activity));
    }
}

// Function for deleting a new element from the list and rerenders the whole html
function deleteItem(btn) {
    let taskItems = JSON.parse(localStorage.getItem("tasks")) || [];
    let list = document.getElementById('list');

    deleteFromArray(btn.id, taskItems);
    localStorage.setItem("tasks", JSON.stringify(taskItems));

    list.innerHTML = "";
    renderTasks(list, taskItems);
}

// Function for deleting a particular element from array using the id of that element
function deleteFromArray(id, taskList) {
    let idx = taskList.findIndex(task => task.id == id);
    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    activity.push("Deleted task with title " + taskList[idx].title);
    localStorage.setItem("activity", JSON.stringify(activity));
    taskList.splice(idx, 1);
}

// Function for editing a Particular Item inline using the contentEditable property
// And then update the title in the array
function editItem (btn) {
    var prtDiv = btn.parentNode;
    var para = prtDiv.querySelector("p");
    if (para.contentEditable == 'true') {
        para.contentEditable = 'false';
        btn.innerHTML = "Edit";
        btn.style.backgroundColor = "#059c3d";
    } else  {
        para.contentEditable = 'true';
        para.focus();
        btn.innerHTML = "Save";
        btn.style.backgroundColor = "#007bff";
    }

    let prevTitle = "";
    let taskItems = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let i=0; i<taskItems.length; i++) {
        if (taskItems[i].id == btn.id) {
            prevTitle = taskItems[i].title;
            taskItems[i].title = para.innerText;
            break;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(taskItems));

    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    activity.push("Edit a task with previous title " + prevTitle + " to new title " + para.innerText);
    localStorage.setItem("activity", JSON.stringify(activity));
}

function taskCompleted (box) {
    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    var prtDiv = box.parentNode;
    var para = prtDiv.querySelector("p");
    if (box.checked) {
        para.style.textDecoration = "line-through";
        activity.push("Task with title " + para.innerText + " is marked as completed");
    } else {
        para.style.textDecoration = "none";
        activity.push("Task with title " + para.innerText + " is marked as uncompleted");
    }

    let taskItems = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let i=0; i<taskItems.length; i++) {
        if (taskItems[i].id == box.id) {
            taskItems[i].isCompleted = !taskItems[i].isCompleted;
            break;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(taskItems));    
    localStorage.setItem("activity", JSON.stringify(activity));
}


function filterTask () {
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    let list = document.getElementById('list');
    list.innerHTML = "";

    let selectedCategory = document.getElementById("category-filter").value;
    let selectedPriority = document.getElementById("priority-filter").value;
    let dateFrom = document.getElementById("date-filter-from").value;
    let dateTo = document.getElementById("date-filter-to").value;

    for (let i=0; i<taskList.length; i++) {
        if (dateTo == "") {
            if (selectedCategory.trim() == "" && selectedPriority == "All") {
                createTaskHTML(list, taskList[i]);
            } else if (selectedPriority == "All") {
                if (taskList[i].category == selectedCategory) {
                    createTaskHTML(list, taskList[i]);
                }
            } else if (selectedCategory.trim() == "") {
                if (taskList[i].priority == selectedPriority) {
                    createTaskHTML(list, taskList[i]);
                }
            } else {
                if (taskList[i].category == selectedCategory && taskList[i].priority == selectedPriority) {
                    createTaskHTML(list, taskList[i]);
                }
            }
        } else {
            if (selectedCategory.trim() == "" && selectedPriority == "All") {
                if (Date.parse(taskList[i].due_date) >= Date.parse(dateFrom) && Date.parse(taskList[i].due_date) <= Date.parse(dateTo)) {
                    createTaskHTML(list, taskList[i]);
                }
            } else if (selectedPriority == "All") {
                if (taskList[i].category == selectedCategory) {
                    if (Date.parse(taskList[i].due_date) >= Date.parse(dateFrom) && Date.parse(taskList[i].due_date) <= Date.parse(dateTo)) {
                        createTaskHTML(list, taskList[i]);
                    }
                }
            } else if (selectedCategory.trim() == "") {
                if (taskList[i].priority == selectedPriority) {
                    if (Date.parse(taskList[i].due_date) >= Date.parse(dateFrom) && Date.parse(taskList[i].due_date) <= Date.parse(dateTo)) {
                        createTaskHTML(list, taskList[i]);
                    }
                }
            } else {
                if (taskList[i].category == selectedCategory && taskList[i].priority == selectedPriority) {
                    if (Date.parse(taskList[i].due_date) >= Date.parse(dateFrom) && Date.parse(taskList[i].due_date) <= Date.parse(dateTo)) {
                        createTaskHTML(list, taskList[i]);
                    }
                }
            }
        }
    }

    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    activity.push("Todo List is filterd");
    localStorage.setItem("activity", JSON.stringify(activity));
}

function sortTask () {
    let sortBasis = document.getElementById("list-sort").value;
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    let list = document.getElementById('list');
    list.innerHTML = "";

    if (sortBasis == "date") {
        taskList.sort(function (t1, t2) {
            if (Date.parse(t1.due_date) < Date.parse(t2.due_date)) {
                return -1;
            } else if (Date.parse(t1.due_date) < Date.parse(t2.due_date)) {
                return 1;
            } else {
                return 0;
            }
        });
        activity.push("Sorted the todo list items on the basis of due date");
    } else if (sortBasis == "priority") {
        taskList.sort(function (t1, t2) {
            if (t1.priority === t2.priority) return 0;
            if (t1.priority === "High") return -1;
            if (t2.priority === "High") return 1;
            if (t1.priority === "Medium") return -1;
            if (t2.priority === "Medium") return 1;
            return 0; 
        });
        activity.push("Sorted the todo list items on the basis of priority");
    } else {
        taskList.sort(function (t1, t2) {
            if (t1.id < t2.id) {
                return -1;
            } else if (t1.id < t2.id) {
                return 1;
            } else {
                return 0;
            }
        });
        activity.push("Sort the todo list items in its original state");
    }
    // console.log(taskList);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTasks(list, taskList)

    localStorage.setItem("activity", JSON.stringify(activity));
}


function addBacklogs () {
    let backlogs = JSON.parse(localStorage.getItem("backlogs")) || [];
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let i=0; i<tasks.length; i++) {
        let today = new Date();
        let taskDate = Date.parse(tasks[i].due_date);
        if (today > taskDate) {
            backlogs.push(tasks[i]);
            tasks.splice(i, 1);
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("backlogs", JSON.stringify(backlogs));
}

addBacklogs();

function viewBacklogs () {
    let backlogs = JSON.parse(localStorage.getItem("backlogs")) || [];
    let backlogList = document.getElementById("backlogs");

    if (backlogList.innerHTML == "") {
        for (let i=0; i<backlogs.length; i++) {
            let newItem = document.createElement("div");
            newItem.classList.add("item")
            addPara (newItem, backlogs[i]);
            backlogList.appendChild(newItem);
        }
    } else {
        backlogList.innerHTML = "";
    }
}


function activityLogs () {
    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    let activityList = document.getElementById("activity-logs");

    if (activityList.innerHTML == "") {
        let actList = document.createElement("ul");
        for (let i=0; i<activity.length; i++) {
            let newItem = document.createElement("li");
            newItem.innerHTML = activity[i];
            actList.appendChild(newItem);
        }
        activityList.appendChild(actList);
    } else {
        activityList.innerHTML = ""
    }
}

function searchItems () {
    let searchType = document.getElementById("search-type").value;
    let searchItem = document.getElementById("search-item").value;
    let list = document.getElementById("list");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    list.innerHTML = "";

    console.log(searchItem);

    for (let i=0; i<tasks.length; i++) {
        if (searchType == "todo") {
            if (tasks[i].title.toUpperCase() == searchItem.toUpperCase()) {
                createTaskHTML(list, tasks[i]);
            }
        } else if (searchType == "tags") {
            for (let j=0; j<tasks[i].tags.length; j++) {
                if (tasks[i].tags[j].toUpperCase() == searchItem.toUpperCase()) {
                    createTaskHTML(list, tasks[i]);
                }
            }
        } else if (searchType == "subtask") {
            for (let j=0; j<tasks[i].subtasks.length; j++) {
                if (tasks[i].subtasks[j].toUpperCase() == searchItem.toUpperCase()) {
                    createTaskHTML(list, tasks[i]);
                }
            }
        }
    }
    if (searchType == "todo") {
        activity.push("Tasks are searched on the basis of todo");
    } else if (searchType == "tags") {
        activity.push("Tasks are searched on the basis of tags");
    } else if (searchType == "subtask") {
        activity.push("Tasks are searched on the basis of subtask");
    }
    localStorage.setItem("activity", JSON.stringify(activity));
}

function showAllTasks () {
    let list = document.getElementById("list");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    list.innerHTML = "";
    renderTasks(list, tasks)
    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    activity.push("All tasks are shown");
    localStorage.setItem("activity", JSON.stringify(activity));
}

// localStorage.clear();

let taskItems = JSON.parse(localStorage.getItem("tasks")) || [];
let list = document.getElementById('list');
renderTasks(list, taskItems);