let items = document.querySelectorAll('.item');
// let listItems = document.querySelector('list');

console.log((list));

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

            if (targetIndex > draggedIndex) {
                list.insertBefore(dragItem, targetItem.nextSibling);
            } else {
                list.insertBefore(dragItem, targetItem);
            }
        }
        dragItem = null;
    }
}
