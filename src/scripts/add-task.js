// global variables
let isMobil;
let inBoard;
let prio = null;
let subTasks = [];
let selectedCategoryName;
let selectedCatColor = null;
const prios = ['urgent', 'medium', 'low'];
window.addEventListener('resize', setsRequiredAttributeForDateInput);
let assignedPeopleForTask = [];

/**
 * Initializes the addition of a task.
 * Calls the "loadUsers" function.
 */
async function initAddTask() {
	if (getloggedInStatus() === 'false') window.location.href = 'index.html';
	await includeHTML();
	loadUsers();
	generateLoggedinUserLogo();
}

/**
 * Loads user data from the backend.
 */
async function loadUsers() {
	tasks = JSON.parse(await getItem('tasks'));
}

/**
 * Initializes the task addition functionality.
 * Adds event listeners and loads categories and contacts.
 */
function initAddTasks() {
	document.querySelector('#select-task-category').addEventListener('click', categoryToggler);
	document.querySelector('.new-category__button--check').addEventListener('click', addNewCategory);
	document.querySelector('.assigned-to').addEventListener('click', assignToHandler);
	(() => {
		loadCategories();
		loadContacts();
		setsRequiredAttributeForDateInput();
	})();
	if (!inBoard) {
		addActiveToMenu('addTaskLink');
		addActiveToMenu('mobile-buttonId3');
		document.querySelector('.closeBtn').style.display = 'none';
	}
}

/**
 * Creates a new task with the provided data and saves it in the backend.11
 * Displays a success message and navigates to the board page.
 */
async function createTask() {
	const { value: title } = document.getElementById('title');
	const { value: description } = document.getElementById('description');
	const dueDate = isDesktop() ? document.getElementById('due-date').value : getDate();
	const selectedCategory = { name: selectedCategoryName, color: selectedCatColor };
	if (selectedCategory.name === undefined) {
		highlightField();
	} else {
		const assignees = assignedPeopleForTask;
		const newTask = {
			category: { ...selectedCategory },
			assignedTo: assignees,
			title,
			description,
			prio,
			date: dueDate,
			subtask: subTasks
		};
		createNewTask(newTask);
	}
}

function isDesktop() {
	return window.innerWidth > 750;
}

/**
 * Sets or removes the 'required' attribute for date input fields based on screen size.
 * This function targets elements with specific IDs ('year', 'months', 'day', 'due-date')
 * and updates their 'required' attribute depending on the screen width.
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
 * Retrieves the date from input fields and formats it as a string.
 * Assumes the existence of elements with IDs 'year', 'months', and 'day'.
 * @returns {string} The formatted date string in 'YYYY-MM-DD' format.
 */
function getDate() {
	const year = document.getElementById('year').value;
	const month = document.getElementById('months').value;
	const day = document.getElementById('day').value;
	const newDate = `${year}-${month}-${day}`;
	return newDate;
}


function resetDate() {
	document.getElementById('year').value = '';
	document.getElementById('months').value = '';
	document.getElementById('day').value = '';
}

/**
 * Highlights a field by changing its background color.
 * Targets the element with the ID 'select-task-category' for styling.
 */
function highlightField() {
	document.getElementById('select-task-category').style.backgroundColor = '#f2e8d9';
}


/**
 * Creates a new task.
 * @param {string} newTask - The new task to be added.
 */
async function createNewTask(newTask) {
	const addTaskBtn = document.getElementById('add-task-btn');
	if (taskColumn === undefined) taskColumn = 'toDo';
	tasks[taskColumn].push(newTask);
	await setItem('tasks', JSON.stringify(tasks));
	alertMessage('Task succesfully created');
	addTaskBtn.disabled = true;
	if (isMobil == true) {
		setTimeout(() => {
			closeWindow('modalAddtask');
			resetForm();
			init();
			addTaskBtn.disabled = false;
		}, 1500);
	} else {
		goToBoard();
	}
}

/**
 * Navigates to the board page after a task is created.
 */
function goToBoard() {
	setTimeout(() => window.location.href = "board.html", 1500)
}

/**
 * Adds priority to the task based on the provided value.
 * Updates the UI to reflect the selected priority.
 * @param {number} prioValue - The priority value (0: urgent, 1: medium, 2: low).
 */
function addPrio(priorityValue) {
	resetPrio();
	selectPriority(priorityValue);
	event.preventDefault();
}

/**
 * Selects a priority level and applies corresponding styles to the elements.
 * @param {number} priorityValue - The selected priority value.
 */
function selectPriority(priorityValue) {
	document.getElementById(`${prios[priorityValue]}-btn`).classList.add(`${prios[priorityValue]}-aktiv`);
	document.getElementById(`${prios[priorityValue]}-image`).style.filter = 'brightness(0) invert(1)';
	prio = priorityValue + 1;
}

/**
 * Resets the priority buttons to their default state.
 */
function resetPrio() {
	for (let i = 0; i < prios.length; i++) {
		const priority = prios[i];
		document.getElementById(`${priority}-btn`).classList.remove(`${priority}-aktiv`);
		document.getElementById(`${priority}-image`).style.filter = '';
	}
}

/**
 * Resets the form to its default state.
 */
function resetForm() {
	document.getElementById('title').value = '';
	document.getElementById('description').value = '';
	document.getElementById('selected-category').innerHTML = 'Select task category';
	document.getElementById('inicial-circles').innerHTML = '';
	document.querySelector('.assigned-to').style.display = 'flex';
	document.querySelector('.assigned-to__list').style.display = 'none';
	removeContactCheckboxes();
	document.getElementById('due-date') ? document.getElementById('due-date').value = '' : resetDate();
	resetPrio();
	subTasks = [];
	selectedCategoryName = undefined;
	composeSubTasks(subTasks);
	closeSubtaskEditor();
}

/**
 * Removes the selected contact checkboxes.
 */
function removeContactCheckboxes() {
	const contactCheckboxes = document.querySelectorAll('.contact__checkbox');
	for (let i = 0; i < contactCheckboxes.length; i++) {
		const element = contactCheckboxes[i];
		if (element.checked) {
			element.checked = false;
		}
	}
}

/**
 * Load contacts.
 */
async function loadContacts() {
	let contactsSingleQuote = await getItem('contacts');
	contacts = JSON.parse(contactsSingleQuote.replace(/'/g, '"'));
	document.querySelector('.assigned-to__list').innerHTML = '';
	document.querySelector('.assigned-to__list').innerHTML += contactListHTML();
	for (let i = 0; i < contacts.length; i++) {
		document.querySelector('.assigned-to__list').innerHTML += contactListElementsHTML(contacts, i, unchecked);
	}
}

/**
 * Toggles the checkbox state and updates the list of assigned people for a task.
 * Also updates the visual representation of assigned people.
 * @param {number} i - The index of the checkbox in the list.
 * @param {Object} person - The person object associated with the checkbox.
 */
function checkbox(i, person) {
	const status = collectAssignedPeople(person);
	const checkbox = document.getElementById(`checkbox${i}`);
	renderAssignedPeopleInitinals();
	if (status === -1) {
		checkbox.src = checked;
	} else {
		checkbox.src = unchecked;
	}
}

/**
 * Adds or removes a person to/from the list of assigned people for a task.
 * @param {Object} person - The person to be added or removed.
 */
function collectAssignedPeople(person) {
	const index = assignedPeopleForTask.indexOf(person);
	if (index === -1) {
		assignedPeopleForTask.push(person);
	} else {
		assignedPeopleForTask.splice(index, 1);
	}
	return index;
}

/**
 * Renders the initials of assigned people in a designated container.
 * It clears the container and then repopulates it based on the current state of 'assignedPeopleForTask'.
 */
function renderAssignedPeopleInitinals() {
	let assignContainer = document.getElementById('inicial-circles');
	assignContainer.innerHTML = '';
	for (let i = 0; i < assignedPeopleForTask.length; i++) {
		assignContainer.innerHTML += createHtmlForAssignedPeopleTask(assignedPeopleForTask[i]);
	}
}

/**
 * Handles the click event to display the list of assigned contacts.
 */
function assignToHandler() {
	document.querySelector('.assigned-to__list').style.display = 'flex';
	document.querySelector('.assigned-to').style.display = 'none';
}

/**
 * Handles the click event when selecting a contact from the assigned contacts list.
 */
function assignToHandlerInList() {
	document.querySelector('.assigned-to__list').style.display = 'none';
	document.querySelector('.assigned-to').style.display = 'flex';
}

/**
 * Adds a new subtask to the task.
 * Validates the input value and adds the subtask to the subTasks array.
 */
function addSubtaskAddTask() {
	const subTaskId = generateRandomId();
	const value = document.querySelector('.subtask__input').value;
	if (value !== '') {
		const subTask = {
			id: subTaskId,
			title: value,
			status: false,
		};
		subTasks.push(subTask);
		composeSubTasks(subTasks);
		document.querySelector('.subtask__actions').style.display = 'none';
		document.querySelector('.subtask__plus').style.display = 'block';
	} else {
		alert("Please enter a subtask");
	}
	document.querySelector('.subtask__input').value = '';
}

/**
 * Opens the subtask editor to add a new subtask.
 * Resets the input value and displays the necessary elements.
 */
function openSubtaskEditor() {
	document.querySelector('.subtask__input').value = '';
	document.querySelector('.subtask__actions').style.display = 'flex';
	document.querySelector('.subtask__plus').style.display = 'none';
}

/**
 * Closes the subtask editor without adding a new subtask.
 * Hides the input field and actions, and shows the plus icon.
 */
function closeSubtaskEditor() {
	document.querySelector('.subtask__actions').style.display = 'none';
	document.querySelector('.subtask__plus').style.display = 'block';
	document.querySelector('.subtask__input').value = '';
}

/**
 * Displays the added subtasks on the webpage.
 * Creates HTML markup for each subtask and updates the subtasks-list element.
 * @param {object[]} subTasks - An array of subtask objects.
 */
function composeSubTasks(subTasks) {
	document.querySelector('.subtasks-list').style.display = 'block';
	document.querySelector('.subtasks-list').innerHTML = '';
	if (subTasks) {
		for (let i = 0; i < subTasks.length; i++) {
			document.querySelector('.subtasks-list').innerHTML += subTaskHTML(subTasks, i);
		}
	} else {
		document.querySelector('.subtasks-list').innerHTML = '';
	}
}

/**
 * Removes a subtask from the subTasks array and updates the displayed subtasks.
 * @param {string} id - The ID of the subtask to be removed.
 */
function removeSubtask(id) {
	const filteredSubtasks = subTasks.filter((sub) => sub.id !== id.toString());
	subTasks = filteredSubtasks;
	composeSubTasks(filteredSubtasks);
}

/**
 * Generates a random ID for a subtask.
 * @returns {string} A random ID as a string.
 */
function generateRandomId() {
	const random = Math.floor(Math.random() * 1000000);
	return random.toString();
}

/**
 * Adds an event listener to submit the subtask on pressing the Enter key.
 */
function submitOnEnter() {
	let input = document.getElementById('subtask-input');
	input.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			addSubtaskAddTask();
		}
	});
}

/**
 * Displays an alert message on the webpage.
 * @param {string} message - The message to be displayed in the alert.
 */
function alertMessage(message) {
	let taskCreatedAlert = document.getElementById('TaskCreatedAlert');
	taskCreatedAlert.innerHTML = message;
	taskCreatedAlert.classList.remove('dNone')
	setTimeout(() => taskCreatedAlert.classList.add('dNone'), 2000);
}

/**
 * Resets the styling of the select task category element.
 * Removes the custom border and border-radius styles.
 */
function resetSelectCategory() {
	document.querySelector('.select-task-category').style.borderBottom = '1px solid #a8a8a8';
	document.querySelector('.select-task-category').style.borderRadius = '10px';
}

/**
 * Sets the minimum value for all elements with the name "due-date" to today's date.
 */
function limitDueDate() {
	let today = new Date().toISOString().split('T')[0];
	for (let i = 0; i < document.getElementsByName("due-date").length; i++) {
		document.getElementsByName("due-date")[i].setAttribute('min', today);
	}
}