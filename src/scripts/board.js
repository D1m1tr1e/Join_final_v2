const checked = 'src/img/checked.png';
const unchecked = 'src/img/unchecked.png';

/**
 * Initializes the application by retrieving tasks and contacts from storage, and rendering the tasks in each column.
 * 
 * Retrieves the tasks and contacts from storage.
 * Renders the tasks in the 'toDo', 'inProgress', 'feedback', and 'done' columns.
 */
async function init() {
    if(getloggedInStatus() === 'false') window.location.href = 'index.html';
    inBoard = true;
    await includeHTML();
    startFilterEventListener();
    tasks = await checkTasks();
    contacts = JSON.parse(await getItem('contacts'));
    renderAllTasks();
    addActiveToMenu('boardLink');
    addActiveToMenu('mobile-buttonId2');
    generateLoggedinUserLogo();
}

/**
 * Renders the tasks for a specific column.
 * 
 * @param {Object} array - The tasks object.
 * @param {string} column - The column to render.
 * @param {string} id - The ID of the HTML element representing the column.
 */
function renderTasks(array, column, id) {
    let columnId = document.getElementById(id)
    columnId.innerHTML = '';
    if (array[column].length == 0) {
        columnId.innerHTML = createHtmlForEmptyCategory();
    }
    for (let i = 0; i < array[column].length; i++) {
        const task = array[column][i];
        if (task) {
            columnId.innerHTML += createHtmlForTasks(task, column, i);
            renderInitinalsForAssingetPeople(column, i);
            checkIfSubtask(task, column, i);
        }
    }
}

/**
 * Renders the initials of assigned people for a specific task in a column.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function renderInitinalsForAssingetPeople(column, i) {
    let assignedTo = document.getElementById(`assignedTo${column}${i}`);
    if (tasks[column][i].assignedTo && tasks[column][i].assignedTo.length > 0) {
        for (let p = 0; p < tasks[column][i].assignedTo.length; p++) {
            const person = tasks[column][i].assignedTo[p];
            if (p < 3) {
                assignedTo.innerHTML += createHtmlForAssignedPeopleTask(person);
            } else {
                assignedTo.innerHTML += createHtmlForAdditional(tasks[column][i].assignedTo.length - 3);
                return;
            }
        }
    }
}

/**
 * Opens the task information container and renders the details of the selected task.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function openTask(column, i) {
    let taskInfoContainer = document.getElementById('taskInfoContainer');
    taskInfoContainer.classList.remove('dNone');
    taskInfoContainer.innerHTML = createHtmlForTaskInfo(column, i);
    renderAssignetPeople(column, i);
    preventScrollingInBackground();
    getSubtasks(column, i, 'taskInfo');
}

/**
 * Renders the assigned people for a specific task in the task information container.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function renderAssignetPeople(column, i) {
    let assignedToContainer = document.getElementById('assignedToContainer');
    if (tasks[column][i].assignedTo && tasks[column][i].assignedTo.length > 0) {
        for (let p = 0; p < tasks[column][i].assignedTo.length; p++) {
            const person = tasks[column][i].assignedTo[p];
            assignedToContainer.innerHTML += createHtmlForAssignedPeople(person);
        }
    } else {
        return;
    }
}


// FILTER FUNCTIONS

/**
 * Filters the tasks based on the search input.
 */
function filterTasks() {
    let column = ['toDo', 'inProgress', 'feedback', 'done'];
    let search = document.getElementById('inputSearch').value;
    search = search.toLowerCase().trim();
    for (let c = 0; c < column.length; c++) {
        const space = column[c];
        if (search.length > 0) {
            filteredTasks[space] = tasks[space].filter( t => checkIfIncluded(t, search) );
            renderTasks(filteredTasks, space, space);
        } else {
            init();
        }
    }
}

/**
 * Checks if a task is included in the search results.
 * 
 * @param {Object} t - The task object.
 * @param {string} search - The search input.
 * @returns {boolean} - True if the task is included in the search results, false otherwise.
 */
function checkIfIncluded(t, search) {
    return t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search);
}






//****************** */ DRAG & DROP FUNTIONS

/**
 * Allows the dropping of elements during drag and drop.
 * 
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Starts dragging a task to prepare for drag and drop.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function startDragging(column, i) {
    currentDraggedTask = {
        'column': column,
        'position': i
    }
}

/**
 * Moves a task to a different category during drag and drop.
 * 
 * @param {string} category - The category to move the task to.
 */
async function moveTo(category) {
    let column = currentDraggedTask.column;
    let position = currentDraggedTask.position;
    let toMoveTask = tasks[column].splice(position, 1)[0];
    tasks[category].push(toMoveTask);
    await setItem('tasks', JSON.stringify(tasks));
    renderAllTasks();
}

/**
 * This function opens the "Add Task" section by removing the "dNone" class from the "modalAddtask" element.
 * It makes the "Add Task" section visible on the page.
 */
function openAddtaskSection(column) {
    document.getElementById('modalAddtask').classList.remove('dNone');
    isMobil = true;
    taskColumn = column;
}

/**
 * Moves a task to the "Mobil" column on mobile view.
 * 
 * @param {string} column - The column the task currently belongs to.
 * @param {number} i - The index of the task within the column.
 */
function moveToMobil(column, i) {
    renderMoveToMobil(column, i)
}

/**
 * Renders the "Move to Mobil" option for a task on mobile view.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function renderMoveToMobil(column, i) {
    let smallTask = document.getElementById(`moveFromBox${column}${i}`);
    startEventListenerMoveTo(smallTask);
    smallTask.classList.remove('dNone');
    smallTask.innerHTML = createHtmlMoveTo(column, i);
}

/**
 * Adds a click event listener to the document that hides the specified element 
 * if a click occurs outside of it. This is commonly used for implementing click-away 
 * behaviors for modals, dropdowns, or other overlay elements.
 *
 * @param {HTMLElement} element - The DOM element that will be hidden when clicking outside of it.
 */
function startEventListenerMoveTo(element) {
    document.addEventListener('click', (event) => {
        if (!element.contains(event.target)) {
            element.classList.add('dNone');
        }
    })
}

/**
 * Moves a task to a different category.
 * 
 * @param {string} goal - The category to move the task to.
 * @param {string} column - The column the task currently belongs to.
 * @param {number} i - The index of the task within the column.
 */
async function moveToCategory(goal, column, i) {
    tasks[goal].push(tasks[column].splice(i, 1)[0]);
    await setItem('tasks', JSON.stringify(tasks));
    renderAllTasks();
}