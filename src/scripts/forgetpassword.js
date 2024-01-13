/**
 * Initializes the application by loading users.
 */
function init() {
    loadUsers();
}

/**
 * Loads users from the local storage.
 */
async function loadUsers() {
    users = JSON.parse(await getItem('users'));
}

/**
 * Initiates the password reset process.
 * Loads users, redirects to the reset password page, and sends email alerts.
 */
async function forgetPassword() {
    loadUsers();
    setTimeout(() => window.location.href = 'resetpassword.html', 4000)
    sendEmailAlert();
}

/**
 * Resets the password based on the entered values.
 * Checks if the new password and confirm password match, shows a confirmation message,
 * and redirects to the index page.
 */
function resetPassword() {
    const continuePassword = document.getElementById('confirmPasswordReset');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (newPassword === confirmPassword) {
        continuePassword.classList.remove('dNone');
        setTimeout(() => continuePassword.classList.add('dNone'), 2500)
        setTimeout(() => window.location.href = 'index.html', 2000)
    } else {
        alert('Password is not identic')
    }
}

/**
 * Sends email alert messages.
 * Shows and hides the email alert and password confirmation elements after a delay.
 */
function sendEmailAlert() {
    let sendEmail = document.getElementById('sendMail');
    let sendButton = document.getElementById('sendButton');
    let passwordContinue = document.getElementById('confirmPasswordReset');
    if (sendButton) {
        setTimeout(function () {
            sendEmail.classList.remove('dNone')
            passwordContinue.classList.remove('dNone');
        }, 900)
        setTimeout(function () {
            sendEmail.classList.add('dNone');
            passwordContinue.classList.add('dNone');
        }, 200)
    }
}