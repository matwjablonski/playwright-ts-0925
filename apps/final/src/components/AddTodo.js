import { Component } from '../lib/Component';

export class AddTodo extends Component {
  constructor() {
    super();

    this.form = {
      task: '',
      description: '',
      priority: '2',
      due_date: ''
    };
    this.errors = {};
    
    // Bind methods to preserve 'this' context
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  afterServicesInjected() {
    this.subscribeStore('todos', 'data');
  }

  handleFormChange(event) {
    const { name, value } = event.target;
    
    // Ensure form object exists
    if (!this.form) {
      this.form = {
        task: '',
        description: '',
        priority: '2',
        due_date: ''
      };
    }
    
    this.form[name] = value;
    
    // Clear error for this field when user starts typing
    if (this.errors && this.errors[name]) {
      this.errors[name] = null;
      this.rerender();
    }
  }

  validateForm() {
    this.errors = {};
    
    if (!this.form?.task || this.form.task.trim().length < 3) {
      this.errors.task = 'Tytuł zadania musi mieć co najmniej 3 znaki';
    }
    
    if (!this.form?.description || this.form.description.trim().length < 10) {
      this.errors.description = 'Opis zadania musi mieć co najmniej 10 znaków';
    }
    
    if (this.form?.due_date) {
      const dueDate = new Date(this.form.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        this.errors.due_date = 'Termin wykonania nie może być wcześniejszy niż dzisiaj';
      }
    }
    
    return Object.keys(this.errors).length === 0;
  }

  handleSubmit() {
    if (!this.validateForm()) {
      this.rerender();
      return;
    }

    const todo = {
      task: this.form?.task?.trim() || '',
      description: this.form?.description?.trim() || '',
      priority: parseInt(this.form?.priority) || 2,
      due_date: this.form?.due_date || null
    };

    this.services.TodosService.addTodo(todo);
    
    // Clear form
    this.form = {
      task: '',
      description: '',
      priority: '2',
      due_date: ''
    };
    this.errors = {};
    this.rerender();
  }

  renderError(fieldName) {
    if (!this.errors || !this.errors[fieldName]) return null;
    
    return this.createElement(
      'p',
      { class: 'help is-danger' },
      [this.errors[fieldName]]
    );
  }

  render() {
    // Ensure form and errors are initialized
    if (!this.form) {
      this.form = {
        task: '',
        description: '',
        priority: '2',
        due_date: ''
      };
    }
    if (!this.errors) {
      this.errors = {};
    }

    return this.createElement(
      'div',
      { class: 'box' },
      [
        this.createElement(
          'h2',
          { class: 'title is-4' },
          ['Dodaj nowe zadanie']
        ),
        
        // Task title
        this.createElement(
          'div',
          { class: 'field' },
          [
            this.createElement(
              'label',
              { class: 'label' },
              ['Tytuł zadania *']
            ),
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'input',
                  {
                    class: `input ${this.errors?.task ? 'is-danger' : ''}`,
                    type: 'text',
                    placeholder: 'Wpisz tytuł zadania (min. 3 znaki)',
                    name: 'task',
                    value: this.form?.task || '',
                    onInput: (event) => this.handleFormChange(event),
                  }
                )
              ]
            ),
            this.renderError('task')
          ]
        ),

        // Description
        this.createElement(
          'div',
          { class: 'field' },
          [
            this.createElement(
              'label',
              { class: 'label' },
              ['Opis zadania *']
            ),
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'textarea',
                  {
                    class: `textarea ${this.errors?.description ? 'is-danger' : ''}`,
                    placeholder: 'Wpisz szczegółowy opis zadania (min. 10 znaków)',
                    name: 'description',
                    value: this.form?.description || '',
                    onInput: (event) => this.handleFormChange(event),
                    rows: '3'
                  }
                )
              ]
            ),
            this.renderError('description')
          ]
        ),

        // Priority and Due Date row
        this.createElement(
          'div',
          { class: 'columns' },
          [
            // Priority
            this.createElement(
              'div',
              { class: 'column' },
              [
                this.createElement(
                  'div',
                  { class: 'field' },
                  [
                    this.createElement(
                      'label',
                      { class: 'label' },
                      ['Priorytet']
                    ),
                    this.createElement(
                      'div',
                      { class: 'control' },
                      [
                        this.createElement(
                          'div',
                          { class: 'select is-fullwidth' },
                          [
                            this.createElement(
                              'select',
                              {
                                name: 'priority',
                                value: this.form?.priority || '2',
                                onChange: (event) => this.handleFormChange(event)
                              },
                              [
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
            ),

            // Due Date
            this.createElement(
              'div',
              { class: 'column' },
              [
                this.createElement(
                  'div',
                  { class: 'field' },
                  [
                    this.createElement(
                      'label',
                      { class: 'label' },
                      ['Termin wykonania']
                    ),
                    this.createElement(
                      'div',
                      { class: 'control' },
                      [
                        this.createElement(
                          'input',
                          {
                            class: `input ${this.errors?.due_date ? 'is-danger' : ''}`,
                            type: 'date',
                            name: 'due_date',
                            value: this.form?.due_date || '',
                            onChange: (event) => this.handleFormChange(event),
                            min: new Date().toISOString().split('T')[0]
                          }
                        )
                      ]
                    ),
                    this.renderError('due_date')
                  ]
                )
              ]
            )
          ]
        ),

        this.createElement(
          'div',
          { class: 'field' },
          [
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'button',
                  {
                    class: 'button is-primary is-fullwidth',
                    onClick: () => this.handleSubmit()
                  },
                  ['➕ Dodaj zadanie']
                )
              ]
            )
          ]
        )
      ]
    )
  }
}
