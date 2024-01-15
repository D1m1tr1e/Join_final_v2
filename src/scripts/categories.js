/**
 * Loads the task categories from the backend and displays them in a dropdown menu.
 */

 async function loadCategories() {
	categories = JSON.parse(await getItem('categoriess'));
	let list = document.querySelector('.category-list');
	list.innerHTML = '';
	list.innerHTML += addCategoryHTML();
	for (let i = 0; i < categories.length; i++) {
		let category = categories[i]['name'];
		let color = categories[i]['color'];
		list.innerHTML += categoryHTML(category, color);
	}
}

/**
 * Toggles the display of the category dropdown menu.
 */

function categoryToggler() {
	const categoryList = document.querySelector('.category-list');
	const selectCategory = document.querySelector('.select-task-category');
	if (categoryList.style.display === 'none') {
		categoryList.style.display = 'block';
		selectCategory.style.borderBottom = '0px';
		selectCategory.style.borderRadius = '10px 10px 0px 0px';
	} else {
		categoryList.style.display = 'none';
		resetSelectCategory();
	}
}

/**
 * Closes the category toggler by hiding the category list and resetting the select category element.
 */

function closeCategoryToggler() {
	document.querySelector('.category-list').style.display = 'none';
	resetSelectCategory();
}

/**
 * Handles the creation of a new category.
 */

function newCategoryHandler() {
	document.querySelector('.category-list').style.display = 'none';
	document.querySelector('#select-task-category').style.display = 'none';
	document.querySelector('.new-category').style.display = 'flex';
	document.querySelector('.color-container').style.display = 'flex';
}

/**
 * Cancels the creation of a new category.
 */

function cancelNewCategory() {
	document.querySelector('.new-category').style.display = 'none';
	document.querySelector('.color-container').style.display = 'none';
	document.querySelector('#select-task-category').style.display = 'flex';
}

/**
 * Adds a new category with the provided name and color.
 */

async function addNewCategory() {
	event.preventDefault();
	document.querySelector('.new-category').style.display = 'none';
	document.querySelector('.color-container').style.display = 'none';
	document.querySelector('#select-task-category').style.display = 'flex';
	let selectedColor = null;
	let categoryName = '';
	categoryName = document.querySelector('.new-catgory__input').value;
	for (let i = 0; i < document.querySelectorAll('.color-container input[type="radio"]').length; i++) {
		if (document.querySelectorAll('.color-container input[type="radio"]')[i].checked) {
			selectedColor = document.querySelectorAll('.color-container input[type="radio"]')[i].value;
		}
	}
	const newCategory = {
		name: categoryName,
		color: selectedColor,
	};
	categories.push(newCategory);
	await setItem('categoriess', JSON.stringify(categories));
	loadCategories();
	selectCategory(categoryName, selectedColor)
	clearInputs();
}

/**
 * Clears the input fields and color selection for creating a new category.
 */

function clearInputs() {
	document.querySelector('.new-catgory__input').value = '';
	for (let i = 0; i < document.querySelectorAll('.color-container input[type="radio"]').length; i++) {
		document.querySelectorAll('.color-container input[type="radio"]')[i].checked = false;
	}
}

/**
 * Selects a category and updates the UI to reflect the selected category.
 * @param {string} category - The selected category name.
 * @param {string} color - The selected category color.
 */

function selectCategory(category, color) {
	document.querySelector('#selected-category').innerHTML = selectedCategoryHTML(category, color);
	document.querySelector('.category-list').style.display = 'none';
	selectedCatColor = color;
	selectedCategoryName = category;
	resetSelectCategory();
}