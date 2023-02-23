//DATA

function displayDate() {
  let date = new Date();
  date = date.toString().split(" ");
  date = date[1] + " " + date[2] + " " + date[3];
  document.querySelector("#data").innerHTML = date;
}

function displayDia() {
  let dia = new Date();
  dia = dia.toString().split(" ");
  dia = dia[0];
  document.querySelector("#dia-semana").innerHTML = dia;
}

window.onload = function () {
  textos();
  displayDate();
  displayDia();
};

//HORAS

let horas = document.querySelector("#horas");
let minutos = document.querySelector("#minutos");
let segundos = document.querySelector("#segundos");

const relogio = setInterval(function time() {
  let horaLocal = new Date();
  let horasAgora = horaLocal.getHours();
  let minutosAgora = horaLocal.getMinutes();
  let segundosAgora = horaLocal.getSeconds();

  if (horasAgora < 10) horasAgora = "0" + horasAgora;
  if (minutosAgora < 10) minutosAgora = "0" + minutosAgora;
  if (segundosAgora < 10) segundosAgora = "0" + segundosAgora;

  horas.textContent = horasAgora.toString();
  minutos.textContent = minutosAgora.toString();
  segundos.textContent = segundosAgora.toString();
});

//TEXTINHO

function textos() {
  let horasExatas = new Date();
  let horaAtual = horasExatas.getHours();
  horasExatas.getDate();
  let textinho = document.querySelector(".textinho");

  if (horaAtual >= 00 && horaAtual < 12) {
    textinho.innerHTML = `<box-icon name='sun' color='black' size='lg'></box-icon>Good morning!`;
    document.body.style.backgroundColor = "#E1E6E5";
  } else if (horaAtual >= 12 && horaAtual < 18) {
    textinho.innerHTML = `<box-icon type='solid' name='sun' color='yellow' size='lg'></box-icon>Good afternoon!`;
    document.body.style.backgroundColor = "#B9DBE9";
  } else if (horaAtual >= 18 || horaAtual < 00) {
    textinho.innerHTML = `<box-icon  type='solid' name='moon' size='lg' color='white'></box-icon>Good evening!`;
    document.body.style.backgroundColor = "#15253F";
    document.querySelector("#relogio").style.color = "#ffffffe0";
    document.querySelector("#data").style.color = "#ffffffe0";
    document.querySelector(".textinho").style.color = "#ffffffe0";
    document.querySelector(".titulo").style.color = "#ffffffe0";
    document.querySelector(".primeiro-titulo-header").style.color = "#ffffffe0";
    document.querySelector(".stats").style.color = "#ffffffe0";
  }
}

//TO-DO

//SELETORES

const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const mainInput = document.querySelector("#todo-form input");
const resetAll = document.querySelector(".resetar");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  }); //Fora da function
}

// EVENTS

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value;
  if (inputValue == "") {
    return;
  }

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(task);

  todoForm.reset();
  mainInput.focus();
});

todoList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("remove-task") ||
    e.target.parentElement.classList.contains("remove-task")
  ) {
    const taskId = e.target.closest("li").id;

    removeTask(taskId);
  }
});

resetAll.addEventListener("click", (e) => {
  document.querySelectorAll(".todos li").forEach((e) => {    
    removeAllTasks();
    e.remove();
  });
});

todoList.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    e.target.blur();
  }
});

todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;

  updateTask(taskId, e.target);
});

// FUNCTIONS

function createTask(task) {
  const novaTask = document.createElement("li");
  novaTask.setAttribute("id", task.id);

  if (task.isCompleted) {
    novaTask.classList.add("complete");
  }

  const novaTaskMarcada = `
  <div>
                <input type="checkbox" name="tasks" id="${task.id}" ${
    task.isCompleted ? "checked" : ""
  }>
                <span ${!task.isCompleted ? "contenteditable" : ""}>${
    task.name
  }</span>
              </div>
              <button title="Remove "${task.name}" task" class="remove-task">
              <box-icon name='x' size="28px" color="#FE2E34"></box-icon></box-icon> 
              </button>
  `;

  novaTask.innerHTML = novaTaskMarcada;

  todoList.appendChild(novaTask);

  countTasks();
}

function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completedTasksArray.length;
  remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById(taskId).remove();

  countTasks();
}

function removeAllTasks() {
  tasks = [];

  localStorage.setItem("tasks", JSON.stringify(tasks));

  countTasks();
}

function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (el.hasAttribute("contenteditable")) {
    task.name = el.textContent;
  } else {
    const span = el.nextElementSibling;
    const parent = el.closest("li");

    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
      span.removeAttribute("contenteditable");
      parent.classList.add("complete");
    } else {
      span.setAttribute("contenteditable", "true");
      parent.classList.remove("complete");
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  countTasks();
}
