import { Component } from '../lib/Component';
import { AddTodo } from './AddTodo';
import { TaskActions } from './TaskActions';
import { FilterBar } from './FilterBar';
import { BulkActions } from './BulkActions';
import { EditTodoForm } from './EditTodoForm';

export class TodosList extends Component {
  constructor(args) {
    super(args);

    this.currentFilter = 'all';
    this.searchQuery = '';
    this.priorityFilter = 'all';
    this.editingTodoId = null; // ID of todo being edited
    
    // Bind methods
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleEditTodo = this.handleEditTodo.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
  }

  afterServicesInjected() {
    this.subscribeStore('todos', 'data');
    
    // Fetch initial data
    this.fetchData();
  }

  async fetchData() {
    if (this.services && this.services.TodosService) {
      await this.services.TodosService.fetchTodos();
    }
  }

  handleFilterChange({ filter, search, priority }) {
    this.currentFilter = filter;
    this.searchQuery = search;
    this.priorityFilter = priority;
    this.rerender();
  }

  handleEditTodo(todoId) {
    this.editingTodoId = todoId;
    this.rerender();
  }

  handleSaveEdit() {
    this.editingTodoId = null;
    this.rerender();
  }

  handleCancelEdit() {
    this.editingTodoId = null;
    this.rerender();
  }

  formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Przeterminowane o ${Math.abs(diffDays)} dni`;
    } else if (diffDays === 0) {
      return 'Dzisiaj';
    } else if (diffDays === 1) {
      return 'Jutro';
    } else {
      return `Za ${diffDays} dni`;
    }
  }

  getPriorityClass(priority) {
    const classes = {
      1: 'has-background-danger-light',
      2: 'has-background-warning-light', 
      3: 'has-background-success-light'
    };
    return classes[priority] || '';
  }

  getPriorityIcon(priority) {
    const icons = {
      1: '🔴',
      2: '🟡', 
      3: '🟢'
    };
    return icons[priority] || '⚪';
  }

  isOverdue(dueDate, done) {
    if (!dueDate || done) return false;
    return new Date(dueDate) < new Date();
  }

  render() {
    // Safe access to services - fallback to empty array if not available yet
    const filteredTodos = this.services?.TodosService?.getFilteredTodos(
      this.currentFilter, 
      this.searchQuery, 
      this.priorityFilter
    ) || [];

    return this.createElement(
      'main',
      { class: 'container', 'data-testId': 'test-action-list-wrapper' },
      [
        // Filter Bar
        (() => {
          const filterBar = new FilterBar({
            onFilterChange: this.handleFilterChange,
            currentFilter: this.currentFilter,
            searchQuery: this.searchQuery,
            priorityFilter: this.priorityFilter
          });
          
          // Manually inject services before using the component
          if (this.services && filterBar.injectServices) {
            filterBar.injectServices(this.services);
          }
          
          return filterBar;
        })(),

        // Bulk Actions
        (() => {
          const bulkActions = new BulkActions();
          
          // Manually inject services before using the component
          if (this.services && bulkActions.injectServices) {
            bulkActions.injectServices(this.services);
          }
          
          return bulkActions;
        })(),

        // Add Todo Form
        (() => {
          const addTodo = new AddTodo();
          
          // Manually inject services before using the component
          if (this.services && addTodo.injectServices) {
            addTodo.injectServices(this.services);
          }
          
          return addTodo;
        })(),

        // Results info
        this.createElement(
          'div',
          { class: 'notification is-light mb-4' },
          [
            this.createElement(
              'p',
              {},
              [
                filteredTodos.length === 0 
                  ? 'Brak zadań spełniających kryteria wyszukiwania.'
                  : `Znaleziono ${filteredTodos.length} zadań.`
              ]
            )
          ]
        ),

        // Todos Grid
        this.createElement(
          'div', 
          { class: 'fixed-grid has-2-cols' }, 
          [
            this.createElement(
              'div',
              { class: 'grid' },
              filteredTodos.map(({ task, description, done, id, priority, due_date, created_at }) => {
                const isTaskOverdue = this.isOverdue(due_date, done);
                
                // If this todo is being edited, render the edit form
                if (this.editingTodoId === id) {
                  const editForm = new EditTodoForm({
                    todo: { task, description, done, id, priority, due_date, created_at },
                    onSaveCallback: this.handleSaveEdit,
                    onCancelCallback: this.handleCancelEdit
                  });
                  
                  // Manually inject services
                  if (this.services && editForm.injectServices) {
                    editForm.injectServices(this.services);
                  }
                  
                  return this.createElement(
                    'div',
                    { class: 'cell' },
                    [editForm]
                  );
                }
                
                return this.createElement(
                  'div',
                  { 
                    class: `card cell ${this.getPriorityClass(priority)} ${done ? 'has-text-grey' : ''} ${isTaskOverdue ? 'has-text-danger' : ''}`, 
                    'data-done': done ? 'true' : 'false' 
                  },
                  [
                    // Priority indicator
                    this.createElement(
                      'div',
                      { class: 'card-header' },
                      [
                        this.createElement(
                          'div',
                          { class: 'card-header-title is-size-7' },
                          [
                            this.createElement(
                              'span',
                              { class: 'tag is-small' },
                              [this.getPriorityIcon(priority)]
                            ),
                            due_date && this.createElement(
                              'span',
                              { 
                                class: `tag is-small ml-2 ${isTaskOverdue ? 'is-danger' : done ? 'is-success' : 'is-info'}` 
                              },
                              [isTaskOverdue ? '⏰ ' + this.formatDate(due_date) : '📅 ' + this.formatDate(due_date)]
                            )
                          ]
                        )
                      ]
                    ),

                    this.createElement(
                      'div',
                      { class: 'card-content' },
                      [
                        this.createElement(
                          'div',
                          { class: 'content' },
                          [
                            this.createElement(
                              'h2',
                              { class: `title is-5 ${done ? 'has-text-grey-light' : ''}` },
                              [done ? '✅ ' + task : task]
                            ),
                            this.createElement(
                              'p',
                              { class: `description ${done ? 'has-text-grey-light' : ''}` },
                              [description]
                            ),
                            created_at && this.createElement(
                              'p',
                              { class: 'is-size-7 has-text-grey mt-2' },
                              [`Utworzono: ${new Date(created_at).toLocaleDateString('pl-PL')}`]
                            )
                          ]
                        )
                      ]
                    ),

                    (() => {
                      const taskActions = new TaskActions({
                        removeLabel: 'Usuń zadanie', 
                        done: done,
                        taskId: id,
                        priority: priority,
                        onEditHandler: (todoId) => this.handleEditTodo(todoId)
                      });
                      
                      // Manually inject services before using the component
                      if (this.services && taskActions.injectServices) {
                        taskActions.injectServices(this.services);
                      }
                      
                      return taskActions;
                    })()
                  ]
                );
              })
            )
          ]
        )
      ]
    );
  }
}
