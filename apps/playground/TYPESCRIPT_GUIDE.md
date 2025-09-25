# TypeScript Migration Guide

## 📋 Typy interfejsów do zaimplementowania

### **Todo Interface**
```typescript
interface Todo {
  id: number;
  task: string;
  description: string;
  done: boolean;
  priority: Priority;
  created_at: string;
  due_date?: string;
}

enum Priority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3
}
```

### **Filter Options**
```typescript
interface FilterOptions {
  status: FilterStatus;
  search: string;
  priority: Priority | 'all';
}

type FilterStatus = 'all' | 'active' | 'completed' | 'overdue';
```

### **Stats Interface**  
```typescript
interface TodoStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  completionPercentage: number;
}
```

### **Component Types**
```typescript
abstract class Component<TProps = {}> {
  protected props: TProps;
  protected services?: Services;
  
  abstract render(): HTMLElement;
  
  rerender(): void;
  subscribeStore<T>(key: string, callback?: (data: T) => void): void;
}
```

### **Service Types**
```typescript
interface Services {
  DataStoreService: DataStoreService;
  TodosService: TodosService;
}

interface DataStoreService {
  get<T>(key: string): T[];
  set<T>(key: string, value: T[]): void;
  add<T>(key: string, item: T): void;
  subscribe(key: string, callback: (data: any) => void): void;
}
```

### **Form Validation**
```typescript
interface FormErrors {
  [fieldName: string]: string | null;
}

interface TodoFormData {
  task?: string;
  description?: string;
  priority?: Priority;
  due_date?: string;
}

type ValidationResult = {
  isValid: boolean;
  errors: FormErrors;
};
```

## 🎯 Zadania do wykonania

### **Etap 1: Podstawowe typy**
- [ ] Dodać `Todo` interface
- [ ] Dodać `Priority` enum
- [ ] Wytypowaać `TodosService` metody

### **Etap 2: Komponenty**  
- [ ] Przekonwertować `Component` na generyczną klasę
- [ ] Dodać typy props dla każdego komponentu
- [ ] Wytypowaać event handlery

### **Etap 3: Walidacja i formularze**
- [ ] Dodać typy dla walidacji formularzy
- [ ] Stworzyć type guards dla danych
- [ ] Dodać utility types

### **Etap 4: Zaawansowane**
- [ ] Conditional types dla filtrów
- [ ] Mapped types dla bulk operations  
- [ ] Template literal types dla DOM selektorów

## 🧪 Playwright Test Types

```typescript
// Page Object Model
class TodoPage {
  constructor(private page: Page) {}
  
  async addTodo(todo: Partial<Todo>): Promise<void> {
    // Implementation
  }
  
  async filterBy(options: FilterOptions): Promise<Todo[]> {
    // Implementation  
  }
  
  async bulkSelectAll(): Promise<void> {
    // Implementation
  }
}

// Test fixtures
interface TodoFixtures {
  todoPage: TodoPage;
  sampleTodos: Todo[];
}
```

## ⚡ Migration Tips

1. **Zacznij od typów danych** - Todo, Priority, FilterStatus
2. **Następnie serwisy** - TodosService z metodami CRUD  
3. **Potem komponenty** - jeden po drugim z propsami
4. **Na koniec testy** - Page Object Model z typami

## 🔧 TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```