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

    let taskCategory = document.createElement("div");
    taskCategory.innerText = task.category + " | " + task.due_date + " | " + task.priority;
    taskCategory.classList.add("para-options");
    paraDiv.appendChild(taskCategory);
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

// Creating a checkbox for checking whether a particular task is complete or not
function createCheckbox (newItem, task) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = task.id;
    if (task.isCompleted) checkbox.checked = true;
    checkbox.addEventListener("click", function() {
        taskCompleted(this);
    });
    newItem.appendChild(checkbox);
}

// Function for rendering the html using the content stored inside the array
function renderTasks (list, taskList) {
    for (let i=0; i<taskList.length; i++) {

        // Creating a new div element for list of item
        let newItem = document.createElement("div");
        newItem.classList.add("item")

        createCheckbox (newItem, taskList[i]);
        addPara (newItem, taskList[i]);
        editButton (newItem, taskList[i].id);
        deleteButton (newItem, taskList[i].id);

        list.appendChild(newItem);
        document.getElementById("new-work").value = "";
    }
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
            isCompleted: false
        });
        taskId++;

        // console.log(taskId);
        // console.log(taskItems);

        localStorage.setItem("tasks", JSON.stringify(taskItems));
        localStorage.setItem("taskId", taskId.toString());

        document.getElementById("category-option").value = "Category 1";
        document.getElementById("date-picker").value = "";
        document.getElementById("priority-option").value = "Low"

        let list = document.getElementById('list');
        list.innerHTML = "";
        renderTasks(list, taskItems);
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

    let taskItems = JSON.parse(localStorage.getItem("tasks")) || [];

    for (let i=0; i<taskItems.length; i++) {
        if (taskItems[i].id == btn.id) {
            taskItems[i].title = para.innerText;
            break;
        }
    }

    localStorage.setItem("tasks", JSON.stringify(taskItems));
}

function taskCompleted (box) {
    console.log(box.checked);
    var prtDiv = box.parentNode;
    var para = prtDiv.querySelector("p");
    if (box.checked) {
        para.style.textDecoration = "line-through";
    } else {
        para.style.textDecoration = "none";
    }

    let taskItems = JSON.parse(localStorage.getItem("tasks")) || [];

    for (let i=0; i<taskItems.length; i++) {
        if (taskItems[i].id == box.id) {
            taskItems[i].isCompleted = !taskItems[i].isCompleted;
            break;
        }
    }

    localStorage.setItem("tasks", JSON.stringify(taskItems));    
}

// localStorage.clear();

let taskItems = JSON.parse(localStorage.getItem("tasks")) || [];
let list = document.getElementById('list');
renderTasks(list, taskItems);

