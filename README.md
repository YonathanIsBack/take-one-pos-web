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
```

If not set, requests will use relative URLs.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

To override the API URL at build time:

```powershell
$env:VITE_API_URL="https://your-api-url.com"; npm run build
```

Or on bash:

```bash
VITE_API_URL=https://your-api-url.com npm run build
```

## Preview Production Build

```bash
npm run preview
```
