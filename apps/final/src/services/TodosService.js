import { Service } from '../lib/Service';

export class TodosService extends Service {
  constructor(services) {
    super(services);
  }

  async removeTodoById(todoId) {
    this.DataStoreService.removeByValue('todos', 'id', todoId);
  }

  async addTodo(todo) {
    const todos = this.DataStoreService.get('todos');
    todo.id = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    todo.done = false;
    todo.created_at = new Date().toISOString();
    todo.priority = todo.priority || 2; // Default medium priority

    this.DataStoreService.add('todos', todo);
  }

  async markTodoAsDone(todoId) {
    const todos = this.DataStoreService.get('todos');
    const todo = todos.find(t => t.id === todoId);
   
    if (todo) {
      todo.done = true;
      this.DataStoreService.set('todos', todos);
    }
  }

  async fetchTodos() {
    try {
      // Check if we have data in localStorage first
      const savedTodos = this.DataStoreService.get('todos');
      if (savedTodos && savedTodos.length > 0) {
        return;
      }

      const response = await fetch('/data.json')
      const { data } = await response.json();
      
      this.DataStoreService.set('todos', data);
    } catch (error) {
      console.error('Error initializing TodosService:', error);
    }
  }

  async toggleTodoStatus(todoId) {
    const todos = this.DataStoreService.get('todos');
    const todo = todos.find(t => t.id === todoId);
   
    if (todo) {
      todo.done = !todo.done;
      this.DataStoreService.set('todos', todos);
    }
  }

  async updateTodoPriority(todoId, priority) {
    const todos = this.DataStoreService.get('todos');
    const todo = todos.find(t => t.id === todoId);
   
    if (todo) {
      todo.priority = priority;
      this.DataStoreService.set('todos', todos);
    }
  }

  async updateTodo(todoId, updates) {
    const todos = this.DataStoreService.get('todos');
    const todo = todos.find(t => t.id === todoId);
   
    if (todo) {
      // Update allowed fields
      if (updates.task !== undefined) todo.task = updates.task;
      if (updates.description !== undefined) todo.description = updates.description;
      if (updates.due_date !== undefined) todo.due_date = updates.due_date;
      if (updates.priority !== undefined) todo.priority = updates.priority;
      
      this.DataStoreService.set('todos', todos);
    }
  }

  async clearCompletedTodos() {
    const todos = this.DataStoreService.get('todos');
    const activeTodos = todos.filter(t => !t.done);
    this.DataStoreService.set('todos', activeTodos);
  }

  async toggleAllTodos(done) {
    const todos = this.DataStoreService.get('todos');
    todos.forEach(todo => {
      todo.done = done;
    });
    this.DataStoreService.set('todos', todos);
  }

  getFilteredTodos(filter = 'all', searchQuery = '', priority = 'all') {
    let todos = this.DataStoreService.get('todos') || [];
    
    // Apply status filter
    if (filter === 'active') {
      todos = todos.filter(t => !t.done);
    } else if (filter === 'completed') {
      todos = todos.filter(t => t.done);
    } else if (filter === 'overdue') {
      const now = new Date();
      todos = todos.filter(t => !t.done && t.due_date && new Date(t.due_date) < now);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      todos = todos.filter(t => 
        t.task.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      );
    }

    // Apply priority filter
    if (priority !== 'all') {
      todos = todos.filter(t => t.priority === parseInt(priority));
    }

    // Sort by priority (1=high, 2=medium, 3=low) then by due date
    todos.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      if (a.due_date && b.due_date) {
        return new Date(a.due_date) - new Date(b.due_date);
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });

    return todos;
  }

  getTodosStats() {
    const todos = this.DataStoreService.get('todos') || [];
    const total = todos.length;
    const completed = todos.filter(t => t.done).length;
    const active = total - completed;
    const now = new Date();
    const overdue = todos.filter(t => !t.done && t.due_date && new Date(t.due_date) < now).length;
    
    return {
      total,
      completed,
      active,
      overdue,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
}
