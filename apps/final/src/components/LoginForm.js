import { Component } from '../lib/Component';

export class LoginForm extends Component {
  constructor(args) {
    super(args);
    
    this.form = {
      password: ''
    };
    this.errors = {};
    this.isLoading = false;
    
    // Bind methods
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  afterServicesInjected() {
    // Component is ready after services are injected
  }

  handleFormChange(event) {
    const { name, value } = event.target;
    
    if (!this.form) {
      this.form = { password: '' };
    }
    
    this.form[name] = value;
    
    // Clear error when user starts typing
    if (this.errors && this.errors[name]) {
      this.errors[name] = null;
      // Don't call rerender here - it causes focus loss
      // Instead, manually find and remove the error message and styling
      const errorElement = document.querySelector(`[data-error-for="${name}"]`);
      if (errorElement) {
        errorElement.remove();
      }
      // Remove is-danger class from the input field
      event.target.classList.remove('is-danger');
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  validateForm() {
    this.errors = {};
    
    if (!this.form?.password || this.form.password.trim().length === 0) {
      this.errors.password = 'Hasło jest wymagane';
    }
    
    return Object.keys(this.errors).length === 0;
  }

  handleSubmit() {
    if (this.isLoading) return;
    
    if (!this.validateForm()) {
      this.rerender();
      return;
    }

    this.isLoading = true;
    this.rerender();

    // Simulate slight delay for better UX
    setTimeout(() => {
      const loginSuccess = this.services.AuthService.login(this.form.password.trim());
      
      if (loginSuccess) {
        // Call callback to notify parent about successful login
        this.onArgChange('onLoginSuccess');
      } else {
        this.errors.password = 'Nieprawidłowe hasło';
        this.isLoading = false;
        this.rerender();
      }
    }, 300);
  }

  renderError(fieldName) {
    if (!this.errors || !this.errors[fieldName]) return null;
    
    return this.createElement(
      'p',
      { 
        class: 'help is-danger',
        'data-error-for': fieldName
      },
      [this.errors[fieldName]]
    );
  }

  render() {
    // Ensure form and errors are initialized
    if (!this.form) {
      this.form = { password: '' };
    }
    if (!this.errors) {
      this.errors = {};
    }

    return this.createElement(
      'div',
      { class: 'hero is-fullheight is-primary' },
      [
        this.createElement(
          'div',
          { class: 'hero-body' },
          [
            this.createElement(
              'div',
              { class: 'container has-text-centered' },
              [
                this.createElement(
                  'div',
                  { class: 'columns is-centered' },
                  [
                    this.createElement(
                      'div',
                      { class: 'column is-4-tablet is-3-desktop' },
                      [
                        // Logo/Title
                        this.createElement(
                          'div',
                          { class: 'has-text-centered mb-6' },
                          [
                            this.createElement(
                              'h1',
                              { class: 'title is-2 has-text-white' },
                              ['📋']
                            ),
                            this.createElement(
                              'h2',
                              { class: 'subtitle is-4 has-text-white' },
                              ['Todo App']
                            ),
                            this.createElement(
                              'p',
                              { class: 'has-text-white-ter' },
                              ['Wprowadź hasło aby uzyskać dostęp']
                            )
                          ]
                        ),

                        // Login Form
                        this.createElement(
                          'div',
                          { class: 'box' },
                          [
                            (() => {
                              // Create field manually to avoid Component.js issues
                              const field = document.createElement('div');
                              field.className = 'field';
                              
                              const label = document.createElement('label');
                              label.className = 'label';
                              label.textContent = 'Hasło';
                              field.appendChild(label);
                              
                              const control = document.createElement('div');
                              control.className = 'control';
                              
                              const input = document.createElement('input');
                              input.className = `input ${this.errors?.password ? 'is-danger' : ''}`;
                              input.type = 'password';
                              input.placeholder = 'Wprowadź hasło...';
                              input.name = 'password';
                              input.value = this.form?.password || '';
                              
                              // Add event listeners manually
                              input.addEventListener('input', (event) => {
                                this.handleFormChange(event);
                              });
                              
                              input.addEventListener('keydown', (event) => {
                                this.handleKeyPress(event);
                              });
                              
                              control.appendChild(input);
                              field.appendChild(control);
                              
                              // Add error if exists
                              const errorEl = this.renderError('password');
                              if (errorEl) {
                                field.appendChild(errorEl);
                              }
                              
                              return field;
                            })(),

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
                                        class: `button is-primary is-fullwidth ${this.isLoading ? 'is-loading' : ''}`,
                                        onClick: this.handleSubmit,
                                        disabled: this.isLoading
                                      },
                                      ['🔓 Zaloguj się']
                                    )
                                  ]
                                )
                              ]
                            ),

                            // Hint
                            this.createElement(
                              'div',
                              { class: 'has-text-centered mt-4' },
                              [
                                this.createElement(
                                  'p',
                                  { class: 'is-size-7 has-text-grey' },
                                  ['Domyślne hasło: admin123']
                                )
                              ]
                            )
                          ]
                        )
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
};