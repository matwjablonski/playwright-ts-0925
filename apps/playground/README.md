# Todo App - Projekt szkoleniowy JavaScript → TypeScript

## Opis projektu

To jest rozszerzona aplikacja Todo zbudowana w JavaScript, przygotowana specjalnie na potrzeby szkolenia z TypeScript i testów End-to-End z Playwright.

## 🚀 Nowe funkcjonalności

### ✅ **System priorytetów i dat**
- **Priorytety**: Wysoki 🔴, Średni 🟡, Niski 🟢
- **Daty utworzenia**: Automatycznie dodawane przy tworzeniu zadania
- **Terminy wykonania**: Opcjonalne daty deadline z walidacją
- **Wizualne oznaczenia**: Kolorowe ramki i ikony priorytetów

### 🔍 **Zaawansowane filtrowanie i wyszukiwanie**
- **Filtry statusu**: Wszystkie, Aktywne, Ukończone, Przeterminowane
- **Wyszukiwanie**: Po tytule i opisie zadania (case-insensitive)
- **Filtr priorytetów**: Możliwość filtrowania po poziomie priorytetu
- **Sortowanie**: Automatyczne sortowanie po priorytecie i dacie

### 📝 **Kompleksowa walidacja formularzy**
- **Tytuł zadania**: Min. 3 znaki (wymagane)
- **Opis**: Min. 10 znaków (wymagane)
- **Data wykonania**: Nie może być wcześniejsza niż dzisiaj
- **Komunikaty błędów**: Wyświetlane w czasie rzeczywistym

### 💾 **Persistencja danych**
- **localStorage**: Automatyczny zapis wszystkich zmian
- **Synchronizacja**: Pierwsze uruchomienie ładuje dane z JSON
- **Offline**: Pełne działanie bez połączenia internetowego

### 📊 **Statystyki i dashboard**
- **Liczniki zadań**: Wszystkie, Aktywne, Ukończone, Przeterminowane
- **Procent ukończenia**: Wizualny wskaźnik postępu
- **Zadania przeterminowane**: Specjalne oznaczenie z animacją

### ⚡ **Operacje masowe (Bulk Operations)**
- **Zaznacz/Odznacz wszystkie**: Masowa zmiana statusu
- **Usuń ukończone**: Jednym klikiem usuwanie wszystkich ukończonych zadań
- **Zmiana priorytetów**: Masowa edycja priorytetów aktywnych zadań

## 🏗️ Architektura

```
src/
├── components/           # Komponenty UI
│   ├── AddTodo.js       # ✨ Rozszerzony formularz z walidacją
│   ├── FilterBar.js     # 🆕 Komponenty filtrowania i statystyk
│   ├── BulkActions.js   # 🆕 Operacje masowe
│   ├── TaskActions.js   # ✨ Rozszerzone akcje zadań
│   └── TodosList.js     # ✨ Główna lista z filtrowaniem
├── lib/                 # Biblioteka frameworka
│   ├── Component.js     # ✨ Dodano metodę rerender()
│   ├── createApp.js     # Inicjalizacja aplikacji
│   └── Service.js       # Bazowa klasa serwisów
└── services/           # Warstwa logiki biznesowej
    ├── DataStoreService.js  # ✨ + localStorage
    └── TodosService.js      # ✨ Rozszerzone o nowe metody
```

## 🎯 Cel szkoleniowy

### **Migracja do TypeScript**
Kursanci będą przepisywać kod z JavaScript na TypeScript, dodając:
- **Typy interfejsów** dla Todo, FilterOptions, TodoStats
- **Typy generyczne** dla Component<T> i Service<T>  
- **Enums** dla priorytetów i statusów filtrów
- **Type guards** dla walidacji danych
- **Strict mode** z pełną kontrolą typów

### **Testowanie E2E z Playwright**
Bogata funkcjonalność daje wiele możliwości testowych:
- **Testy formularzy**: Walidacja, dodawanie zadań z różnymi priorytetami
- **Testy filtrowania**: Wszystkie kombinacje filtrów i wyszukiwania  
- **Testy operacji masowych**: Zaznaczanie, usuwanie, zmiana priorytetów
- **Testy persistencji**: localStorage, synchronizacja danych
- **Testy responsywności**: Mobile vs desktop layout
- **Testy dostępności**: ARIA labels, keyboard navigation

## 🛠️ Instrukcja uruchomienia

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego  
npm run dev

# Build produkcyjny
npm run build

# Podgląd build'a
npm run preview
```

## 🧪 Przykładowe scenariusze testowe dla Playwright

### **Podstawowe funkcjonalności**
```javascript
test('powinien dodać nowe zadanie z wysokim priorytetem', async ({ page }) => {
  // Test dodawania zadania z walidacją
});

test('powinien filtrować zadania po statusie i priorytecie', async ({ page }) => {
  // Test kombinacji filtrów
});
```

### **Zaawansowane scenariusze**
```javascript
test('powinien zachować dane po odświeżeniu strony', async ({ page }) => {
  // Test localStorage persistence
});

test('powinien wykonać operacje masowe na zadaniach', async ({ page }) => {
  // Test bulk operations
});
```

## 📚 Kolejne kroki dla kursantów

1. **Analiza kodu JS** - Zrozumienie obecnej architektury
2. **Dodanie typów** - Stopniowa migracja do TypeScript
3. **Konfiguracja Playwright** - Setup środowiska testowego
4. **Napisanie testów** - Pokrycie wszystkich funkcjonalności
5. **CI/CD** - Automatyzacja testów w pipeline

## 🎨 Użyte technologie

- **Vanilla JavaScript** (ES6+)
- **Vite** - Build tool i dev server
- **Bulma CSS** - Framework UI
- **Font Awesome** - Ikony
- **localStorage API** - Persistencja danych

## 📋 Data testowa

Aplikacja zawiera przykładowe zadania z różnymi priorytetami i terminami wykonania w pliku `/public/data.json`.

---

**Uwaga dla instruktorów**: Ten projekt został zaprojektowany tak, aby dostarczyć kursantom realną aplikację z kompleksową funkcjonalnością, idealną do nauki typowania w TypeScript i pisania testów E2E.