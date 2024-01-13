/**
 * Generates the HTML for adding a new category.
 * @returns {string} - The HTML string representing the new category element.
 */
function addCategoryHTML() {
	return /*html*/ `
        <li class='category-task' onclick="newCategoryHandler()">
            <div>New Category</div>
        </li>`;
}

/**
 * Generates the HTML for a category element.
 * @param {string} category - The category name.
 * @param {string} color - The color code for the category.
 * @returns {string} - The HTML string representing the category element.
 */
function categoryHTML(category, color) {
	return /*html*/ `
        <li class='category-task' onclick="selectCategory('${category}', '${color}')">
            <div>${category}</div>
            <div class="color-dot ${color}" style="background-color: ${color}"></div>
        </li>`;
}

/**
 * Generates the HTML for the contact list.
 * @returns {string} - The HTML string representing the contact list element.
 */
function contactListHTML() {
    return `
    <li onclick="assignToHandlerInList()" class="assigned-to__list-action">
                <div class="assigned-to__in-list">
                        <span>Select contact to assign</span>
                        <img src="./src/img/img_add_task/triangle.svg">
                </div>
            </li>`;
}

/**
 * Generates the HTML for contact list elements.
 * @param {Array} contacts - The list of contacts.
 * @param {number} i - The index of the contact.
 * @returns {string} - The HTML string representing the contact list element.
 */
function contactListElementsHTML(contacts, i, status) {
    return `<li onclick="doNotClose(event); checkbox(${i}, '${contacts[i].name}')" class="contact"><span>${contacts[i].name}</span><img id="checkbox${i}" src="${status}"/></li>`;
}


/**
 * Creates the HTML code for rendering the initials of an assigned person (used in task view).
 * 
 * @param {string} person - The name of the assigned person.
 * @returns {string} - The HTML code for rendering the assigned person's initials.
 */
function createHtmlForAssignedPeopleTask(person) {
    let initialsColor = getColorForInitials(person)
    let nameWithoutUmlauts = deUmlaut(person);
    let initials = nameWithoutUmlauts.match(/\b\w/g).join('').toUpperCase();
    return `
        <div class="assignedPersonInitials">
            <div class="initials" style="background-color: ${initialsColor}">${initials}</div>
        </div>
    `;
}

/**
 * Generates the HTML for a subtask element.
 * @param {Array} subTasks - The list of subtasks.
 * @param {number} i - The index of the subtask.
 * @returns {string} - The HTML string representing the subtask element.
 */
function subTaskHTML(subTasks, i) {
    return `
    <li class='subtask'> <div class='subtask__title-box'><span class='subtask__square'></span><div class="subtaskText">${subTasks[i].title}</div></div> <div class='subtask__remove' onclick='removeSubtask(${subTasks[i].id})'></div></li>
    `;
}

/**
 * Generates the HTML for the selected category heading.
 * @param {string} category - The selected category name.
 * @param {string} color - The color code for the category.
 * @returns {string} - The HTML string representing the selected category heading.
 */
function selectedCategoryHTML(category, color) {
    return `<span class='selected-category-heading'>${category} <span class='color-dot' style="background-color: ${color}"></span></span>`;
}