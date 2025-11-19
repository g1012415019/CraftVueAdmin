# Technology Stack

## Core Technologies

- **Vue 3.5+** with Composition API
- **TypeScript 4.9+** for type safety
- **Vite 5.4+** as build tool and dev server
- **Naive UI 2.42+** as primary UI component library
- **Pinia 2.3+** for state management
- **Vue Router 4.5+** for routing

## Key Libraries

- **@vueuse/core** - Vue composition utilities
- **lodash-es** - Utility functions (prefer ES modules)
- **alova** - HTTP client with mock support
- **echarts** - Data visualization
- **date-fns/dayjs** - Date manipulation
- **vuedraggable** - Drag and drop functionality

## Development Tools

- **ESLint** with Vue 3 and TypeScript rules
- **Prettier** for code formatting
- **Stylelint** for CSS/SCSS linting
- **Husky** for git hooks
- **Commitizen** for conventional commits

## Build Configuration

- **Vite** with custom plugin setup
- **Less** preprocessor for styling
- **Tailwind CSS** for utility classes
- **Auto-imports** for Vue APIs and components
- **Manual chunk splitting** for optimal bundle sizes

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm serve                  # Alias for dev

# Building
pnpm build                  # Production build
pnpm build:no-cache         # Clean build without cache
pnpm preview                # Preview production build

# Code Quality
pnpm lint:eslint            # Lint JS/TS/Vue files
pnpm lint:prettier          # Format code
pnpm lint:stylelint         # Lint styles

# Maintenance
pnpm clean:cache            # Clear build cache
pnpm clean:lib              # Remove node_modules
```

## Package Manager

Use **pnpm** exclusively - the project is configured for pnpm with lock file and scripts.