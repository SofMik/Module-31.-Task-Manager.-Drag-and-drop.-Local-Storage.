import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";
import { authUser } from "../services/auth";
import taskFieldTemplate from "../templates/taskField.html";
import { loadTasks } from "./Tasks";
import { addInput } from "./Tasks";
import { addNewTask } from "./Tasks";;
import { deleteTask, cancelDeliting } from "./Tasks";
import { allowDrop, drop, enterDropZone, leaveDropZone } from "./Tasks";

export class User extends BaseModel {
  constructor(login, password, id = null, isAdmin = false) {
    super();
    this.login = login;
    this.password = password;
    this.id = id || this.id; 
    if (login === "admin" && password === "admin123"){
      this.isAdmin = true;
    } else {
      this.isAdmin = isAdmin;
    }
    this.storageKey = "users";
  }
 
  get hasAccess() {
    let users = getFromStorage(this.storageKey);
    if (users.length == 0) return false;
    for (let user of users) {
      if (user.login === this.login && user.password === this.password)
        return true;
    }
    return false;
  }

  static save(user) {
    try {
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function isAdminUser(login, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.login === login && user.password === password);
  return user ? user.isAdmin : false;
}

export function showUsers () {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  const uniqueUsers = [];
  users.forEach((user) => {
    if (!uniqueUsers.some(u => u.login === user.login && u.password === user.password)) {
      uniqueUsers.push(user);
      if (!document.getElementById(`user-${user.id}`)) {
        const listItem = document.createElement('li');
        listItem.textContent = user.login;
        listItem.id = `user-${user.id}`; // Используем уникальный идентификатор
        listItem.setAttribute('data-user-id', user.id); // Добавить идентификатор пользователя
        listItem.setAttribute('data-user-login', user.login);
        listItem.setAttribute('data-user-password', user.password);
        listItem.setAttribute('data-user-admin', user.isAdmin);
        userList.appendChild(listItem);
        //console.log(`2. Added user: ${user.login} with ${user.password} id: user-${user.id}  ${user.isAdmin}`);
        }
    }
        addUserClickListeners()
      });
}

export function addUser() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  let login;
  let existingUser;
  do {
    login = prompt("User login:");
    existingUser = users.find(user => user.login === login);
    if (existingUser) {
      alert('User with this login already exists. Please enter a different login.');
    }
  } while (existingUser);
  let password;
  do {
    password = prompt("User password:");
    if (!password) {
      alert('Password is required. Please enter a password.');
    }
  } while (!password);
  const user = new User(login, password);
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  showUsers();
}

let isDeleteMode = false;
export function deleteUser() {
  const deleteUserButton = document.getElementById("button__delete_user"); 
  deleteUserButton.addEventListener('click', function() {
    isDeleteMode = true; // Устанавливаем флаг в true при нажатии на кнопку
    const userList = document.getElementById('userList');
    const items = userList.querySelectorAll('li'); 
      items.forEach(item => {
        if (!item.hasClickListener) {
          const handleClick = function(event) {
            if (isDeleteMode) {
              const login = item.getAttribute('data-user-login');
              const isAdmin = item.getAttribute('data-user-admin') === 'true';
              if (login === 'admin' && isAdmin) {
                alert('Not delete the admin!');
                this.style.backgroundColor = ''; 
                isDeleteMode = false; // Сбрасываем флаг после показа сообщения
                return;
              }
              event.stopImmediatePropagation(); // Останавливаем выполнение других обработчиков
              const userLogin = item.getAttribute('data-user-login');
              removeUserFromLocalStorage(userLogin);
              this.remove();
              updateUserLocalStorage(userList);
              isDeleteMode = false; 
              const show_user_tasks = document.getElementById("show_user_tasks");
              show_user_tasks.style.display = "block";
              const user_tasks_admin_box = document.getElementById("user_tasks_admin_box");
              user_tasks_admin_box.style.display = "block";
              const table_box = document.getElementById("table_box");
              table_box.style.display = "none";
              const task_header = document.getElementById("task_header");
              task_header.style.display = "none"
              const footer = document.getElementById("footer");
              footer.style.display = "none"
            }
          };
          item.addEventListener('mouseenter', function() {
            if (isDeleteMode) {
              this.style.backgroundColor = '#faa1bb'; 
            }
          });
          item.addEventListener('mouseleave', function() {
            if (isDeleteMode) {
             this.style.backgroundColor = ''; 
            }
          });
          item.addEventListener('click', handleClick);
          item.hasClickListener = true;
        }
      });
  });
}

function updateUserLocalStorage(listElement) {
  const users = [];
  const items = listElement.querySelectorAll('li');
  items.forEach(item => {
    users.push(item.textContent);
  });
  const updateUsers = JSON.parse(localStorage.getItem('users')) || [];
  updateUsers[listElement.id] = users;
  localStorage.setItem('users', JSON.stringify(updateUsers));
  console.log('Saved to localStorage ');
}

function removeUserFromLocalStorage(login) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.filter(user => user.login !== login);
  localStorage.setItem('users', JSON.stringify(users));
  console.log(`User ${login} removed from localStorage`);
}

export function addUserClickListeners() {
  const userItems = document.querySelectorAll("#userList li");
  userItems.forEach(item => {
    item.addEventListener("click", function() {
      if (!isDeleteMode) { // Проверяем, не активирован ли режим удаления
       const user_tasks_admin_box = document.getElementById("user_tasks_admin_box");
       user_tasks_admin_box.style.display = "block";
       const clickedUserLogin = item.getAttribute('data-user-login');
       const clickedUserPassword = item.getAttribute('data-user-password');
        loginAsUser(clickedUserLogin, clickedUserPassword);
      }
    });
  });
}

// Функция для входа под выбранным пользователем и загрузки его страницы
function loginAsUser(login, password) {
  if (authUser(login, password)) {
  const fieldHTMLContent = taskFieldTemplate;
  document.querySelector("#user_tasks_admin_box").innerHTML = fieldHTMLContent;
  const navbar = document.getElementById("user_header__mainbox");
  navbar.style.display = "none";
  //console.log("Вошли как пользователь: " + login);
  const task_header = document.getElementById("task_header");
  task_header.style.display = "block";
  document.getElementById("cliked_login").textContent = login;
  document.getElementById("cliked_password").textContent = password;
  const addButton = document.getElementById('backlog__button__add');
  if (addButton) {
    addButton.addEventListener('click', addInput);
  } 
  const submitButton = document.getElementById('backlog__button__submit');
  if (submitButton) {
    submitButton.addEventListener('click', addNewTask);
  } 
  const deleteButton = document.getElementById('backlog__button__delete');
  if (deleteButton) {
    deleteButton.addEventListener('click', deleteTask);
  }
  const cancelButton = document.getElementById('backlog__button__cancel');
  if (cancelButton) {
    cancelButton.addEventListener('click', cancelDeliting);
  }

  const dropZones = document.querySelectorAll('.drop-zone-one');
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', allowDrop);
    zone.addEventListener('drop', drop);
    zone.addEventListener('dragenter', enterDropZone) 
    zone.addEventListener('dragleave', leaveDropZone)
  });
  loadTasks();
  } 
  else {
   const fieldHTMLContent = noAccessTemplate;
  document.querySelector("#content").innerHTML = fieldHTMLContent;
  }
}
