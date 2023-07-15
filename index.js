var task_id = 201;
var tasks = [];
var apiData = [];

// Function for rendering the html using the content stored inside the array
function renderTasks (list, taskList) {
    for (let i=0; i<taskList.length; i++) {

        // Creating a new div element for list of item
        let newItem = document.createElement("div");
        newItem.classList.add("item")

        // Creating a paragraph element for the title of the task
        let newPara = document.createElement("p");
        newPara.innerText = taskList[i].title;
        newItem.appendChild(newPara);

        // Creating a edit button for editing the title of a task
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.id = taskList[i].id;
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", function () {
            editItem(this);
        })
        newItem.appendChild(editBtn);

        // Creating a delete button for deleting a particular task
        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function() {
            deleteItem(this);
        });
        deleteBtn.id = taskList[i].id;
        newItem.appendChild(deleteBtn);

        list.appendChild(newItem);
        document.getElementById("new-work").value = "";
    }
}

// Function for adding a new element into the array and rerenders the whole html
function addNewItem () {
    let newWork = document.getElementById("new-work").value;
    if (newWork.trim() !== "") {
        tasks.push({id: task_id, title: newWork});
        task_id++;
    }
    let list = document.getElementById('list');
    list.innerHTML = "";
    renderTasks(list, tasks);
}

// Function for deleting a new element from the list and rerenders the whole html
function deleteItem(btn) {
    let list = document.getElementById('list');
    let apiList = document.getElementById('api-list');

    if (btn.id <= 200) {
        deleteFromArray(btn.id, apiData);
        apiList.innerHTML = "";
        renderTasks(apiList, apiData);
    } else {
        deleteFromArray(btn.id, tasks);
        list.innerHTML = "";
        renderTasks(list, tasks);
    }
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
    if (btn.id <= 200) {
        for (let i=0; i<apiData.length; i++) {
            if (apiData[i].id == btn.id) {
                apiData[i].title = para.innerText;
                break;
            }
        }
    } else {
        for (let i=0; i<tasks.length; i++) {
            if (tasks[i].id == btn.id) {
                tasks[i].title = para.innerText;
                break;
            }
        }
    }
}



// Fetching Data from API

fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        if (apiData.length === 0) {
            apiData = data;
            let apiList = document.getElementById("api-list");
            renderTasks(apiList, data);
        }
    })
    .catch ((error) => {
        console.log("Error: ", error.message)
    })



