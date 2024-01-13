let delayedSearch = debounce(filterTasks);

/**
 * Asynchronously retrieves and filters tasks from the backend.
 * It parses the stored tasks and filters out any invalid tasks using the 'taskIsValid' function.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing filtered tasks.
 */
async function checkTasks() {
    const tasks = JSON.parse(await getItem('tasks'));
    let filteredTasks = Object.keys(tasks).reduce((result, key) => {
        result[key] = tasks[key].filter(taskIsValid);
        return result;
    }, {});
    return filteredTasks;
}


function taskIsValid(task) {
    return task !== null;
}

/**
 * Initializes an event listener on the search input field. The listener triggers the 'filterTasks' 
 * function whenever there is an input event
 */
function startFilterEventListener() {
    document.getElementById('inputSearch').addEventListener('input', delayedSearch);
}




function debounce(db, delay = 500) {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            db();
        }, delay);
    }
}

/**
 * Renders tasks for all categories ('toDo', 'inProgress', 'feedback', 'done').
 * Assumes the existence of a global 'tasks' object containing tasks categorized by their status.
 */
function renderAllTasks() {
    renderTasks(tasks, 'toDo', 'toDo');
    renderTasks(tasks, 'inProgress', 'inProgress');
    renderTasks(tasks, 'feedback', 'feedback');
    renderTasks(tasks, 'done', 'done');
}


window.addEventListener('resize', setsRequiredAttributeForDateInput);


function isDesktop() {
    return window.innerWidth > 750;
}

/**
 * Adjusts the 'required' attribute on date input fields based on the screen width.
 * If the screen width is less than 750 pixels, it sets the 'required' attribute on individual
 * year, month, and day fields and removes it from the 'due-date' field.
 * For wider screens, it does the opposite: sets 'required' on the 'due-date' field and removes it from the individual fields.
 */
function setsRequiredAttributeForDateInput() {
    const screen = window.innerWidth;
    const year = document.getElementById('year');
    const month = document.getElementById('months');
    const day = document.getElementById('day');
    const desktop = document.getElementById('due-date');
    if (screen < 750) {
        desktop.removeAttribute('required');
        year.setAttribute('required', '');
        month.setAttribute('required', '');
        day.setAttribute('required', '');
    } else {
        desktop.setAttribute('required', '');
        year.removeAttribute('required');
        month.removeAttribute('required');
        day.removeAttribute('required');
    }
}

/**
 * Handles key press events for a given input field, specifically looking for the Enter key.
 * If the Enter key is pressed, it prevents the default action (form submission) and triggers the addition of a subtask.
 *
 * @param {Event} event - The key press event object.
 * @param {Object} column - The column object where the subtask is to be added.
 * @param {number} i - The index indicating the specific position in the column where the subtask will be added.
 * @returns {boolean} False if the Enter key is pressed to prevent default action, true otherwise.
 */
function handleKeyPress(event, column, i) {
    if (event.keyCode === 13) {
        event.preventDefault();
        addSubtask(column, i);
        return false;
    }
    return true;
}

/**
 * Truncates the text to a specified maximum length and adds ellipsis if necessary.
 * 
 * @param {string} text - The text to truncate.
 * @returns {string} - The truncated text.
 */
function truncateText(text) {
    let maxLength = 30;
    if (text.length > maxLength) {
        let abridgedText = text.slice(0, maxLength) + '...';
        return abridgedText;
    } else {
        return text;
    }
}

/**
 * Checks the number of finished subtasks.
 * 
 * @param {Array} subtask - An array of subtasks.
 * @returns {number} - The number of finished subtasks.
 */
function checkIfSubtaskIsDone(subtask) {
    let finishedSubtasks = 0;
    for (let i = 0; i < subtask.length; i++) {
        const status = subtask[i].status;
        if (status == true) {
            finishedSubtasks++
        } else {
            continue;
        }
    }
    return finishedSubtasks;
}

/**
 * Calculates the progress percentage based on the number of finished subtasks and the total subtask length.
 * 
 * @param {number} subtasklength - The total number of subtasks.
 * @param {number} finishedSubtasks - The number of finished subtasks.
 * @returns {number} - The progress percentage rounded to two decimal places.
 */
function calculateProgress(subtasklength, finishedSubtasks) {
    let result = finishedSubtasks / subtasklength * 100;
    let roundedResult = result.toFixed(2);
    return roundedResult;
}

/**
 * Checks the priority status and returns either the image path or the corresponding word.
 * 
 * @param {number} prio - The priority value.
 * @param {string} returnTyp - The return type: 'path' for image path, 'word' for corresponding word.
 * @returns {string} - The image path or corresponding word based on the priority.
 */
// 
function checkPrioStatus(prio, returnTyp) {
    let priorities = {
        1: ['src/img/img_board/urgent_prio.png', 'Urgent'],
        2: ['src/img/img_board/medium_prio.png', 'Medium'],
        3: ['src/img/img_board/low_prio.png', 'Low']
    }
    let defaultPrio = 3;
    let priority = priorities[prio] || priorities[defaultPrio];
    if (returnTyp == 'path') {
        return priority[0];
    } else if (returnTyp == 'word') {
        return priority[1];
    }
}

/**
 * Retrieves the color associated with a given priority level.
 *
 * @param {number} prio - The priority level.
 * @returns {string} The color associated with the priority level.
 */
function getPrioColor(prio) {
    let colors = ['#FB3D01', '#FFA800', '#7AE22A'];
    return colors[prio - 1];
}

/**
 * Gets the color for the initials of a name based on the second part of the name.
 * 
 * @param {string} name - The name to get the initials color for.
 * @returns {string} - The color for the initials.
 */
function getColorForInitials(name) {
    let firstLetter = name.split(' ')[1][0].toLowerCase();
    let index = firstLetter.charCodeAt(0) - 'a'.charCodeAt(0);
    return initialsColors[index];
}

/**
 * Replaces umlaut characters in a string with their respective ASCII representations.
 * 
 * @param {string} value - The input string to process.
 * @returns {string} - The input string with umlaut characters replaced.
 */
function deUmlaut(value) {
    value = value.toLowerCase();
    value = value.replace(/ä/g, 'ae');
    value = value.replace(/ö/g, 'oe');
    value = value.replace(/ü/g, 'ue');
    return value;
}

/**
 * Prevents the event from propagating further.
 * 
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * This function closes a window or modal with the given ID by adding the "dNone" class to hide it.
 * It also calls the "preventScrollingInBackground" function to prevent scrolling of the background content.
 *
 * @param {string} id - The ID of the window or modal element to close.
 */
function closeWindow(id) {
    let windowContainer = document.getElementById(id);
    windowContainer.classList.add('dNone');
    preventScrollingInBackground();
}

/**
 * This function assigns an action to the "assignedToInput" element based on the given action parameter.
 * If the action is 'close', it removes the 'openAssigned' class from the element.
 * If the action is 'toggle', it toggles the presence of the 'openAssigned' class on the element.
 *
 * @param {string} action - The action to assign to the "assignedToInput" element.
 */
function assignAction(action) {
    const assignedToInput = document.getElementById('assignedToInput');
    if (action === 'close') {
        assignedToInput.classList.remove('openAssigned');
    } else if (action === 'toggle') {
        assignedToInput.classList.toggle('openAssigned');
    }
}

/**
 * Adds an event listener for the Enter key on the input field.
 * @param {number} column - The column index.
 * @param {number} i - The task index.
 */
function addEnterListener(column, i) {
    let input = document.getElementById('inputSubtask');
    if (input) {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                addSubtask(column, i);
            }
        });
    }
}

/**
 * Checks the boolean value and returns 'checked' if true, otherwise returns undefined.
 * 
 * @param {boolean} value - The boolean value to check.
 * @returns {string|undefined} - 'checked' if the value is true, undefined otherwise.
 */
function checkBooleanValue(value) {
    if (value == true) {
        return 'checked';
    } else {
        return;
    }
}

/**
 * Generates a random ID for tasks or elements.
 * 
 * @returns {string} - The randomly generated ID.
 */
function generateRandomId() {
    const random = Math.floor(Math.random() * 1000000);
    return random.toString();
}

/**
 * Toggles the prevention of background scrolling by adding/removing the CSS class 'preventScrolling' to the main container.
 */
function preventScrollingInBackground() {
    let mainContainer = document.getElementById('boardMainContainer');
    mainContainer.classList.toggle('preventScrolling');
}

/**
 * Checks if a task has subtasks and updates the visibility of the subtask progress bar.
 * 
 * @param {Object} task - The task object.
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function checkIfSubtask(task, column, i) {
    let progressBar = document.getElementById(`subtaskBar${column}${i}`);
    let subtask = task.subtask.length;
    if (subtask == 0) {
        progressBar.classList.add('dNone');
    } else {
        return;
    }
}

/**
 * This function sets a minimum date for input fields with the name "dueDate",
 * ensuring that past dates are not selectable.
 * It retrieves the current date and sets it as the minimum value for each "dueDate" input field.
 */
function noPastDate() {
    let today = new Date().toISOString().split('T')[0];
    for (let i = 0; i < document.getElementsByName("dueDate").length; i++) {
        document.getElementsByName("dueDate")[i].setAttribute('min', today);
    }
}

/**
 * Displays an alert message for a specified duration. The message is set as the innerHTML 
 * of an element with the ID 'register-alert' and is visible for 4000 milliseconds.
 * 
 * @param {string} message - The message to be displayed in the alert.
 */
function alertMessageBoard(message) {
    const taskAlert = document.getElementById('task-alert');
    const taskContainer = document.querySelector('.taskEditContainer');
    taskAlert.innerHTML = message;
    taskAlert.classList.remove('dNone')
    taskContainer.style.overflow = 'hidden';
    setTimeout(function () {
        taskAlert.classList.add('dNone')
    }, 3000);
}