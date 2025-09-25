import { Component } from '../lib/Component';

export class About extends Component {
  constructor() {
    super();
  }

  render() {
    return this.createElement(
      'div',
      { class: 'container' },
      [
        this.createElement(
          'div',
          { class: 'hero is-light' },
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
                      'h1',
                      { class: 'title is-2' },
                      ['📋 O aplikacji Todo']
                    ),
                    this.createElement(
                      'h2',
                      { class: 'subtitle is-4' },
                      ['Nowoczesna aplikacja do zarządzania zadaniami']
                    )
                  ]
                )
              ]
            )
          ]
        ),

        this.createElement(
          'section',
          { class: 'section' },
          [
            this.createElement(
              'div',
              { class: 'container' },
              [
                this.createElement(
                  'div',
                  { class: 'columns is-centered' },
                  [
                    this.createElement(
                      'div',
                      { class: 'column is-8' },
                      [
                        // Features section
                        this.createElement(
                          'div',
                          { class: 'content' },
                          [
                            this.createElement(
                              'h3',
                              { class: 'title is-3' },
                              ['✨ Funkcjonalności']
                            ),
                            this.createElement(
                              'ul',
                              { class: 'is-size-5' },
                              [
                                this.createElement('li', {}, ['🎯 System priorytetów (niski, średni, wysoki)']),
                                this.createElement('li', {}, ['📅 Terminy wykonania zadań']),
                                this.createElement('li', {}, ['🔍 Wyszukiwanie i filtrowanie zadań']),
                                this.createElement('li', {}, ['✅ Operacje masowe na zadaniach']),
                                this.createElement('li', {}, ['📊 Dashboard ze statystykami']),
                                this.createElement('li', {}, ['💾 Automatyczny zapis w localStorage']),
                                this.createElement('li', {}, ['🔐 System logowania']),
                                this.createElement('li', {}, ['🧭 Routing i nawigacja'])
                              ]
                            )
                          ]
                        ),

                        // Technology section
                        this.createElement(
                          'div',
                          { class: 'content mt-6' },
                          [
                            this.createElement(
                              'h3',
                              { class: 'title is-3' },
                              ['🛠️ Technologie']
                            ),
                            this.createElement(
                              'div',
                              { class: 'tags are-large' },
                              [
                                this.createElement('span', { class: 'tag is-primary' }, ['Vanilla JavaScript']),
                                this.createElement('span', { class: 'tag is-info' }, ['Custom Component Framework']),
                                this.createElement('span', { class: 'tag is-success' }, ['Bulma CSS']),
                                this.createElement('span', { class: 'tag is-warning' }, ['Vite']),
                                this.createElement('span', { class: 'tag is-danger' }, ['Service Architecture'])
                              ]
                            )
                          ]
                        ),

                        // Architecture section
                        this.createElement(
                          'div',
                          { class: 'content mt-6' },
                          [
                            this.createElement(
                              'h3',
                              { class: 'title is-3' },
                              ['🏗️ Architektura']
                            ),
                            this.createElement(
                              'p',
                              { class: 'is-size-5' },
                              ['Aplikacja została zbudowana w oparciu o własny framework komponentów z architekturą serwisową. Każdy komponent dziedziczy po klasie bazowej Component, a logika biznesowa jest wydzielona do osobnych serwisów.']
                            ),
                            this.createElement(
                              'div',
                              { class: 'box mt-4' },
                              [
                                this.createElement(
                                  'h4',
                                  { class: 'title is-4' },
                                  ['📁 Struktura projektu:']
                                ),
                                this.createElement(
                                  'pre',
                                  { class: 'has-background-dark has-text-light p-4' },
                                  [`src/
├── components/     # Komponenty UI
├── services/       # Logika biznesowa
├── lib/           # Framework (Component, Service)
├── config/        # Konfiguracja
└── main.js        # Punkt wejścia`]
                                )
                              ]
                            )
                          ]
                        ),

                        // Navigation
                        this.createElement(
                          'div',
                          { class: 'has-text-centered mt-6' },
                          [
                            this.createElement(
                              'a',
                              { 
                                href: '#/',
                                class: 'button is-primary is-large'
                              },
                              ['🏠 Powrót do aplikacji']
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