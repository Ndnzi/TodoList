// select
let filterValue = "all";
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const selectFilter = document.querySelector(".filter-todos");
const closeEditModalBtn = document.querySelector(".close-modal");
const backdrop = document.querySelector(".backdrop");
const editModal = document.querySelector(".edit__modal");
const editTodoInput = document.querySelector(".editInput");
const updateTodoBtn = document.querySelector(".submit--btn");
const closeModalBtn = document.querySelector(".close--btn");

// events
todoForm.addEventListener("submit", addNewTodo);
selectFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});

backdrop.addEventListener("click", closeModal);

updateTodoBtn.addEventListener("click", updateTodo);

closeEditModalBtn.addEventListener("click", closeModal);

closeModalBtn.addEventListener("click", closeModal);

editModal.addEventListener("click", (e) => e.stopPropagation());

// functions
function addNewTodo(e) {
  e.preventDefault();
  if (!todoInput.value) return null;
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };
  // todos.push(newTodo);
  saveTodo(newTodo);
  filterTodos();
}

function createTodos(todos) {
  // create todos on DOM
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
      <p class="todo__title ${todo.isCompleted && "completed"}">${
      todo.title
    }</p>
      <span class="todo__createdAt">${new Date(
        todo.createdAt
      ).toLocaleDateString("fa-IR")}</span>
      <button class="todo__check" data-todo-id=${
        todo.id
      } ><i class="fas fa-check-square"></i></button>
      <button class="todo__edit" data-todo-id=${
        todo.id
      } ><i class="fas fa-edit"></i></button>
      <button class="todo__remove" data-todo-id=${
        todo.id
      } ><i class="fas fa-trash-alt"></i></button>
    </li>`;
  });

  todoList.innerHTML = result;
  todoInput.value = "";

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const editBtns = [...document.querySelectorAll(".todo__edit")];
  editBtns.forEach((btn) => btn.addEventListener("click", openEditForm));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));
}

let todoToEditId;
function openEditForm(e) {
  openModal();
  todoToEditId = +e.target.dataset.todoid;
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoToEditId);
  editTodoInput.value = todo.title;
  editTodoInput.focus();
}

function updateTodo(e) {
  if (!editTodoInput.value) {
    alert("Please enter a valid todo title !");
    return;
  }
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoToEditId);
  todo.title = editTodoInput.value;
  todo.updatedAt = new Date().toISOString();
  saveAllTodos(todos);
  filterTodos();
  closeModal();
}
const resetInput = () => {
  todoInput.value = "";
  editTodoInput.value = "";
};

function openModal(e) {
  backdrop.classList.remove("hidden");
}

function closeModal(e) {
  backdrop.classList.add("hidden");
}

function filterTodos() {
  // console.log(e.target.value);
  // const filter = e.target.value;
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((t) => t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    default:
      createTodos(todos);
  }
}

function removeTodo(e) {
  // console.log(e.target.dataset.todoId);
  // data-todo-id => todoId
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);
  saveAllTodos(todos);
  filterTodos();
}

function checkTodo(e) {
  // console.log(e.target.dataset.todoId);
  const todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}

// localStorage => web API
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  // const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
