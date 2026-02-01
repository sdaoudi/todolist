(function () {
    'use strict';

    const STORAGE_KEY = 'todolist_items';

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const footer = document.getElementById('todo-footer');
    const countEl = document.getElementById('todo-count');
    const clearBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = loadTodos();
    let currentFilter = 'all';

    function loadTodos() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveTodos() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.dataset.id = todo.id;

        li.innerHTML =
            '<div class="todo-checkbox">' +
                '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
            '</div>' +
            '<span class="todo-text"></span>' +
            '<button class="delete-btn" aria-label="Supprimer">' +
                '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
            '</button>';

        li.querySelector('.todo-text').textContent = todo.text;

        li.querySelector('.todo-checkbox').addEventListener('click', function () {
            toggleTodo(todo.id);
        });

        li.querySelector('.delete-btn').addEventListener('click', function () {
            deleteTodo(todo.id);
        });

        return li;
    }

    function render() {
        var filtered = todos.filter(function (todo) {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        list.innerHTML = '';

        if (filtered.length === 0) {
            var empty = document.createElement('li');
            empty.className = 'empty-state';
            if (currentFilter === 'active') {
                empty.textContent = 'Aucune tache active';
            } else if (currentFilter === 'completed') {
                empty.textContent = 'Aucune tache terminee';
            } else {
                empty.textContent = 'Aucune tache — ajoutez-en une !';
            }
            list.appendChild(empty);
        } else {
            filtered.forEach(function (todo) {
                list.appendChild(createTodoElement(todo));
            });
        }

        var activeCount = todos.filter(function (t) { return !t.completed; }).length;
        var completedCount = todos.length - activeCount;

        countEl.textContent = activeCount + ' tache' + (activeCount !== 1 ? 's' : '') + ' restante' + (activeCount !== 1 ? 's' : '');

        clearBtn.style.display = completedCount > 0 ? '' : 'none';
        footer.classList.toggle('hidden', todos.length === 0);
    }

    function addTodo(text) {
        todos.unshift({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            text: text,
            completed: false
        });
        saveTodos();
        render();
    }

    function toggleTodo(id) {
        todos = todos.map(function (t) {
            if (t.id === id) return { id: t.id, text: t.text, completed: !t.completed };
            return t;
        });
        saveTodos();
        render();
    }

    function deleteTodo(id) {
        todos = todos.filter(function (t) { return t.id !== id; });
        saveTodos();
        render();
    }

    // Events
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (text) {
            addTodo(text);
            input.value = '';
            input.focus();
        }
    });

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    clearBtn.addEventListener('click', function () {
        todos = todos.filter(function (t) { return !t.completed; });
        saveTodos();
        render();
    });

    // Initial render
    render();
})();
