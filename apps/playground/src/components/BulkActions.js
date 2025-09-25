import { Component } from '../lib/Component';

export class BulkActions extends Component {
  constructor(args) {
    super(args);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleDeselectAll = this.handleDeselectAll.bind(this);
    this.handleClearCompleted = this.handleClearCompleted.bind(this);
    this.handleBulkPriorityChange = this.handleBulkPriorityChange.bind(this);
  }

  afterServicesInjected() {
    this.subscribeStore('todos', 'data');
  }

  handleSelectAll() {
    if (this.services?.TodosService) {
      this.services.TodosService.toggleAllTodos(true);
    }
  }

  handleDeselectAll() {
    if (this.services?.TodosService) {
      this.services.TodosService.toggleAllTodos(false);
    }
  }

  handleClearCompleted() {
    if (this.services?.TodosService && confirm('Czy na pewno chcesz usunąć wszystkie ukończone zadania?')) {
      this.services.TodosService.clearCompletedTodos();
    }
  }

  handleBulkPriorityChange(event) {
    const priority = parseInt(event.target.value);
    if (priority && confirm(`Czy na pewno chcesz zmienić priorytet wszystkich aktywnych zadań?`)) {
      const todos = this.data || [];
      const activeTodos = todos.filter(t => !t.done);
      
      activeTodos.forEach(todo => {
        this.services.TodosService.updateTodoPriority(todo.id, priority);
      });
    }
    // Reset select
    event.target.value = '';
  }

  render() {
    // Safe access to services - fallback to empty stats if not available yet
    const stats = this.services?.TodosService?.getTodosStats() || { total: 0 };
    
    if (stats.total === 0) {
      return this.createElement('div', {}, []);
    }

    return this.createElement(
      'div',
      { class: 'box' },
      [
        this.createElement(
          'h3',
          { class: 'title is-6 mb-3' },
          ['Operacje masowe']
        ),
        
        this.createElement(
          'div',
          { class: 'field is-grouped is-grouped-multiline' },
          [
            // Select/Deselect all
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'div',
                  { class: 'buttons' },
                  [
                    this.createElement(
                      'button',
                      {
                        class: 'button is-small is-info',
                        onClick: this.handleSelectAll,
                        disabled: stats.active === 0 || undefined
                      },
                      ['✓ Zaznacz wszystkie']
                    ),
                    this.createElement(
                      'button',
                      {
                        class: 'button is-small',
                        onClick: this.handleDeselectAll,
                        disabled: stats.completed === 0 || undefined
                      },
                      ['✗ Odznacz wszystkie']
                    )
                  ]
                )
              ]
            ),

            // Clear completed
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'button',
                  {
                    class: 'button is-small is-danger',
                    onClick: this.handleClearCompleted,
                    disabled: stats.completed === 0 || undefined
                  },
                  [`🗑️ Usuń ukończone (${stats.completed})`]
                )
              ]
            ),

            // Bulk priority change
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'div',
                  { class: 'select is-small' },
                  [
                    this.createElement(
                      'select',
                      {
                        onChange: this.handleBulkPriorityChange,
                        disabled: stats.active === 0 || undefined
                      },
                      [
                        this.createElement('option', { value: '' }, ['Zmień priorytet aktywnych...']),
                        this.createElement('option', { value: '1' }, ['🔴 Na wysoki']),
                        this.createElement('option', { value: '2' }, ['🟡 Na średni']),
                        this.createElement('option', { value: '3' }, ['🟢 Na niski'])
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
      ]
    );
  }
}