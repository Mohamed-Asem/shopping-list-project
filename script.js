'use strict';
const form = document.getElementById('item-form');
const formBtn = form.querySelector('button');
const inputField = document.getElementById('item-input');
const filterField = document.getElementById('filter');
const itemsList = document.getElementById('item-list');
const clearAllButton = document.getElementById('clear');

let editMode = false;

function getItemsFromLocalStorage() {
  let itemsFromLocalStorage;
  if (!localStorage.getItem('items')) {
    itemsFromLocalStorage = [];
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromLocalStorage;
}

function addItemToLocalStorage(item) {
  const itemsFromLocalStorage = getItemsFromLocalStorage();
  itemsFromLocalStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
}

function displayItems() {
  const storedItems = getItemsFromLocalStorage();
  storedItems.forEach(item => addItemToTheDom(item));
  checkUiState();
}

function addNewItem(e) {
  e.preventDefault();
  const itemName = inputField.value;
  if (!itemName) {
    swal('something wrong happened!', 'Enter the item name!', 'error');
    return;
  } else {
    //check if we are on edit mode
    if (editMode) {
      // we need to first remove this item from dom and local storage then add new one instead of it we have removeItem function for these 2 things

      let updatedItem = document.querySelector('.editMode'); // we select item by className
      removeItem(updatedItem);
      formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
      editMode = false; // deactivate edit mode
    }

    // check if item already exists
    if (checkIfTheItemExists(itemName)) {
      swal('something wrong happened!', 'This item already exists!', 'error');
      inputField.value = '';
      return;
    }

    // creating list item
    addItemToTheDom(itemName);
    // adding this item to localStorage
    addItemToLocalStorage(itemName);
    inputField.value = '';
    checkUiState();
  }
}

function checkIfTheItemExists(item) {
  const storedItems = getItemsFromLocalStorage();

  return storedItems.includes(item);
}

function addItemToTheDom(newItem) {
  const li = document.createElement('li');
  const item = document.createTextNode(newItem);

  //creating remove button
  const removeItemButton = document.createElement('button');
  removeItemButton.className = 'remove-item btn-link text-red';
  removeItemButton.setAttribute('title', 'Remove this item');

  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'fa-solid fa-xmark';
  removeItemButton.appendChild(deleteIcon);

  // creating update button
  const updateButton = document.createElement('button');
  updateButton.className = 'update-item btn-link text-blue';
  updateButton.setAttribute('title', 'update item');

  const updateIcon = document.createElement('i');
  updateIcon.className = 'fa-regular fa-pen-to-square';
  updateButton.appendChild(updateIcon);

  // adding all buttons to list item
  li.appendChild(item);
  li.appendChild(removeItemButton);
  li.appendChild(updateButton);

  // adding li into the dom
  itemsList.appendChild(li);
}

function onClickItem(e) {
  const listItem = e.target.parentElement.parentElement;
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(listItem);
  } else if (e.target.parentElement.classList.contains('update-item')) {
    activateEditMode(listItem);
  }
}

function activateEditMode(item) {
  // removing edit mode from other items
  const items = document.querySelectorAll('li');
  items.forEach(item => item.classList.remove('editMode'));

  // activate edit mode
  editMode = true;
  inputField.value = item.textContent;
  formBtn.textContent = 'update';
  item.classList.add('editMode');
}

function removeItemFromLocalStorage(item) {
  const itemText = item.textContent;
  let storedItems = getItemsFromLocalStorage();
  storedItems = storedItems.filter(item => item !== itemText);

  // update local storage
  localStorage.setItem('items', JSON.stringify(storedItems));
}

function removeItem(item) {
  item.remove();

  removeItemFromLocalStorage(item);

  checkUiState();
}

function removeAllItems() {
  while (itemsList.firstChild) {
    itemsList.removeChild(itemsList.firstChild);
  }

  // clear items from local storage
  localStorage.removeItem('items');
  checkUiState();
}

function checkUiState() {
  const items = document.querySelectorAll('li');

  if (!items.length) {
    filterField.classList.add('visually-hidden');
    clearAllButton.classList.add('visually-hidden');
  } else {
    filterField.classList.remove('visually-hidden');
    clearAllButton.classList.remove('visually-hidden');
  }
}

function filterItems() {
  let search = filterField.value.toLowerCase();
  const items = document.querySelectorAll('li');
  items.forEach(item => {
    let itemName = item.textContent.toLowerCase();

    if (itemName.indexOf(search) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

form.addEventListener('submit', addNewItem);
itemsList.addEventListener('click', onClickItem); // we are using event delegation
clearAllButton.addEventListener('click', removeAllItems);
filterField.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUiState();
