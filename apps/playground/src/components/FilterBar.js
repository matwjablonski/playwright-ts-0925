import { Component } from '../lib/Component';

export class FilterBar extends Component {
  constructor(args) {
    super(args);
    
    // Use props if provided, otherwise use defaults
    this.currentFilter = args?.currentFilter || 'all';
    this.searchQuery = args?.searchQuery || '';
    this.priorityFilter = args?.priorityFilter || 'all';
    
    // Bind methods
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePriorityChange = this.handlePriorityChange.bind(this);
    
    // Debounce timer for search
    this.searchTimeout = null;
  }

  afterServicesInjected() {
    this.subscribeStore('todos', 'data');
  }

  handleFilterChange(filter) {
    this.currentFilter = filter;
    this.onArgChange('onFilterChange', { 
      filter: this.currentFilter, 
      search: this.searchQuery, 
      priority: this.priorityFilter 
    });
  }

  handleSearchChange(event) {
    this.searchQuery = event.target.value;
    
    // Clear existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Set new timeout to debounce the search
    this.searchTimeout = setTimeout(() => {
      this.onArgChange('onFilterChange', { 
        filter: this.currentFilter, 
        search: this.searchQuery, 
        priority: this.priorityFilter 
      });
    }, 300); // 300ms delay
  }

  handlePriorityChange(event) {
    this.priorityFilter = event.target.value;
    this.onArgChange('onFilterChange', { 
      filter: this.currentFilter, 
      search: this.searchQuery, 
      priority: this.priorityFilter 
    });
  }

  getPriorityLabel(priority) {
    const labels = {
      1: 'Wysoki',
      2: 'Średni', 
      3: 'Niski'
    };
    return labels[priority] || 'Nieznany';
  }

  render() {
    // Safe access to services - fallback to empty stats if not available yet
    const stats = this.services?.TodosService?.getTodosStats() || {
      total: 0,
      completed: 0,
      active: 0,
      overdue: 0,
      highPriority: 0
    };
    
    // Use props from parent if available, fallback to local state
    const currentFilter = this.currentFilter || 'all';
    const searchQuery = this.searchQuery || '';
    const priorityFilter = this.priorityFilter || 'all';
    
    return this.createElement(
      'div',
      { class: 'box mb-4' },
      [
        // Stats row
        this.createElement(
          'div',
          { class: 'level is-mobile mb-4' },
          [
            this.createElement(
              'div',
              { class: 'level-item has-text-centered' },
              [
                this.createElement('div', {}, [
                  this.createElement('p', { class: 'heading' }, ['Wszystkie']),
                  this.createElement('p', { class: 'title is-5' }, [stats.total.toString()])
                ])
              ]
            ),
            this.createElement(
              'div',
              { class: 'level-item has-text-centered' },
              [
                this.createElement('div', {}, [
                  this.createElement('p', { class: 'heading' }, ['Aktywne']),
                  this.createElement('p', { class: 'title is-5' }, [stats.active.toString()])
                ])
              ]
            ),
            this.createElement(
              'div',
              { class: 'level-item has-text-centered' },
              [
                this.createElement('div', {}, [
                  this.createElement('p', { class: 'heading' }, ['Ukończone']),
                  this.createElement('p', { class: 'title is-5' }, [stats.completed.toString()])
                ])
              ]
            ),
            this.createElement(
              'div',
              { class: 'level-item has-text-centered' },
              [
                this.createElement('div', {}, [
                  this.createElement('p', { class: 'heading' }, ['Przeterminowane']),
                  this.createElement('p', { class: 'title is-5 has-text-danger' }, [stats.overdue.toString()])
                ])
              ]
            ),
            this.createElement(
              'div',
              { class: 'level-item has-text-centered' },
              [
                this.createElement('div', {}, [
                  this.createElement('p', { class: 'heading' }, ['Ukończono']),
                  this.createElement('p', { class: 'title is-5' }, [`${stats.completionPercentage}%`])
                ])
              ]
            )
          ]
        ),
        
        // Search field - created manually to avoid re-render issues
        (() => {
          const field = document.createElement('div');
          field.className = 'field mb-4';
          
          const control = document.createElement('div');
          control.className = 'control has-icons-left';
          
          const input = document.createElement('input');
          input.className = 'input';
          input.type = 'text';
          input.placeholder = 'Wyszukaj zadania...';
          input.value = searchQuery;
          
          // Add event listener that preserves focus
          input.addEventListener('input', (event) => {
            this.handleSearchChange(event);
          });
          
          const iconSpan = document.createElement('span');
          iconSpan.className = 'icon is-small is-left';
          
          const icon = document.createElement('i');
          icon.className = 'fas fa-search';
          
          iconSpan.appendChild(icon);
          control.appendChild(input);
          control.appendChild(iconSpan);
          field.appendChild(control);
          
          return field;
        })(),

        // Filters row
        this.createElement(
          'div',
          { class: 'field is-grouped is-grouped-multiline' },
          [
            // Status filters
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'div',
                  { class: 'buttons has-addons' },
                  [
                    this.createElement(
                      'button',
                      {
                        class: `button ${currentFilter === 'all' ? 'is-primary' : ''}`,
                        onClick: () => this.handleFilterChange('all')
                      },
                      ['Wszystkie']
                    ),
                    this.createElement(
                      'button',
                      {
                        class: `button ${currentFilter === 'active' ? 'is-primary' : ''}`,
                        onClick: () => this.handleFilterChange('active')
                      },
                      ['Aktywne']
                    ),
                    this.createElement(
                      'button',
                      {
                        class: `button ${currentFilter === 'completed' ? 'is-primary' : ''}`,
                        onClick: () => this.handleFilterChange('completed')
                      },
                      ['Ukończone']
                    ),
                    this.createElement(
                      'button',
                      {
                        class: `button ${currentFilter === 'overdue' ? 'is-danger' : ''}`,
                        onClick: () => this.handleFilterChange('overdue')
                      },
                      ['Przeterminowane']
                    )
                  ]
                )
              ]
            ),

            // Priority filter
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'div',
                  { class: 'select' },
                  [
                    this.createElement(
                      'select',
                      {
                        value: priorityFilter,
                        onChange: (event) => this.handlePriorityChange(event)
                      },
                      [
                        this.createElement('option', { value: 'all' }, ['Wszystkie priorytety']),
                        this.createElement('option', { value: '1' }, ['🔴 Wysoki priorytet']),
                        this.createElement('option', { value: '2' }, ['🟡 Średni priorytet']),
                        this.createElement('option', { value: '3' }, ['🟢 Niski priorytet'])
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