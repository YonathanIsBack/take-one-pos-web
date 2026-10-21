# Take One POS Web

Point of Sale web application built with React 19, TypeScript, and MUI v9.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=https://your-api-url.com
VITE_BASE_PATH=/
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for the API | empty string (relative URLs) |
| `VITE_BASE_PATH` | Base path for the app | `/` |

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

To override env variables at build time:

```powershell
$env:VITE_API_URL="https://your-api-url.com"; $env:VITE_BASE_PATH="/pos/"; npm run build
```

Or on bash:

```bash
VITE_API_URL=https://your-api-url.com VITE_BASE_PATH=/pos/ npm run build
```

## Preview Production Build

```bash
npm run preview
```
