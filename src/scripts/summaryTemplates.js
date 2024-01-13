/**
 * Generates the HTML template for the summary section.
 */
function generateSummaryTemplate() {
    let content = document.getElementById('summaryContent');
    content.innerHTML = '';
    content.innerHTML = /*html*/`
    
    <div class="row">
                <div class="coll-big">
                    <img src="./src/img/to-do.png" alt="">
                    <div class="task-count-box">
                        <span id="summarytoDo"></span>
                        <span>To-do</span>
                    </div>
                </div>
                <div class="coll-big">
                    <img src="./src/img/done.png" alt="">
                    <div class="task-count-box">
                        <span id="summaryDone"></span>
                        <span>Done</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="coll-span">
                    <div class="left-side">
                        <img src="./src/img/redCircle.png" alt="">
                        <div class="task-count-box">
                            <span id="summaryUrgentCount"></span>
                            <span>Urgent</span>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="right-side">
                        <span id="summaryDate"></span>
                        <span>Upcoming Deadline</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="coll-small">
                    <div class="task-count-box">
                        <span id="summaryTaskInBoard"></span>
                        <span>Tasks in Board</span>
                    </div>
                </div>
                <div class="coll-small">
                    <div class="task-count-box">
                        <span id="summaryTaskInProgress"></span>
                        <span>Tasks in Progress</span>
                    </div>
                </div>
                <div class="coll-small">
                    <div class="task-count-box">
                        <span id="summaryTaskInAwaitingFeedback"></span>
                        <span>Awaiting Feedback</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="times-Container">
            <div class="times">
                <span class="time-name">
                    <h2 id="greetings"></h2>
                    <p id="userGreeting"></p>
                </span>
            </div>
        </div> -->
 `;
}

/**
 * Creates HTML for displaying the tasks amount.
 * @param {number} number - The number of tasks.
 * @returns {string} - The HTML string representing the tasks amount.
 */
function createHtmlforTasksAmount(number) {
    return `
        ${number}
    `;
}