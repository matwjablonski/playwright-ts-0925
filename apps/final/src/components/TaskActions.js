import { Component } from '../lib/Component';

export class TaskActions extends Component {
  constructor(args) {
    super(args);
    
    // Set properties from args
    this.taskId = args.taskId;
    this.done = args.done;
    this.priority = args.priority;

    // Bind methods
    this.onToggleStatus = this.onToggleStatus.bind(this);
    this.onChangePriority = this.onChangePriority.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  afterServicesInjected() {
    this.subscribeStore('todos', 'data');
  }

  // Get current todo data from store
  getCurrentTodo() {
    const todos = this.data || [];
    return todos.find(todo => todo.id === this.taskId);
  }

  addAction(action) {
    this.actions.push(action);
  }

  onToggleStatus(e) {
    if (this.services?.TodosService) {
      this.services.TodosService.toggleTodoStatus(this.taskId);
      // Let the store update trigger re-render of parent component
    }
  }

  onChangePriority(event) {
    const priority = parseInt(event.target.value);
    if (this.services?.TodosService) {
      this.services.TodosService.updateTodoPriority(this.taskId, priority);
      // Don't use onArgChange - let the store update trigger re-render
    }
  }

  onRemove() {
    if (this.services?.TodosService) {
      this.services.TodosService.removeTodoById(this.taskId);
    }
  }

  onEdit() {
    // Call parent component's edit handler if provided
    if (this.onEditHandler) {
      this.onEditHandler(this.taskId);
    }
  }

  render() {
    // Get current todo data from store
    const currentTodo = this.getCurrentTodo();
    const done = currentTodo?.done || this.done;
    const priority = currentTodo?.priority || this.priority || 2;

    return this.createElement(
      'div',
      { class: 'card-footer' },
      [
        // Toggle status button
        this.createElement(
          'button', 
          { 
            class: `card-footer-item ${done ? 'has-text-warning' : 'has-text-success'}`,
            onClick: () => this.onToggleStatus() 
          },
          [done ? '↶ Przywróć' : '✓ Ukończ']
        ),
        
        // Priority selector
        this.createElement(
          'div',
          { class: 'card-footer-item' },
          [
            this.createElement(
              'div',
              { class: 'select is-small' },
              [
                this.createElement(
                  'select',
                  {
                    value: priority.toString(),
                    onChange: (event) => this.onChangePriority(event),
                    disabled: done || undefined
                  },
                  [
                    this.createElement('option', { value: '1' }, ['🔴 Wysoki']),
                    this.createElement('option', { value: '2' }, ['🟡 Średni']),
                    this.createElement('option', { value: '3' }, ['🟢 Niski'])
                  ]
                )
              ]
            )
          ]
        ),
        
        // Edit button
        this.createElement(
          'button', 
          { 
            class: 'card-footer-item has-text-info', 
            onClick: this.onEdit,
            disabled: done || undefined
          },
          ['✏️ Edytuj']
        ),
        
        // Remove button
        this.createElement(
          'button', 
          { 
            class: 'card-footer-item has-text-danger', 
            onClick: () => this.onRemove()
          },
          ['🗑️ ' + this.removeLabel]
        )
      ]
    );
  }
}
