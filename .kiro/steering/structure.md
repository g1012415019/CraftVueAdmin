# Project Structure

## Root Organization

```
├── src/                    # Source code
├── build/                  # Build configuration
├── mock/                   # Mock data and APIs
├── public/                 # Static assets
├── types/                  # Global TypeScript definitions
└── docs/                   # Project documentation
```

## Source Code Structure (`src/`)

### Core Directories

- **`components/`** - Reusable Vue components
  - Follow PascalCase naming (e.g., `BasicForm.vue`)
  - Include `index.ts` for exports
  - Group related components in folders

- **`views/`** - Page-level components
  - Organized by feature/module
  - Use kebab-case for folders, PascalCase for files

- **`composables/`** - Vue composition functions
  - Prefix with `use` (e.g., `useTableData.ts`)
  - Return reactive state and methods

- **`utils/`** - Pure utility functions
  - Avoid Vue dependencies
  - Export individual functions

### Key Component Architecture

#### TableLowcode Component
```
src/components/TableLowcode/
├── TableLowcode.vue        # Main component
├── types/index.ts          # Type definitions
├── components/             # Sub-components
├── composables/            # Component-specific logic
├── filters/                # Filter components
├── utils/                  # Utility functions
└── Config/                 # Configuration panels
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `DataTable.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useTableData.ts`)
- **Utils**: camelCase (e.g., `configMapper.ts`)
- **Types**: camelCase (e.g., `index.ts`)
- **Folders**: PascalCase for components, camelCase for others

### Import Patterns

```typescript
// Vue imports first
import { ref, computed } from 'vue'

// Third-party libraries
import { cloneDeep } from 'lodash-es'

// Local components
import DataTable from './DataTable.vue'

// Composables and utils
import { useTableData } from '@/composables/useTableData'

// Types (last)
import type { TableConfig } from './types'
```

### State Management

- **Pinia stores** in `src/store/modules/`
- Use composition API style
- Prefix store files with purpose (e.g., `tableConfig.ts`)

### Styling Approach

- **SCSS** for component styles with scoped styling
- **Tailwind** for utility classes
- **Less** for global styles
- Use CSS custom properties for theming

### Path Aliases

- `@/` → `src/`
- `/#/` → `types/`

### Component Organization Rules

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use composables for shared logic
3. **Props/Emits**: Always define TypeScript interfaces
4. **Dependency Injection**: Use provide/inject for deep component trees
5. **Ref Exposure**: Use `defineExpose` for parent component access