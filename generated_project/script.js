// script.js - Todo App Logic

// Todo class definition
class Todo {
  /**
   * @param {string} id - Unique identifier for the todo
   * @param {string} text - The todo text
   * @param {boolean} completed - Completion status
   */
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

// In‑memory storage for todos
let todos = [];

/** Load todos from localStorage and populate the `todos` array */
function loadTodos() {
  const raw = localStorage.getItem('todos');
  if (!raw) {
    todos = [];
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    // Ensure we have an array of objects with required properties
    if (Array.isArray(parsed)) {
      todos = parsed.map(item => new Todo(item.id, item.text, !!item.completed));
    } else {
      todos = [];
    }
  } catch (e) {
    console.error('Failed to parse todos from localStorage:', e);
    todos = [];
  }
}

/** Save the current `todos` array to localStorage */
function saveTodos() {
  try {
    const serialized = JSON.stringify(todos);
    localStorage.setItem('todos', serialized);
  } catch (e) {
    console.error('Failed to save todos to localStorage:', e);
  }
}

/** Render the todo list UI based on the `todos` array */
function renderTodos() {
  const listEl = document.getElementById('todo-list');
  const itemsLeftEl = document.getElementById('items-left');
  if (!listEl || !itemsLeftEl) return;

  // Clear existing list
  listEl.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    if (todo.completed) li.classList.add('completed');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'toggle';
    checkbox.dataset.id = todo.id;
    checkbox.checked = todo.completed;
    li.appendChild(checkbox);

    // Text span
    const span = document.createElement('span');
    span.textContent = todo.text;
    li.appendChild(span);

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete';
    delBtn.dataset.id = todo.id;
    li.appendChild(delBtn);

    listEl.appendChild(li);
  });

  // Update items left count
  const incompleteCount = todos.filter(t => !t.completed).length;
  itemsLeftEl.textContent = `${incompleteCount} item${incompleteCount !== 1 ? 's' : ''} left`;
}

/** Add a new todo based on the input field value */
function addTodoFromInput() {
  const input = document.getElementById('new-todo');
  if (!input) return;
  const text = input.value.trim();
  if (text === '') return;

  const newTodo = new Todo(Date.now().toString(), text, false);
  todos.push(newTodo);
  saveTodos();
  renderTodos();
  input.value = '';
}

/** Toggle completion status of a todo identified by its id */
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveTodos();
  renderTodos();
}

/** Delete a todo identified by its id */
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

/** Clear all completed todos */
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
}

// Event listeners setup
document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  renderTodos();

  // Add button click
  const addBtn = document.getElementById('add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', addTodoFromInput);
  }

  // Enter key on the input field
  const input = document.getElementById('new-todo');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTodoFromInput();
      }
    });
  }

  // Delegated listeners for toggle and delete within the list
  const listEl = document.getElementById('todo-list');
  if (listEl) {
    // Toggle completed
    listEl.addEventListener('change', e => {
      const target = e.target;
      if (target && target.matches('input.toggle')) {
        const id = target.dataset.id;
        if (id) toggleTodo(id);
      }
    });

    // Delete button
    listEl.addEventListener('click', e => {
      const target = e.target;
      if (target && target.matches('button.delete')) {
        const id = target.dataset.id;
        if (id) deleteTodo(id);
      }
    });
  }

  // Clear completed button
  const clearBtn = document.getElementById('clear-completed');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearCompleted);
  }
});
