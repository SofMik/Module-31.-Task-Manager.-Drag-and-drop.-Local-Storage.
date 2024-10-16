import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import adminTaskFieldTemplate from "./templates/adminTaskField.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { authUser } from "./services/auth";
import { State } from "./state";
import { addUser } from "./models/User";
import { showUsers } from "./models/User";
import { isAdminUser } from "./models/User";
import { deleteUser } from "./models/User";
import { addUserClickListeners } from "./models/User";
import { sayHi } from "./models/Tasks";
import { showAccountPageToUser } from "./models/Tasks";
import { showTasksPageToUser } from "./models/Tasks";
import { hideMenu } from "./models/Tasks";
import { showMenu } from "./models/Tasks";
import { addInput } from "./models/Tasks";
import { addNewTask } from "./models/Tasks";
import { deleteTask, cancelDeliting } from "./models/Tasks";
import { loadTasks } from "./models/Tasks";
import { allowDrop, drop, enterDropZone, leaveDropZone } from "./models/Tasks";

//localStorage.clear();//Очищает localStorage с помощью метода

//Создается новое состояние приложения с помощью конструктора State
export const appState = new State();
//Получение формы логина:
const loginForm = document.querySelector("#app-login-form");
//Генерация тестового пользователя:
generateTestUser(User);
//Добавление обработчика события для формы логина:
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");
  let fieldHTMLContent = authUser(login, password)
//Проверка прав пользователя и отображение соответствующего контента
  if (isAdminUser(login, password)) {
    sayHi(login);
    fieldHTMLContent = adminTaskFieldTemplate;
    document.querySelector("#content").innerHTML = fieldHTMLContent;
    showUsers();
    deleteUser()
    addUserClickListeners();
    } 
  else if (authUser(login, password)) {
    sayHi(login);
    fieldHTMLContent = taskFieldTemplate;
    document.querySelector("#content").innerHTML = fieldHTMLContent;
    loadTasks();
    }
  else {
    fieldHTMLContent = noAccessTemplate;
    document.querySelector("#content").innerHTML = fieldHTMLContent;
    }
//Скрытие навигационной панели и отображение логина пользователя: 
  const navbar = document.getElementById("navbar");
  navbar.style.display = "none";
  document.getElementById("user_login").textContent = login;
//Добавление обработчиков событий для различных кнопок и элементов
  document.getElementById('backlog__button__add')?.addEventListener('click', () => addInput());
  document.getElementById('backlog__button__submit')?.addEventListener('click', () => addNewTask());
  document.getElementById('backlog__button__delete')?.addEventListener('click', () => deleteTask());
  document.getElementById('backlog__button__cancel')?.addEventListener('click', () => cancelDeliting());
  document.getElementById('menu__btn_up')?.addEventListener('click', () => hideMenu());
  document.getElementById('menu__btn_down')?.addEventListener('click', () => showMenu());
  document.getElementById('user_button__menu__box__account')?.addEventListener('click', () => showAccountPageToUser());
  document.getElementById('user_button__menu__box__tasks')?.addEventListener('click', () => showTasksPageToUser());
  document.getElementById('button__add_user')?.addEventListener('click', () => addUser());
  document.getElementById('button__delete_user')?.addEventListener('click', () => deleteUser());
  const dropZones = document.querySelectorAll('.drop-zone-one');
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', allowDrop);
    zone.addEventListener('drop', drop);
    zone.addEventListener('dragenter', enterDropZone) 
    zone.addEventListener('dragleave', leaveDropZone)
  });
});
