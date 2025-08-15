# Async Tracing

A TypeScript monorepo using pnpm workspaces for async tracing functionality.

## Project Structure

```console
async-tracing/
├── packages/           # Shared packages and libraries
├── package.json        # Root package.json with workspace scripts
├── pnpm-workspace.yaml # Workspace configuration
├── tsconfig.json       # Root TypeScript configuration
├── eslint.config.ts    # ESLint configuration
├── tsconfig.base.json  # Base tsconfig.json file for all packages
```

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Available scripts:
- `pnpm build` - Build all packages
- `pnpm lint` - Run ESLint on all TypeScript files
- `pnpm test` - Run tests for all packages
- `pnpm clean` - Clean build outputs

## Adding New Packages

To add a new package to the monorepo:

1. Create a new directory in `packages/`
2. Initialize with `package.json`
3. Add TypeScript configuration if needed
4. The package will automatically be included in the workspace

## Development

This project uses:

- **TypeScript** for type safety
- **ESLint** for code linting
- **pnpm workspaces** for monorepo management
