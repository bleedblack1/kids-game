# Kalqy Demo

A modern web application built with [TanStack Start](https://tanstack.com/router/latest/docs/start/overview), React, TypeScript, Tailwind CSS, and Supabase.

## Setup & Installation

This project is configured to use [Bun](https://bun.sh) as the primary package manager.

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Environment Variables**:
   Ensure you have a `.env` file in the root directory with the correct Supabase configuration. A template is shown below:
   ```env
   SUPABASE_PROJECT_ID="djjfglwvueyqiryahpsw"
   SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
   SUPABASE_URL="https://djjfglwvueyqiryahpsw.supabase.co"
   VITE_SUPABASE_PROJECT_ID="djjfglwvueyqiryahpsw"
   VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
   VITE_SUPABASE_URL="https://djjfglwvueyqiryahpsw.supabase.co"
   ```

## Development & Build Scripts

- **Start Development Server**:
   ```bash
   bun run dev
   ```
   Runs the dev server locally.

- **Build for Production**:
   ```bash
   bun run build
   ```
   Compiles and builds the application.

- **Preview Production Build**:
   ```bash
   bun run preview
   ```
   Locally previews the production build.

- **Linting & Formatting**:
   ```bash
   bun run lint
   bun run format
   ```
