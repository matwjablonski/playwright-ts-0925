# Test Data Examples

## 📊 Sample Test Data

### **High Priority Tasks**
```json
{
  "task": "Napraw krytyczny błąd w produkcji",
  "description": "System płatności nie działa od godziny. Użytkownicy nie mogą dokonać zakupów. Priorytet krytyczny!",
  "priority": 1,
  "due_date": "2024-01-15"
}
```

### **Medium Priority Tasks**  
```json
{
  "task": "Zaktualizuj dokumentację API",
  "description": "Dokumentacja API jest nieaktualna od ostatniego release'u. Trzeba dodać nowe endpointy i zaktualizować przykłady.",
  "priority": 2,
  "due_date": "2024-01-20"
}
```

### **Low Priority Tasks**
```json
{
  "task": "Uporządkuj pliki w folderze Downloads",
  "description": "Folder Downloads jest bardzo zagracony. Warto by było go oczyścić i zorganizować pliki w odpowiednie foldery.",
  "priority": 3,
  "due_date": null
}
```

### **Overdue Tasks**
```json
{
  "task": "Przygotuj prezentację kwartalną",
  "description": "Prezentacja z wynikami Q4 dla zarządu. Musi zawierać analizę sprzedaży i prognozy na Q1.",
  "priority": 1,
  "due_date": "2024-01-01",
  "created_at": "2023-12-15T10:00:00Z"
}
```

## 🧪 Test Scenarios Data

### **Form Validation Tests**
```javascript
const invalidTodos = [
  {
    task: "", // Too short
    description: "Valid description here",
    expectedError: "Tytuł zadania musi mieć co najmniej 3 znaki"
  },
  {
    task: "Valid task",
    description: "Short", // Too short  
    expectedError: "Opis zadania musi mieć co najmniej 10 znaków"
  },
  {
    task: "Valid task",
    description: "Valid description here",
    due_date: "2023-01-01", // Past date
    expectedError: "Termin wykonania nie może być wcześniejszy niż dzisiaj"
  }
];
```

### **Edge Cases**
```javascript
const edgeCases = [
  {
    name: "Very long task title",
    task: "A".repeat(500),
    description: "This is a very long task title to test UI handling"
  },
  {
    name: "Special characters",
    task: "Task with émojis 🚀 and spëciål çhars!",
    description: "Testing unicode support in títles and descriptions with émojis 💯"
  },
  {
    name: "HTML injection attempt",
    task: "<script>alert('xss')</script>",
    description: "<img src='x' onerror='alert(1)'>"
  },
  {
    name: "Very far future date",
    task: "Future task", 
    description: "Task scheduled very far in the future",
    due_date: "2099-12-31"
  }
];
```

### **Bulk Operations Test Data**
```javascript
const bulkTestData = [
  { task: "Task 1", description: "First task for bulk testing", priority: 1 },
  { task: "Task 2", description: "Second task for bulk testing", priority: 2 },  
  { task: "Task 3", description: "Third task for bulk testing", priority: 3 },
  { task: "Task 4", description: "Fourth task for bulk testing", priority: 1 },
  { task: "Task 5", description: "Fifth task for bulk testing", priority: 2 }
];
```

### **Search and Filter Test Cases**
```javascript
const searchTestCases = [
  {
    query: "krytyczny",
    expectedResults: ["Napraw krytyczny błąd w produkcji"]
  },
  {
    query: "API", 
    expectedResults: ["Zaktualizuj dokumentację API"]
  },
  {
    query: "CASE INSENSITIVE",
    expectedResults: [] // Should find nothing  
  },
  {
    query: "case insensitive",
    expectedResults: [] // Should still find nothing
  },
  {
    query: "",
    expectedResults: "all" // Empty search should show all
  }
];
```

## 🎯 Performance Test Data

### **Large Dataset**
```javascript
const generateLargeTodoDataset = (count = 1000) => {
  const priorities = [1, 2, 3];
  const taskTemplates = [
    "Przejrzyj dokumentację",
    "Zaktualizuj kod",
    "Przetestuj funkcjonalność", 
    "Napraw błąd w",
    "Zaimplementuj feature"
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    task: `${taskTemplates[i % taskTemplates.length]} #${i + 1}`,
    description: `Automatycznie wygenerowany opis zadania numer ${i + 1}. To jest dłuższy tekst opisujący szczegóły zadania.`,
    priority: priorities[i % priorities.length],
    done: Math.random() > 0.7, // 30% chance of being done
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null
  }));
};
```

## 📱 Mobile Test Data

### **Touch Interactions**
```javascript
const mobileTestScenarios = [
  {
    name: "Add todo on mobile",
    viewport: { width: 375, height: 667 }, // iPhone SE
    actions: ["tap form fields", "use virtual keyboard", "submit form"]
  },
  {
    name: "Filter todos on tablet", 
    viewport: { width: 768, height: 1024 }, // iPad
    actions: ["tap filter buttons", "use dropdown selectors", "verify responsive grid"]
  }
];
```

## 🔄 State Management Test Data

### **LocalStorage Scenarios**
```javascript
const storageTestCases = [
  {
    name: "Fresh install",
    initialState: null, // No localStorage data
    expectedBehavior: "Load from data.json"
  },
  {
    name: "Existing data",
    initialState: { todos: [/* existing todos */] },
    expectedBehavior: "Use localStorage data, ignore JSON"
  },
  {
    name: "Corrupted localStorage",
    initialState: "invalid json",
    expectedBehavior: "Fallback to data.json"
  }
];
```

## 🎨 Visual Regression Test Data

### **UI States to Capture**
```javascript
const visualTestCases = [
  "empty-state", // No todos
  "loading-state", // During data fetch
  "error-state", // When validation fails
  "full-list", // With many todos
  "filtered-view", // Applied filters
  "mobile-view", // Responsive layout
  "high-contrast", // Accessibility mode
  "dark-mode" // If implemented
];
```