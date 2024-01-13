/**
 * Retrieves a summary.
 * - Loads tasks and users from storage.
 * - Generates a summary template.
 * - Displays greeting messages.
 * - Displays the user's name in the greeting.
 * - Renders the number of tasks.
 * - Filters by priority.
 * - Finds the most urgent task.
 */
async function getSummary() {
    if(getloggedInStatus() === 'false') window.location.href = 'index.html';
    tasks = JSON.parse(await getItem('tasks'));
    users = JSON.parse(await getItem('users'));
    generateSummaryTemplate();
    getUserNameFromLocalStorage();
    showGreetings();
    showGreetingName();
    renderAmountOfTasks();
    filterForPrio();
    mostUrgent();
    addActiveToMenu('summaryLink');
    addActiveToMenu('mobile-buttonId1')
    generateLoggedinUserLogo();
}

/**
 * This function determines whether to display or hide the welcome summary based on the window width.
 * If the window width is greater than 1533 pixels, the welcome summary is hidden.
 * Otherwise, it triggers the greeting animation.
 */
function summaryGreetingResponsive() {
    if (window.innerWidth > 1533){ 
        document.getElementById('summaryWelcomeResponsive').classList.add('dNone');
        return;
    }
    summaryGreetingAnimation();
}

/**
 * This function performs the greeting animation by showing the welcome summary and hiding the summary body temporarily.
 * It adds necessary CSS classes to animate the welcome summary and reveals the summary body after a delay.
 */
function summaryGreetingAnimation(){
    document.getElementById('summaryWelcomeResponsive').classList.remove('dNone');
    document.getElementById('summaryBody').classList.add('summary-hidden');
    setTimeout(() =>{
        document.getElementById('summaryWelcomeResponsive').classList.add('summaryWelcomeAnimation');
        setTimeout(() => {
            document.getElementById('summaryWelcomeResponsive').classList.add('d-none');
            document.getElementById('summaryBody').classList.remove('summary-hidden');
        }, 1000);
    }, 1000);
}


/**
 * Displays greeting messages based on the current time of day.
 */
function showGreetings() {
    const currentHour = new Date().getHours();
    greetings;
    if (currentHour >= 4 && currentHour < 12) {
        greetings = 'Good morning,';
    }
    else if (currentHour >= 12 && currentHour < 18) {
        greetings = 'Good afternoon,';
    }
    else {
        greetings = 'Good evening,';
    }
    document.getElementById('greetings').innerHTML = greetings;
    // document.getElementById('summaryGreetingResponsive').innerHTML = greetings;
};

/**
 * Displays the user's name in the greeting.
 */
async function showGreetingName() {
    let greetUserMobile = document.getElementById('summaryGreetingNameResponsive');
    let greetUser = document.getElementById('userGreeting');
    greetUser.innerHTML = `<span>${userName}</span>`;
    // greetUserMobile.innerHTML = `<span>${userName}</span>`;
}

/**
 * Redirects to the 'board.html' page.
 */
function goToBoard() {
    window.location.href = 'board.html';
}

/**
 * Renders the number of tasks for different categories.
 */
function renderAmountOfTasks() {
    let allTasksAmount = 0;
    let id = ['summarytoDo', 'summaryTaskInProgress', 'summaryTaskInAwaitingFeedback', 'summaryDone'];
    let categories = ['toDo', 'inProgress', 'feedback', 'done'];
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        let number = tasks[category].length;
        document.getElementById(id[i]).innerHTML = createHtmlforTasksAmount(number);
        allTasksAmount += number;
    }
    renderAllAmountOfTasks(allTasksAmount);
}

/**
 * Renders the total number of tasks.
 */
function renderAllAmountOfTasks(allTasksAmount) {
    document.getElementById('summaryTaskInBoard').innerHTML = createHtmlforTasksAmount(allTasksAmount);
}

/**
 * Filters tasks by priority.
 */
function filterForPrio() {
    let allPrioOne = 0;
    let categories = ['toDo', 'inProgress', 'feedback', 'done'];
    for (let i = 0; i < categories.length; i++) {
        const catergory = categories[i];
        for (let j = 0; j < tasks[catergory].length; j++) {
            const prio = tasks[catergory][j] ? tasks[catergory][j].prio : 0;
            if (prio == 1) allPrioOne += prio;
        }
    }
    document.getElementById('summaryUrgentCount').innerHTML = allPrioOne;
}

/**
 * Finds the most urgent task.
 */
function mostUrgent() {
    let mostUrgentDates = [];
    let upcomingDeadline;
    let categories = ['toDo', 'inProgress', 'feedback', 'done'];
    for (let i = 0; i < categories.length; i++) {
        const catergory = categories[i];
        for (let j = 0; j < tasks[catergory].length; j++) {
            if (tasks[catergory][j] && tasks[catergory][j].prio == 1) {
                const date = tasks[catergory][j].date;
                mostUrgentDates.push(parseInt(convertToInteger(date)));
            }
        }
    }
    upcomingDeadline = Math.min(...mostUrgentDates);
    convertToDate(upcomingDeadline);
}

/**
 * Converts a date to an integer by removing the hyphens.
 * @param {string} date - The date to convert in the format "YYYY-MM-DD".
 * @returns {number} The integer representation of the date.
 */
function convertToInteger(date) {
    return date.replace(/-/g, '');
}

/**
 * Converts the upcoming deadline to the date format "Month Day, Year".
 */
function convertToDate(upcomingDeadline) {
    let year = Math.floor(upcomingDeadline / 10000);
    let month = Math.floor((upcomingDeadline % 10000) / 100) - 1;
    let day = upcomingDeadline % 100;
    if (year == Infinity) {
        document.getElementById('summaryDate').innerHTML = 'None';
    } else {
        let date = new Date(year, month, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        document.getElementById('summaryDate').innerHTML = date;
    }
}