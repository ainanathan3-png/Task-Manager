/* ===========================
   TASK MANAGER APPLICATION
   Minimal, modern front-end task management
   All data persisted to LocalStorage
   =========================== */

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.editingTaskId = null;

        this.initElements();
        this.loadTasks();
        this.attachEventListeners();
        this.render();
    }

    initElements() {
        // Input elements
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.searchInput = document.getElementById('searchInput');
        
        // Display elements
        this.tasksList = document.getElementById('tasksList');
        this.totalTasksSpan = document.getElementById('totalTasks');
        this.completedTasksSpan = document.getElementById('completedTasks');
        this.emptyState = document.getElementById('emptyState');
        this.noResults = document.getElementById('noResults');
        
        // Filter and action buttons
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.actionsSection = document.getElementById('actionsSection');
        
        // Modal elements
        this.editModal = document.getElementById('editModal');
        this.modalBackdrop = document.getElementById('modalBackdrop');
        this.editInput = document.getElementById('editInput');
        this.closeModalBtn = document.getElementById('closeModal');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
        this.saveEditBtn = document.getElementById('saveEditBtn');
    }

    attachEventListeners() {
        // Add task
        this.addBtn.addEventListener('click', () => this.handleAddTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddTask();
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.render();
        });

        // Filter
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => this.handleClearCompleted());

        // Modal controls
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelEditBtn.addEventListener('click', () => this.closeModal());
        this.saveEditBtn.addEventListener('click', () => this.handleSaveEdit());
        this.modalBackdrop.addEventListener('click', () => this.closeModal());
        this.editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSaveEdit();
            if (e.key === 'Escape') this.closeModal();
        });
    }

    /* ===== TASK OPERATIONS ===== */

    handleAddTask() {
        const title = this.taskInput.value.trim();
        if (!title) return;

        const task = {
            id: Date.now(),
            title,
            completed: false,
            createdAt: new Date().toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.render();
    }

    handleDeleteTask(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        item.classList.add('removing');
        
        setTimeout(() => {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.render();
        }, 300);
    }

    handleToggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    handleEditTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.editingTaskId = id;
            this.editInput.value = task.title;
            this.openModal();
            this.editInput.focus();
            this.editInput.select();
        }
    }

    handleSaveEdit() {
        const newTitle = this.editInput.value.trim();
        if (!newTitle) {
            this.closeModal();
            return;
        }

        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (task) {
            task.title = newTitle;
            this.saveTasks();
            this.render();
        }

        this.closeModal();
    }

    handleClearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.render();
    }

    /* ===== FILTERING & DISPLAY ===== */

    getFilteredTasks() {
        let filtered = this.tasks;

        // Apply filter
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }

        // Apply search
        if (this.searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(this.searchQuery)
            );
        }

        return filtered;
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;

        this.totalTasksSpan.textContent = totalTasks;
        this.completedTasksSpan.textContent = completedTasks;

        // Show/hide clear completed button
        if (completedTasks > 0) {
            this.actionsSection.classList.remove('hidden');
        } else {
            this.actionsSection.classList.add('hidden');
        }
    }

    render() {
        const filteredTasks = this.getFilteredTasks();

        // Update stats
        this.updateStats();

        // Clear list
        this.tasksList.innerHTML = '';

        // Show appropriate empty state
        if (this.tasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.noResults.classList.add('hidden');
            return;
        }

        if (filteredTasks.length === 0) {
            this.emptyState.classList.add('hidden');
            this.noResults.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');
        this.noResults.classList.add('hidden');

        // Render tasks
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    aria-label="Toggle task completion"
                >
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.title)}</div>
                    <div class="task-meta">${task.createdAt}</div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit" title="Edit task" aria-label="Edit task">✏️</button>
                    <button class="task-btn delete" title="Delete task" aria-label="Delete task">🗑️</button>
                </div>
            `;

            // Attach event listeners
            const checkbox = li.querySelector('.task-checkbox');
            const editBtn = li.querySelector('.task-btn.edit');
            const deleteBtn = li.querySelector('.task-btn.delete');

            checkbox.addEventListener('change', () => this.handleToggleTask(task.id));
            editBtn.addEventListener('click', () => this.handleEditTask(task.id));
            deleteBtn.addEventListener('click', () => this.handleDeleteTask(task.id));

            this.tasksList.appendChild(li);
        });
    }

    /* ===== MODAL MANAGEMENT ===== */

    openModal() {
        this.editModal.classList.remove('hidden');
        this.modalBackdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.editModal.classList.add('hidden');
        this.modalBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
        this.editingTaskId = null;
        this.editInput.value = '';
    }

    /* ===== STORAGE MANAGEMENT ===== */

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        this.tasks = saved ? JSON.parse(saved) : [];
    }

    /* ===== UTILITIES ===== */

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

/* Initialize app when DOM is ready */
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
