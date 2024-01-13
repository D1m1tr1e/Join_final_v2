/**
 * Initializes the contact list application.
 * - Parses the contacts from the stored data.
 * - Orders the contacts alphabetically.
 * - Renders the contacts in the UI.
 */
async function init() {
    if(getloggedInStatus() === 'false') window.location.href = 'index.html';
    await includeHTML();
    contacts = JSON.parse(await getItem('contacts'));
    orderContacts();
    renderContacts();
    addActiveToMenu('contactsLink');
    addActiveToMenu('mobile-buttonId4');
    generateLoggedinUserLogo();
}

// CONTACT-LIST FUNCTIONS


/**
 * Orders the contacts alphabetically.
 * @returns {Array} - An array of groups, where each group contains contacts starting with the same letter.
 */
function orderContacts() {
    groups = [];
    contacts.forEach(function (contact) {
        let firstLetter = contact.name.charAt(0).toLowerCase();
        let index = firstLetter.charCodeAt(0) - 'a'.charCodeAt(0);
        if (!groups[index]) {
            groups[index] = [contact];
        } else {
            groups[index].push(contact);
        }
    });
    return groups;
}

/**
 * Renders the contacts in the UI.
 */
function renderContacts() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    for (let i = 0; i < groups.length; i++) {
        if (!groups[i]) continue;
        if (groups[i].length > 0) {
            let firstLetter = groups[i][0].name.charAt(0).toUpperCase();
            contactList.innerHTML += createHtmlForOrder(firstLetter);
            for (let j = 0; j < groups[i].length; j++) {
                const contact = groups[i][j];
                contactList.innerHTML += createHtmlForContact(contact, i, j);
            }
        }
    }
}


// CREATE-CONTACT FUNCTIONS


/**
 * Renders the window for creating a new contact.
 */
function renderCreateContactWindow() {
    let addContactContainer = document.getElementById('addContactContainer');
    addContactContainer.innerHTML = createHtmlForCreateContact();
    setTimeout(openAndCloseNewContactWindow(), 200);
}

/**
 * Adds a new contact to the contact list.
 * - Retrieves input values for name, email, and phone.
 * - Creates a new contact object.
 * - Checks if the contact already exists in the list.
 * - Adds the new contact to the list, updates the UI, and stores the updated list.
 * - Initializes the application.
 */
async function addContact() {
    let name = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    let phone = document.getElementById('inputPhone').value;
    let newContact = {
        "name": name,
        "email": email,
        "phone": phone
    };
    if (checkIfContactsExists(name)) return;
    contacts.push(newContact);
    emptyInputFields(name, email, phone);
    openAndCloseNewContactWindow();
    alertMessage('Contact succesfully created');
    await setItem('contacts', JSON.stringify(contacts));
    init();
}


// EDIT-CONTACT FUNCTIONS


/**
 * Renders the window for editing a contact.
 * @param {number} i - Index of the group.
 * @param {number} j - Index of the contact within the group.
 */
function renderEditContactWindow(i, j) {
    let addContactContainer = document.getElementById('addContactContainer');
    let contact = groups[i][j];
    let contactsIndex = checkIndexContacts(contact.name);
    addContactContainer.innerHTML = createHtmlForEditContact(contact, contactsIndex, j, i);
    getValuesForInput(contact);
    setTimeout(openAndCloseNewContactWindow(), 200);
}

/**
 * Retrieves contact values and sets them as input values.
 * @param {Object} contact - The contact object.
 */
function getValuesForInput(contact) {
    document.getElementById('inputName').setAttribute('value', contact.name);
    document.getElementById('inputEmail').setAttribute('value', contact.email);
    document.getElementById('inputPhone').setAttribute('value', contact.phone);
}

/**
 * Saves the edited contact to the contact list.
 * @param {number} contactsIndex - Index of the contact in the contacts array.
 * @param {number} i - Index of the group.
 * @param {number} j - Index of the contact within the group.
 */
async function saveContactEdits(contactsIndex, i, j) {
    let name = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    let phone = document.getElementById('inputPhone').value;
    contacts[contactsIndex] = {
        "name": name,
        "email": email,
        "phone": phone
    };
    openAndCloseNewContactWindow();
    alertMessage('Contact succesfully changed');
    await setItem('contacts', JSON.stringify(contacts));
    changeContactLocalForCard(i, j, contactsIndex);
    init();
}

/**
 * Deletes a contact from the contact list.
 * @param {number} contactsIndex - Index of the contact in the contacts array.
 * @param {number} i - Index of the group.
 * @param {number} j - Index of the contact within the group.
 * @param {boolean} mobil - Indicates whether the operation is performed on mobile.
 */
async function deleteContact(contactsIndex, i, j, mobil) {
    contacts.splice(contactsIndex, 1);
    groups[i].splice(j, 1);
    if (!mobil) openAndCloseNewContactWindow();
    alertMessage('Contact succesfully deleted');
    await setItem('contacts', JSON.stringify(contacts));
    emptyContainer();
    closeContactCard();
    init();
}


// OPEN-CONTACT FUNCTIONS 


/**
 * Opens the full contact card view.
 * @param {number} i - Index of the group.
 * @param {number} j - Index of the contact within the group.
 */
function openContact(i, j) {
    let fullContactCard = document.getElementById('fullContactCard');
    let contactView = document.getElementById('contactView');
    let backBtn = document.querySelector('.arrowBack');
    backBtn.classList.remove('dNone');
    contactView.style.zIndex = 1;
    let contact = groups[i][j];
    fullContactCard.innerHTML = createHtmlForContactCard(contact, i, j);
    addActiveClass(i, j);
    fadeInCard('on');
}

/**
 * Closes the full contact card view.
 */
function closeContactCard() {
    let contactView = document.getElementById('contactView');
    contactView.style.zIndex = -10;
    let elements = document.querySelectorAll('.active');
    elements.forEach((element) => {
        element.classList.remove('active');
    });
    fadeInCard();
}