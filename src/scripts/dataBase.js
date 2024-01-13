let contacts = [];
let groups = [];
let initialsColors = ['#3F51B5', '#9C27B0', '#2196F3', '#E91E63', '#00BCD4', '#FF5722', '#009688', '#795548', '#FFC107', '#607D8B', '#8BC34A', '#FFEB3B', '#4CAF50', '#FF9800', '#F44336', '#CDDC39', '#9E9E9E', '#FFEB3B', '#795548', '#3F51B5', '#9C27B0', '#00BCD4', '#2196F3', '#FFC107', '#E91E63'];


// all the categories

// 'color' refers to CSS classes

let categories = [
    {
        name: 'Sales',
        color: 'lightpink',
    },

    {
        name: 'Marketing',
        color: 'blue',
    },

    {
        name: 'Design',
        color: 'turquoise',
    },

    {
        name: 'Development',
        color: 'red',
    },
];

let tasks = {
    toDo: [],
    inProgress: [],
    feedback: [],
    done: []
};
let taskColumn;

let prioValue;
let assignedPeople = [];
let filteredTasks = {
    toDo: [],
    inProgress: [],
    feedback: [],
    done: []
};
let dropClicked = false;
let users = [];

guestUser = [
    {
        guestName: 'Guest',
        email: 'guest@guest.com',
        password: '123456',
    }
]
let userName;