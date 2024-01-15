// EDIT TASK FUNCTIONS

/**
 * Edits the details of a task in the task information container.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
 function editTask(column, i) {
    let taskInfoContainer = document.getElementById('taskInfoContainer');
    taskInfoContainer.innerHTML = createHtmlForEditTask(column, i);
    assignedPeople = [];
    getValuesForTask(column, i);
    getPrioStatus(column, i);
    getAssignedTo(column, i);
    renderAssignetPeopleForEdit();
    renderAssignetInitials();
    getSubtasks(column, i);
    setsRequiredAttributeForDateInput();
}

/**
 * Retrieves the values of a task and populates the corresponding input fields.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getValuesForTask(column, i) {
    document.getElementById('inputEditTitle').value = tasks[column][i].title;
    document.getElementById('inputEditDescription').value = tasks[column][i].description;
    if (isDesktop()) {
        document.getElementById('due-date').value = tasks[column][i].date;
    } else {
        const dateParts = tasks[column][i].date.split("-");
        document.getElementById('year').value = dateParts[0];
        document.getElementById('months').value = dateParts[1];
        document.getElementById('day').value = dateParts[2];
    }
}

/**
 * Retrieves the priority status of a task and updates the corresponding UI.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getPrioStatus(column, i) {
    let prioStatus = tasks[column][i].prio;
    if (prioStatus == 1) {
        addPrioEditTask(0);
    } else if (prioStatus == 2) {
        addPrioEditTask(1);
    } else {
        addPrioEditTask(2);
    }
}

/**
 * Adds the priority status UI for the selected priority level.
 * 
 * @param {number} status - The index of the priority level.
 */
function addPrioEditTask(status) {
    resetPrioActive(status);
}

/**
 * Resets the priority status UI and highlights the selected priority level.
 * 
 * @param {number} status - The index of the priority level.
 */
function resetPrioActive(status) {
    let buttonId = ['urgentBtn', 'mediumBtn', 'lowBtn'];
    let imageId = ['urgentImage', 'mediumImage', 'lowImage']
    let color = ['#FB3D01', '#FFA800', '#7AE22A']
    for (let i = 0; i < buttonId.length; i++) {
        document.getElementById(buttonId[i]).style = '';
        document.getElementById(imageId[i]).style = '';
        document.getElementById(buttonId[i]).classList.remove('prioActive');
    }
    document.getElementById(buttonId[status]).style = `background-color: ${color[status]}`;
    document.getElementById(imageId[status]).style = 'filter: brightness(0) invert(1);';
    document.getElementById(buttonId[status]).classList.add('prioActive');
    prioValue = status + 1;
}

/**
 * Retrieves the assigned people for a task and updates the assignedPeople array.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getAssignedTo(column, i) {
    let assignedNames = tasks[column][i].assignedTo;
    if (contacts && contacts.length > 0) {
        for (let p = 0; p < contacts.length; p++) {
            const contactName = contacts[p].name;
            if (assignedNames.includes(contactName)) {
                assignedPeopleForEditTask(contactName, true);
            } else {
                assignedPeopleForEditTask(contactName, false);
            }
        }
    }
}

/**
 * Adds an assigned person to the assignedPeople array for editing a task.
 * 
 * @param {string} name - The name of the assigned person.
 * @param {boolean} checked - The checked status of the assigned person.
 */
function assignedPeopleForEditTask(name, checked) {
    let assign = {
        'name': name,
        'assigned': checked
    };
    assignedPeople.push(assign);
}

/**
 * Renders the assigned people list in the edit task form.
 */
function renderAssignetPeopleForEdit() {
    let assignedList = document.getElementById('assignedList');
    assignedList.innerHTML = '';
    for (let i = 0; i < assignedPeople.length; i++) {
        const assign = assignedPeople[i];
        if (assign.assigned === true) {
            assignedList.innerHTML += createHtmlForAssignedList(assign, i, checked)
        } else {
            assignedList.innerHTML += createHtmlForAssignedList(assign, i, unchecked)
        }
    }
}

/**
 * Renders the initials of assigned people for a task.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function renderAssignetInitials() {
    let selectedAssignments = document.getElementById('selectedAssignments');
    selectedAssignments.innerHTML = '';
    for (let i = 0; i < assignedPeople.length; i++) {
        const person = assignedPeople[i].name;
        if (assignedPeople[i].assigned === true) selectedAssignments.innerHTML += createHtmlForAssignedPeopleTask(person);
    }
}

/**
 * Changes the assigned status of an assigned person in the edit task form.
 * 
 * @param {number} i - The index of the assigned person in the assignedPeople array.
 */
function changeAssignedStatus(i) {
    let checkbox = document.getElementById(`checkbox${i}`);
    let status = assignedPeople[i].assigned = !assignedPeople[i].assigned;
    assignedPeople[i].assigned = status;
    if (status) {
        checkbox.src = checked;
    } else {
        checkbox.src = unchecked;
    }
    renderAssignetInitials();
}


/**
 * Retrieves the subtasks for a task and updates the subtasks list in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getSubtasks(column, i, taskInfo) {
    if (taskInfo === 'taskInfo') {
        getSubtasksForTaskInfo(column, i);
    } else {
        let subtaskList = document.getElementById('subtasksList');
        subtaskList.innerHTML = '';
        if (tasks[column][i].subtask && tasks[column][i].subtask.length > 0) {
            for (let s = 0; s < tasks[column][i].subtask.length; s++) {
                const task = tasks[column][i].subtask[s];
                if (task.status == true) {
                    subtaskList.innerHTML += createHtmlForSubtask(task, checked, column, i, s);
                } else {
                    subtaskList.innerHTML += createHtmlForSubtask(task, unchecked, column, i, s);
                }
            }
        }
    }
}

/**
 * Retrieves the subtasks for a task and updates the subtasks list in the task info form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function getSubtasksForTaskInfo(column, i) {
    let subtaskList = document.getElementById('subtaskTaskInfoContainer');
    subtaskList.innerHTML = '';
    if (tasks[column][i].subtask && tasks[column][i].subtask.length > 0) {
        for (let s = 0; s < tasks[column][i].subtask.length; s++) {
            const task = tasks[column][i].subtask[s];
            if (task.status == true) {
                subtaskList.innerHTML += createHtmlForSubtaskTaskInfo(task, checked, column, i, s);
            } else {
                subtaskList.innerHTML += createHtmlForSubtaskTaskInfo(task, unchecked, column, i, s);
            }
        }
    }
}

/**
 * Changes the status of a subtask in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @param {string} id - The ID of the HTML element representing the subtask.
 * @param {number} s - The index of the subtask within the task.
 */
function changeSubtaskStatus(column, i, id, s) {
    let subtaskStatus = document.getElementById(id);
    let status = tasks[column][i].subtask[s].status = !tasks[column][i].subtask[s].status;
    if (status) {
        subtaskStatus.src = checked;
    } else {
        subtaskStatus.src = unchecked;
    }
    renderAllTasks();
}

/**
 * Adds a new subtask to a task in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function addSubtask(column, i) {
    let subtaskInput = document.getElementById('inputSubtask');
    let id = generateRandomId();
    let newSubtast = {
        id: id,
        title: subtaskInput.value,
        status: false,
    };
    if (subtaskInput.value.length > 0) {
        tasks[column][i].subtask.push(newSubtast);
        getSubtasks(column, i);
        subtaskInput.value = '';
    }
}

/**
 * Deletes a subtask from a task.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 * @param {number} s - The index of the subtask within the task.
 */
function deleteSubtask(column, i, s) {
    tasks[column][i].subtask.splice(s, 1);
    getSubtasks(column, i);
}

/**
 * Enables editing mode for a specific subtask. It reveals the input field for editing, 
 * hides the current subtask display, and toggles the edit/save buttons.
 * 
 * @param {Object} column - The column object representing the column containing the subtask.
 * @param {number} i - The index of the task in the column.
 * @param {number} s - The index of the subtask within the task.
 */
function editSubtask(column, i, s) {
    const editInputField = document.getElementById(`editSubtask${s}`);
    const subTask = document.getElementById(`subtaskValue${s}`);
    const editBtn = document.getElementById(`editSubtaskBtn${s}`);
    const saveBtn = document.getElementById(`saveSubtaskBtn${s}`);
    editInputField.classList.remove('dNone');
    subTask.classList.add('dNone');
    editBtn.classList.add('dNone');
    saveBtn.classList.remove('dNone');
    editInputField.value = tasks[column][i].subtask[s].title;
}

/**
 * Saves the edited title of a subtask and updates the task display. This function is called
 * when the user completes editing a subtask and clicks the save button.
 * 
 * @param {Object} column - The column object representing the column containing the subtask.
 * @param {number} i - The index of the task in the column.
 * @param {number} s - The index of the subtask within the task.
 */
function saveEditedSubtask(column, i, s) {
    const editInputField = document.getElementById(`editSubtask${s}`);
    tasks[column][i].subtask[s].title = editInputField.value;
    getSubtasks(column, i);
}

/**
 * Saves the changes made to a task in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
async function saveChangesForTask(column, i) {
    let title = document.getElementById('inputEditTitle').value;
    let description = document.getElementById('inputEditDescription').value;
    let dueDate = isDesktop() ? document.getElementById('due-date').value : getDate();
    let prioStatus = prioValue;
    tasks[column][i].title = title;
    tasks[column][i].description = description;
    tasks[column][i].date = dueDate;
    tasks[column][i].prio = prioStatus;
    saveAssignedPeopleList(column, i);
    await setItem('tasks', JSON.stringify(tasks));
    init();
    openTask(column, i);
    setTimeout(() => {
        alertMessageBoard('Task saved');
    }, 1000); 
    preventScrollingInBackground();
}

/**
 * Retrieves the date from input fields and formats it as a string.
 * Assumes the existence of elements with IDs 'year', 'months', and 'day'.
 * 
 * @returns {string} The formatted date string in 'YYYY-MM-DD' format.
 */
function getDate() {
    const year = document.getElementById('year').value;
    const month = document.getElementById('months').value;
    const day = document.getElementById('day').value;
    const newDate = `${year}-${month}-${day}`;
    return newDate;
}

/**
 * Saves the changes made to the assigned people list in the edit task form.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
function saveAssignedPeopleList(column, i) {
    let changes = [];
    for (let i = 0; i < assignedPeople.length; i++) {
        const person = assignedPeople[i];
        if (person.assigned == true) {
            changes.push(person.name);
        } else {
            continue;
        }
    }
    tasks[column][i].assignedTo = changes;
}

/**
 * Deletes a task from the task list.
 * 
 * @param {string} column - The column the task belongs to.
 * @param {number} i - The index of the task within the column.
 */
async function deleteTask(column, i) {
    tasks[column].splice(i, 1);
    await setItem('tasks', JSON.stringify(tasks));
    init();
    closeWindow('taskInfoContainer');
    preventScrollingInBackground();
}
