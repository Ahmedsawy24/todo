const form = document.getElementById('form');
const input = document.getElementById('task');
const list = document.getElementById('list');
const count = document.getElementById('count');
const clearAllBtn = document.getElementById('clearAll');

// بنخزن المهام كـ array من الكائنات: { text: "...", done: false }
let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
  updateCount();
}

function updateCount() {
  const total = todos.length;
  const remaining = todos.filter(t=>!t.done).length;
  count.textContent = `Total: ${total} • Remaining: ${remaining}`;
}

function createTaskElement(task, index) {
  const li = document.createElement('li');
  li.className = task.done ? 'task done' : 'task';

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;
  text.title = 'Click to toggle complete';
  text.onclick = () => toggleDone(index);

  const actions = document.createElement('div');
  actions.className = 'actions';

  const delBtn = document.createElement('button');
  delBtn.className = 'delete';
  delBtn.textContent = '✕';
  delBtn.title = 'Delete';
  delBtn.onclick = (e) => { e.stopPropagation(); deleteTask(index); };

  actions.appendChild(delBtn);
  li.appendChild(text);
  li.appendChild(actions);
  return li;
}

function render() {
  list.innerHTML = '';
  todos.forEach((t, i) => {
    list.appendChild(createTaskElement(t, i));
  });
  updateCount();
}

function addTask(text) {
  todos.push({ text: text.trim(), done: false });
  save();
  render();
}

function toggleDone(index) {
  todos[index].done = !todos[index].done;
  save();
  render();
}

function deleteTask(index) {
  todos.splice(index, 1);
  save();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = input.value;
  if (!v || !v.trim()) return;
  addTask(v);
  input.value = '';
  input.focus();
});

clearAllBtn.addEventListener('click', () => {
  if (!todos.length) return;
  if (!confirm('Clear all tasks?')) return;
  todos = [];
  save();
  render();
});

// عند تحميل الصفحة
render();
