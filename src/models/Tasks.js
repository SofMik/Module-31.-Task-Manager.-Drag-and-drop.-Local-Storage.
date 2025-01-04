import { appState } from "../app";

export function sayHi(login) {
    alert(`Hello, ${login}!`);
  }

export function showAccountPageToUser() {
    const user_page = document.getElementById('user_box');
    const table_box = document.getElementById('table_box');
    const UserAccountButton = document.getElementById('user_button__menu__box__account');
    const UserTasksButton = document.getElementById('user_button__menu__box__tasks');
    user_page.style.display = "block";
    table_box.style.display = "none"; 
    UserAccountButton.style.display = "none"; 
    UserTasksButton.style.display = "block"; 
} 
  
export function showTasksPageToUser() {
    const user_page = document.getElementById('user_box');
    const table_box = document.getElementById('table_box');
    const UserAccountButton = document.getElementById('user_button__menu__box__account');
    const UserTasksButton = document.getElementById('user_button__menu__box__tasks');
    user_page.style.display = "none";
    table_box.style.display = "flex";
    UserAccountButton.style.display = "block";
    UserTasksButton.style.display = "none"; 
}

export function showMenu() {
    const menu__btn_up = document.getElementById('menu__btn_up');
    const menu__btn_down = document.getElementById('menu__btn_down');
    const menu__box = document.getElementById('menu__box');
    const menu__toggle = document.getElementById('menu__toggle'); // Добавляем ссылку на checkbox
    menu__box.style.display = "block";
    menu__box.style.position = "fixed";
    menu__box.style.visibility = 'visible';
    menu__btn_down.style.display = "none";
    menu__btn_up.style.display = "block";
    menu__box.addEventListener('mouseenter', function() {
        menu__box.style.backgroundColor = 'rgba(0, 255, 127, 0.3)';
        menu__box.style.visibility = 'visible';
    });
    menu__box.addEventListener('mouseleave', function() {
        menu__box.style.backgroundColor = '';
        menu__box.style.visibility = 'hidden';
        menu__btn_down.style.display = "block";
        menu__btn_up.style.display = "none";
        menu__toggle.checked = false; // Сбрасываем состояние checked
    });
     menu__btn_down.addEventListener('click', function() {
        menu__box.style.visibility = 'visible';
        menu__btn_down.style.display = "none";
        menu__btn_up.style.display = "block";
    });
}

export function hideMenu() {
    const menu__btn_up = document.getElementById('menu__btn_up');
    const menu__btn_down = document.getElementById('menu__btn_down');
    menu__btn_down.style.display = "none";
    menu__btn_up.style.display = "block";
}
  
export function addInput() {
    const taskInput = document.getElementById('input__text');
    const addButton = document.getElementById('backlog__button__add');
    const submitButton = document.getElementById('backlog__button__submit');
    taskInput.style.display = "block";
    addButton.style.display = "none"; 
    submitButton.style.display = "block"; 
    taskInput.focus();
}
  
export function addNewTask() {
    const addButton = document.getElementById('backlog__button__add');
    const submitButton = document.getElementById('backlog__button__submit');
    const taskInput = document.getElementById('input__text');
    const backlogList = document.getElementById('backlog_list');
    const newTask = taskInput.value;
    if (newTask) {
      const listItem = document.createElement('li');
      listItem.textContent = newTask;
      listItem.setAttribute('draggable', 'true');
      listItem.addEventListener('dragstart', dragStart);
      backlogList.appendChild(listItem);
      saveToLocalStorage('backlog_list', backlogList);
      taskInput.value = '';
      taskInput.style.display = "none"; 
      addButton.style.display = "block"; 
      submitButton.style.display = "none"; 
    }
}

function saveToLocalStorage(listId, listElement) {
    if (!listElement) {
        console.error(`Element with id ${listId} not found`);
        return;
    }
    const tasks = [];
    const items = listElement.querySelectorAll('li');
    items.forEach(item => {
        tasks.push(item.textContent);
    });
    const login = appState.currentUser.login;
        if (login) {
             const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        if (!allTasks[login]) {
            allTasks[login] = {};
        }
        allTasks[login][listId] = tasks;
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        showResult()
       // console.log(`Saved to localStorage for user ${login}:`, tasks);
    } else {
        console.error('No current user found');
    }
}
  
export function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.textContent);
  //console.log('Drag started:', event.target.textContent);
}
  
export function deleteTask() {
    const backlogList = document.getElementById('backlog_list');
    const readyList = document.getElementById('ready_list');
    const inProgressList = document.getElementById('in-progress_list');
    const finishedList = document.getElementById('finished_list');
    const deleteButton = document.getElementById('backlog__button__delete');
    const cancelButton = document.getElementById('backlog__button__cancel');
    deleteButton.style.display = "none"; 
    cancelButton.style.display = "block"; 
    const lists = [backlogList, readyList, inProgressList, finishedList];
    let clickOccurred = false;
    lists.forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                if (!clickOccurred) {
                    this.style.backgroundColor = '#faa1bb'; 
                }
            });
            item.addEventListener('mouseleave', function() {
                if (!clickOccurred) {
                    this.style.backgroundColor = '';
                }
            });
            item.addEventListener('click', function(event) {
                if (!clickOccurred) {
                    event.stopPropagation(); // Останавливаем всплытие события
                    this.remove();
                    updateLocalStorage(list.id, list);
                    clickOccurred = true;
                    deleteButton.style.display = "block";
                    cancelButton.style.display = "none";
                }
            });
        });
    });
}
  
export function cancelDeliting() {
    const backlogList = document.getElementById('backlog_list');
    const readyList = document.getElementById('ready_list');
    const inProgressList = document.getElementById('in-progress_list');
    const finishedList = document.getElementById('finished_list');
    const deleteButton = document.getElementById('backlog__button__delete');
    const cancelButton = document.getElementById('backlog__button__cancel');
    const lists = [backlogList, readyList, inProgressList, finishedList];
    let clickOccurred = false;
    lists.forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                if (!clickOccurred) {
                    item.style.backgroundColor = '';
                }
            deleteButton.style.display = "block";
            cancelButton.style.display = "none";
            });
        });
    });
}
  
export function drop(event) {
    const backlogList = document.getElementById('backlog_list');
    const readyList = document.getElementById('ready_list');
    const inProgressList = document.getElementById('in-progress_list');
    const finishedList = document.getElementById('finished_list');
    event.preventDefault();
    event.target.style.backgroundColor = '';
    const data = event.dataTransfer.getData('text/plain');
    const dropZone = event.target; 
    if(!dropZone.classList.contains('drop-zone-one')) return
    const lists = [backlogList, readyList, inProgressList, finishedList];
    lists.forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach(item => {
            if (item.textContent === data) {
                list.removeChild(item);
            }
        });
    updateLocalStorage(list.id, list);
    });
    const existingItems = dropZone.querySelectorAll('li');
    let itemExists = false;
    existingItems.forEach(item => {
        if (item.textContent === data) {
            itemExists = true;
        }
    });
    if (!itemExists) {
        const listItem = document.createElement('li');
        listItem.textContent = data;
        listItem.setAttribute('draggable', 'true');
        listItem.addEventListener('dragstart', dragStart);
        dropZone.appendChild(listItem);
       // console.log('Added item:', listItem.textContent);
        saveToLocalStorage(dropZone.id, dropZone);
        //console.log('Dropped:', data, 'into', dropZone.id);
    }
}
  
export function updateLocalStorage(listId, listElement) {
    const tasks = [];
    const items = listElement.querySelectorAll('li');
     items.forEach(item => {
        tasks.push(item.textContent);
    });
    const login = appState.currentUser.login;
    if (login) {
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (!allTasks[login]) {
         allTasks[login] = {};
     }
    allTasks[login][listId] = tasks;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    showResult()
    //console.log(`Saved to localStorage for user ${login}:`, tasks);
    } else {
     console.error('No current user found');
    }
}
  
export function allowDrop(event) {
    event.preventDefault();
}
  
export function enterDropZone(event) {
    const deleteButton = document.getElementById('backlog__button__delete');
    event.preventDefault();
    event.target.style.backgroundColor = 'rgba(0, 255, 127, 0.3)';
    deleteButton.style.backgroundColor = '';
}
  
export function leaveDropZone(event) {
    const backlogList = document.getElementById('backlog_list');
    event.preventDefault();
    event.target.style.backgroundColor = '';
    backlogList.style.backgroundColor = '';
}
  
export function loadFromLocalStorage(listId) {
    const listElement = document.getElementById(listId);
    const login = appState.currentUser.login;
    if (listElement && login) {
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        const userTasks = allTasks[login] || {};
        const tasks = userTasks[listId] || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.textContent = task;
            listItem.setAttribute('draggable', 'true');
            listItem.addEventListener('dragstart', dragStart);
            listElement.appendChild(listItem);
        });
        //console.log(`Loaded from localStorage for user ${login}:`, tasks);
        showResult()
    } else {
        console.error(`Element with id ${listId} not found or no current user`);
    }
}

export function loadTasks (){
    loadFromLocalStorage('backlog_list');
    loadFromLocalStorage('ready_list');
    loadFromLocalStorage('in-progress_list');
    loadFromLocalStorage('finished_list');
}
  
export function showResult () {
    const backlogList = document.getElementById('backlog_list');
    const active_tasks_result = backlogList.getElementsByTagName('li').length;
    document.getElementById('active-tasks-count').textContent = active_tasks_result;
    const finishedList = document.getElementById('finished_list');
    const finished_tasks_result = finishedList.getElementsByTagName('li').length; 
    document.getElementById('finished-tasks-count').textContent = finished_tasks_result;
}