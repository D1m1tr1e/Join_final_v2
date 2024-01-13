/**
 * Gets the color index for the initials of a contact.
 * 
 * Retrieves the contact's name and extracts the first letter of the second part (assuming it follows the format "Firstname Lastname").
 * Converts the first letter to lowercase and calculates its corresponding index based on the ASCII code.
 * The index represents a color that can be used to style the contact's initials.
 * 
 * @param {Object} contact - The contact object.
 * @returns {number} - The color index for the contact's initials.
 */
function getColorForInitials(contact) {
    let name = contact.name;
    let firstLetter = name.split(' ')[1][0].toLowerCase();
    let index = firstLetter.charCodeAt(0) - 'a'.charCodeAt(0);
    return index;
}

/**
 * Toggles the visibility of the new contact window.
 * 
 * Retrieves the main contact container and the add contact container from the HTML.
 * Toggles the 'dNone' (display-none) class to show or hide the contact container.
 * Adds and removes CSS classes to animate the fading in/out effect of the containers.
 */
function openAndCloseNewContactWindow() {
    let contactContainer = document.getElementById('addContactMainContainer');
    let addContactContainer = document.getElementById('addContactContainer');
    contactContainer.classList.toggle('dNone');
    contactContainer.classList.toggle('fadeInMainContainer');
    setTimeout(function () {
        addContactContainer.classList.toggle('fadeInContainer');
    }), 500;
}

/**
 * Displays an alert message to the user.
 * 
 * Retrieves the contact created alert element from the HTML.
 * Sets the message content of the alert.
 * Removes the 'dNone' class to display the alert.
 * After a delay of 4 seconds, adds the 'dNone' class to hide the alert.
 * 
 * @param {string} message - The message to display in the alert.
 */
function alertMessage(message) {
    let contactCreatedAlert = document.getElementById('contactCreatedAlert');
    contactCreatedAlert.innerHTML = message;
    contactCreatedAlert.classList.remove('dNone')
    setTimeout(function () {
        contactCreatedAlert.classList.add('dNone')
    }, 4000);
}

/**
 * Empties the input fields for name, email, and phone.
 * 
 * @param {string} name - The input field for name.
 * @param {string} email - The input field for email.
 * @param {string} phone - The input field for phone.
 */
function emptyInputFields(name, email, phone) {
    name.value = '';
    email.value = '';
    phone.value = '';
}

/**
 * Empties the full contact card container.
 */
function emptyContainer() {
    let fullContactCard = document.getElementById('fullContactCard');
    fullContactCard.innerHTML = '';
}

/**
 * Updates the local contact in the group with the edited contact details.
 * 
 * @param {number} i - Index of the group.
 * @param {number} j - Index of the contact within the group.
 * @param {number} contactsIndex - Index of the contact in the contacts array.
 */
function changeContactLocalForCard(i, j, contactsIndex) {
    groups[i][j] = contacts[contactsIndex];
    openContact(i, j);
}

/**
 * Checks if a contact with the given name already exists in the contact list.
 * 
 * @param {string} name - The name of the contact to check.
 * @returns {boolean} - Indicates whether a contact with the given name already exists.
 */
function checkIfContactsExists(name) {
    let checkName = name.toLowerCase();
    for (let i = 0; i < contacts.length; i++) {
        const contactName = contacts[i].name.toLowerCase();
        if (contactName == checkName) {
            alertMessage('Contact exists already');
            return true;
        }
    }
}

/**
 * Checks the index of a contact in the contacts array based on the contact's name.
 * 
 * @param {string} name - The name of the contact to check.
 * @returns {number} - The index of the contact in the contacts array.
 */
function checkIndexContacts(name) {
    for (let i = 0; i < contacts.length; i++) {
        const contactName = contacts[i].name;
        if (contactName == name) {
            return i;
        }
    }
}

/**
 * Adds the 'active' class to the selected contact card and removes it from other active cards.
 * 
 * Finds all elements with the 'active' class and removes the class from each element.
 * Adds the 'active' class to the selected contact card specified by the group and contact indices.
 * 
 * @param {number} i - Index of the group.
 * @param {number} j - Index of the contact within the group.
 */
function addActiveClass(i, j) {
    let elements = document.querySelectorAll('.active');
    elements.forEach((element) => {
        element.classList.remove('active');
    });
    let active = document.getElementById(`contactCard${i}${j}`);
    active.classList.add('active');
}

/**
 * Toggles the fade-in effect for the full contact card view.
 * 
 * @param {string} status - The status of the fade-in effect: 'on' to enable, 'off' to disable.
 */
function fadeInCard(status) {
    if (status == 'on') {
        let card = document.getElementById('fullContactCard');
        card.classList.add('fadeInCard');
    } else {
        let card = document.getElementById('fullContactCard');
        card.classList.remove('fadeInCard');
    }

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