let items = document.querySelectorAll('.item');

items.forEach(item => {
  item.draggable = true;
});

list.addEventListener('dragstart', dragStart);
list.addEventListener('dragover', dragOver);
// list.addEventListener('dragenter', dragEnter);
// list.addEventListener('dragleave', dragLeave);
list.addEventListener('drop', dragDrop);

let dragItem = null;

function dragStart(event) {
  console.log('drag started');
  dragItem = event.target;
}

function dragOver(event) {
  event.preventDefault()
  console.log('drag over');
}

function dragDrop(event) {
  console.log('drag dropped');
  event.preventDefault();
  console.log(dragItem);
  if (dragItem) {
    const targetItem = event.target.closest(".item");
    console.log(targetItem);
    if (targetItem !== dragItem) {
      const targetIndex = Array.from(list.children).indexOf(targetItem);
      const draggedIndex = Array.from(list.children).indexOf(dragItem);

      // console.log(targetIndex);
      // console.log(draggedIndex);

      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      let draggedItem = tasks[draggedIndex];

      console.log(tasks);

      if (targetIndex > draggedIndex) {
        list.insertBefore(dragItem, targetItem.nextSibling);
        for (let i = targetIndex; i >= draggedIndex; i--) {
          let swap = tasks[i];
          tasks[i] = draggedItem;
          draggedItem = swap;
        }
      } else {
        list.insertBefore(dragItem, targetItem);
        for (let i = targetIndex; i <= draggedIndex; i++) {
          let swap = tasks[i];
          tasks[i] = draggedItem;
          draggedItem = swap;
        }
      }
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    dragItem = null;
  }
}
