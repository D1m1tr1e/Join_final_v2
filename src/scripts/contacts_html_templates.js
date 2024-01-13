/**
 * Creates the HTML code for an alphabetic order.
 * @param {string} letter - The letter of the order.
 * @returns {string} - The HTML markup for the order.
 */
function createHtmlForOrder(letter) {
    return `
        <div class="contactOrder">
            <span>${letter}</span>
        </div>
    `;
}

/**
 * Creates the HTML code for a contact.
 * @param {Object} contact - The contact object.
 * @param {number} i - The contact index.
 * @param {number} j - The subcontact index.
 * @returns {string} - The HTML markup for the contact card.
 */
function createHtmlForContact(contact, i, j) {
    let nameWithoutUmlauts = deUmlaut(contact.name);
    let initials = nameWithoutUmlauts.match(/\b\w/g).join('').toUpperCase();
    let name = contact.name;
    let email = contact.email;
    let contactColor = initialsColors[getColorForInitials(contact)];
    return `
        <div onclick="openContact(${i}, ${j})" class="contactCard" id="contactCard${i}${j}">
            <div class="leftPart">
                <div class="circalInitials" style="background-color: ${contactColor}">${initials}</div>
            </div>
            <div class="rightPart">
                <span>${name}</span>
                <span class="emailStyle">${email}</span>
            </div>
        </div>
    `;
}

/**
 * Creates the HTML code for a contact card.
 * @param {Object} contact - The contact object.
 * @param {number} i - The contact index.
 * @param {number} j - The subcontact index.
 * @returns {string} - The HTML markup for the contact card.
 */
function createHtmlForContactCard(contact, i, j) {
    let nameWithoutUmlauts = deUmlaut(contact.name);
    let initials = nameWithoutUmlauts.match(/\b\w/g).join('').toUpperCase();
    let name = contact.name;
    let email = contact.email;
    let phone = contact.phone;
    let contactColor = initialsColors[getColorForInitials(contact)];
    let contactsIndex = checkIndexContacts(contact.name);
    return `
        <div class="cardContainer" id="cardContainer">
            <div class="cardTopPart">
                <div class="circalInitialsBig" style="background-color: ${contactColor}">${initials}</div>
                <div class="contactName">
                    <span>${name}</span>    
                </div>
            </div>
            <div class="cardMidPart">
                <div class="contactInformation">Contact Information</div>
                <span class="editBtn" onclick="renderEditContactWindow(${i}, ${j})">
                    <div></div>Edit contact
                </span>
            </div>
            <div class="cardBottomPart">
                <span class="FontWeightBold">Email</span>
                <span class="emailStyle">${email}</span>
                <span class="FontWeightBold">Phone</span>
                <span>${phone}</span>
            </div>
            <div class="mobileBtnSection">
                <button onclick="deleteContact(${contactsIndex}, ${i}, ${j}, 'mobil')" class="mobileDeleteBtn"></button>
                <button onclick="renderEditContactWindow(${i}, ${j})" class="mobileEditBtn"></button>
            </div>
        </div>
    `;
}

/**
 * Creates the HTML code for the window - creating a new contact.
 * @returns {string} - The HTML markup for creating a new contact.
 */
function createHtmlForCreateContact() {
    return `
        <div class="addContactLeft">
            <img class="joinLogoContact" src="src/img/img_contacts/logo_join_white.png" alt="join logo">
            <h1 class="addContactHeadline">Add Contact</h1>
            <span>Tasks are better with a team!</span>
            <img class="blueLineContact" src="src/img/img_contacts/login-blue-line.png" alt="blue line">
        </div>
        <img class="defaultUserImg" src="src/img/img_contacts/defaultUser_img.png" alt="default user image">
        <img class="closeCross" src="src/img/img_contacts/cross.svg" onclick="openAndCloseNewContactWindow()">
        <div class="addContactRight">
            <form class="contactInputForm" onsubmit="addContact(); return false">
                <div class="inputSection">
                    <input class="contactInput" id="inputName" type="text" placeholder="Name" pattern="^[a-zA-ZöüäÖÜÄ]+ [a-zA-ZöüäÖÜÄ]+$" required>
                    <img class="inputImg" src="src/img/img_contacts/small_line_Human.png" alt="small line person">
                </div>
                <div class="inputSection">
                    <input class="contactInput" id="inputEmail" type="email" placeholder="Email" required>
                    <img class="inputImg" src="src/img/img_contacts/mail.png" alt="logo of a mail">
                </div>
                <div class="inputSection">
                    <input class="contactInput" id="inputPhone" type="number" placeholder="Phone" required>
                    <img class="inputImg" src="src/img/img_contacts/phone.png" alt="logo of a phone">
                </div>
                <div class="btnSection">
                    <button class="submitBtn coloredBtn">Create contact<img src="src/img/img_contacts/ok_chop.png"
                            alt="image of a chop"></button>
                </div>
            </form>
            <button onclick="openAndCloseNewContactWindow()" class="cancelBtn transparentBtn">Cancel<img src="src/img/img_contacts/cross.svg"></button>
        </div>
    `;
}

/**
 * Creates the HTML code for the window - editing a contact.
 * @param {Object} contact - The contact object.
 * @param {number} contactsIndex - The index of the contact in the contacts array.
 * @param {number} j - The subcontact index.
 * @param {number} i - The contact index.
 * @returns {string} - The HTML markup for editing a contact.
 */
function createHtmlForEditContact(contact, contactsIndex, j, i) {
    let nameWithoutUmlauts = deUmlaut(contact.name);
    let initials = nameWithoutUmlauts.match(/\b\w/g).join('').toUpperCase();
    let contactColor = initialsColors[getColorForInitials(contact)];
    return `
        <div class="addContactLeft">
            <img class="joinLogoContact" src="src/img/img_contacts/logo_join_white.png" alt="join logo">
            <h1 class="addContactHeadline">Edit Contact</h1>
            <img class="blueLineContact" src="src/img/img_contacts/login-blue-line.png" alt="blue line">
        </div>
        <div class="editInitials" style="background-color: ${contactColor}">${initials}</div>
        <img class="closeCross" src="src/img/img_contacts/cross.svg" onclick="openAndCloseNewContactWindow()">
        <div class="addContactRight">
            <form class="contactInputForm" onsubmit="saveContactEdits(${contactsIndex}, ${i}, ${j}); return false">
                <div class="inputSection">
                    <input class="contactInput" id="inputName" type="text" placeholder="Name" pattern="^[a-zA-ZöüäÖÜÄ]+ [a-zA-ZöüäÖÜÄ]+$" required>
                    <img class="inputImg" src="src/img/img_contacts/small_line_Human.png" alt="small line person">
                </div>
                <div class="inputSection">
                    <input class="contactInput" id="inputEmail" type="email" placeholder="Email" required>
                    <img class="inputImg" src="src/img/img_contacts/mail.png" alt="logo of a mail">
                </div>
                <div class="inputSection">
                    <input class="contactInput" id="inputPhone" type="number" placeholder="Phone" required>
                    <img class="inputImg" src="src/img/img_contacts/phone.png" alt="logo of a phone">
                </div>
                <div class="editBtnSection">
                    <div onclick="deleteContact(${contactsIndex}, ${i}, ${j})" class="deleteBtn transparentBtn">Delete</div>
                    <button class="saveBtn coloredBtn">Save</button>
                </div>
            </form>
            
        </div>
    `;
}