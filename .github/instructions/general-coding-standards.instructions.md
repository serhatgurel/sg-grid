---
applyTo: "**"
---
# Project General Coding Standards

This document outlines the high-level software engineering principles and general guidelines that apply to all code in this project.

## Guiding Principles

### SOLID Principles

We strive to apply the SOLID principles to create maintainable, scalable, and testable components and services:

*   **Single Responsibility Principle (SRP)**: Each component, composable, or module should have one primary responsibility.
*   **Open/Closed Principle (OCP)**: Entities should be open for extension (e.g., via props or slots) but closed for modification.
*   **Interface Segregation Principle (ISP)**: Avoid creating "fat" components with an excessive number of props. Break down logic into smaller, focused composables.
*   **Dependency Inversion Principle (DIP)**: High-level modules should depend on abstractions, not concrete implementations.

### DRY (Don't Repeat Yourself)

*   Avoid duplicating code. Encapsulate reusable logic in composable functions and create generic, reusable UI components.

### KISS (Keep It Simple, Stupid)

*   Favor simple, straightforward solutions over overly complex ones. Write code that is easy to read and understand.

## Naming Conventions

*   **Components**: Use `PascalCase` for single-file component filenames (e.g., `MyComponent.vue`).
*   **Variables & Functions**: Use `camelCase` for variables, functions, and methods.
*   **Composable Functions**: Prefix with `use` (e.g., `useUserData`).
*   **Interfaces & Type Aliases**: Use `PascalCase` (e.g., `interface UserProfile`).
*   **Constants**: Use `ALL_CAPS` for constant values that are truly immutable (e.g., `const API_BASE_URL`).

## Error Handling

*   **Asynchronous Operations**: Use `try/catch` blocks within `async` functions for handling promise-based operations.
*   **Component-Level Errors**: Use the `onErrorCaptured` lifecycle hook to create error boundaries.
*   **Global Errors**: Implement a global error handler using `app.config.errorHandler` in `main.ts`.
*   **Logging**: Log all caught errors with meaningful contextual information.

## Testing

The goal of testing is to ensure correctness and prevent regressions.

*   **Unit Testing**: Use Vitest for composables and utility functions.
*   **Component Testing**: Use `@vue/test-utils` with Vitest to test component behavior and interactions.
*   **End-to-End (E2E) Testing**: Use Cypress for testing user flows.
*   **Best Practices**: Test behavior, not implementation. Keep tests simple, focused, and mock dependencies appropriately.