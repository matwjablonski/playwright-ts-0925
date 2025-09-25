import { Component } from '../lib/Component';

export class EditTodoForm extends Component {
  constructor(args) {
    // Initialize form with current todo data BEFORE calling super
    const todo = args.todo || {};
    
    // Set form and errors BEFORE calling super (which calls render)
    const form = {
      task: todo.task || '',
      description: todo.description || '',
      priority: String(todo.priority || 2),
      due_date: todo.due_date || ''
    };
    const errors = {};
    
    // Add form and errors to args so they're available in render
    const argsWithForm = { ...args, form, errors };
    
    super(argsWithForm);
    
    // Bind methods to preserve 'this' context
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  afterServicesInjected() {
    // EditTodoForm doesn't need to subscribe to store updates
    // It works with passed todo data directly
  }

  handleFormChange(event) {
    const { name, value } = event.target;
    
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

    if (!this.form?.description || this.form.description.trim().length < 5) {
      this.errors.description = 'Opis zadania musi mieć co najmniej 5 znaków';
    }

    if (this.form?.due_date) {
      const dueDate = new Date(this.form.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        this.errors.due_date = 'Data wykonania nie może być w przeszłości';
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (!this.validateForm()) {
      this.rerender();
      return;
    }

    try {
      // Prepare updates object
      const updates = {
        task: this.form.task.trim(),
        description: this.form.description.trim(),
        priority: parseInt(this.form.priority),
        due_date: this.form.due_date || null
      };

      await this.services?.TodosService?.updateTodo(this.todo.id, updates);
      
      // Call onSave callback if provided
      if (this.onSaveCallback) {
        this.onSaveCallback();
      }
      
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  handleCancel(event) {
    event.preventDefault();
    
    // Call onCancel callback if provided
    if (this.onCancelCallback) {
      this.onCancelCallback();
    }
  }

  render() {
    const priorities = [
      { value: 1, label: '🔴 Wysoki', class: 'has-text-danger' },
      { value: 2, label: '🟡 Średni', class: 'has-text-warning' },
      { value: 3, label: '🟢 Niski', class: 'has-text-success' }
    ];

    return this.createElement(
      'form',
      { class: 'box', onSubmit: this.handleSubmit },
      [
        this.createElement(
          'div',
          { class: 'field' },
          [
            this.createElement(
              'label',
              { class: 'label' },
              ['Tytuł zadania']
            ),
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'input',
                  {
                    class: `input ${this.errors.task ? 'is-danger' : ''}`,
                    type: 'text',
                    name: 'task',
                    value: this.form.task,
                    placeholder: 'Wprowadź tytuł zadania...',
                    onChange: this.handleFormChange
                  }
                )
              ]
            ),
            ...(this.errors.task ? [
              this.createElement(
                'p',
                { class: 'help is-danger' },
                [this.errors.task]
              )
            ] : [])
          ]
        ),

        this.createElement(
          'div',
          { class: 'field' },
          [
            this.createElement(
              'label',
              { class: 'label' },
              ['Opis']
            ),
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'textarea',
                  {
                    class: `textarea ${this.errors.description ? 'is-danger' : ''}`,
                    name: 'description',
                    value: this.form.description,
                    placeholder: 'Opisz szczegóły zadania...',
                    onChange: this.handleFormChange,
                    rows: 3
                  }
                )
              ]
            ),
            ...(this.errors.description ? [
              this.createElement(
                'p',
                { class: 'help is-danger' },
                [this.errors.description]
              )
            ] : [])
          ]
        ),

        this.createElement(
          'div',
          { class: 'columns' },
          [
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
                                value: this.form.priority,
                                onChange: this.handleFormChange
                              },
                              priorities.map(priority =>
                                this.createElement(
                                  'option',
                                  { 
                                    value: priority.value,
                                    selected: this.form.priority === String(priority.value) || undefined
                                  },
                                  [priority.label]
                                )
                              )
                            )
                          ]
                        )
                      ]
                    )
                  ]
                )
              ]
            ),

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
                      ['Data wykonania']
                    ),
                    this.createElement(
                      'div',
                      { class: 'control' },
                      [
                        this.createElement(
                          'input',
                          {
                            class: `input ${this.errors.due_date ? 'is-danger' : ''}`,
                            type: 'date',
                            name: 'due_date',
                            value: this.form.due_date,
                            onChange: this.handleFormChange
                          }
                        )
                      ]
                    ),
                    ...(this.errors.due_date ? [
                      this.createElement(
                        'p',
                        { class: 'help is-danger' },
                        [this.errors.due_date]
                      )
                    ] : [])
                  ]
                )
              ]
            )
          ]
        ),

        this.createElement(
          'div',
          { class: 'field is-grouped' },
          [
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'button',
                  {
                    class: 'button is-primary',
                    type: 'submit'
                  },
                  ['💾 Zapisz zmiany']
                )
              ]
            ),
            this.createElement(
              'div',
              { class: 'control' },
              [
                this.createElement(
                  'button',
                  {
                    class: 'button is-light',
                    type: 'button',
                    onClick: this.handleCancel
                  },
                  ['❌ Anuluj']
                )
              ]
            )
          ]
        )
      ]
    );
  }
}