# Vueend - HakimyarFusion Frontend

Vue 3 + Vite + Vuetify frontend for the HakimyarFusion Learning Management System (LMS). Provides admin and instructor interfaces with full localization support.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates.

However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can run `Volar: Switch TS Plugin on/off` from VS Code command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Features

- **Multi-language Support**: Persian (default) and English with vue-i18n
- **Auto-redirect Landing Page**: Logged-in users automatically redirected to role-specific dashboards
- **Material Design 3**: Built with Vuetify 3 components
- **Role-based Access**: Separate dashboards for admin, instructor, and student roles
- **JWT Authentication**: Secure token-based authentication stored in cookies
- **Dark/Light Theme**: Theme switcher integrated in navbar
- **RTL Support**: Automatic RTL layout for Persian language

## Project Setup

```sh
npm install
```

### Environment Configuration

Create `.env.development.local` for local development:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

For production, create `.env.production`:

```env
VITE_API_BASE_URL=https://api.ithdp.ir/api
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

Visit `http://localhost:5173` - you'll see the landing page if not logged in, or be redirected to your dashboard if authenticated.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Other Commands

```sh
npm run lint              # ESLint + auto-fix
npm run typecheck        # TypeScript type checking
npm run test:e2e         # Playwright E2E tests
npm run build:icons      # Rebuild Iconify icon set
```

## Architecture

- **Pages**: File-based routing via `unplugin-vue-router` (in `src/pages/`)
- **Components**: Reusable components in `src/components/` and `src/views/`
- **Layouts**: Page layouts in `src/layouts/`
- **i18n**: Translation files in `src/plugins/i18n/locales/`
- **State**: Pinia stores for global state management
- **API**: Axios/ofetch utilities in `src/utils/`

## Landing Page

- **Route**: `/` (public, no authentication required)
- **Component**: `src/pages/index.vue`
- **Auto-redirect**: Authenticated users are automatically redirected to:
  - Admin: `/dashboards/lms-admin`
  - Instructor: `/dashboards/lms-instructor`
  - Student: `/dashboards/academy`
- **Sections**: Hero, Features, Team, Pricing, FAQ, Contact
- **Localization**: All content fully translated to Persian and English

## Localization

### Using Translations

```vue
<script setup>
const { t } = useI18n()
</script>

<template>
  <h1>{{ t('landingPage.title') }}</h1>
</template>
```

### Adding Translations

1. Add keys to `src/plugins/i18n/locales/en.json` and `fa.json`
2. Use nested structure: `"feature": { "title": "Title" }`
3. Reference in templates: `{{ t('feature.title') }}`

### Language Selector

Located in navbar beside theme switcher. Language preference persists via cookies.

## Authentication

- **Login**: `/login` - Phone number + password authentication
- **Storage**: JWT token and user data stored in httpOnly cookies
- **Router Guards**: Protected routes require valid token (in `src/plugins/1.router/guards.ts`)
- **API Integration**: Automatic token injection via Axios interceptors

## Documentation

For comprehensive documentation including backend API, deployment guides, troubleshooting, and development workflows, see:

- **Main Documentation**: `/CLAUDE.md` (root of repository)
- **Backend API**: `/laraend/laraend.md`
- **Database Setup**: `/laraend/DATABASE-SETUP.md`
- **Deployment Guide**: `/vueend/VPS-SETUP-INSTRUCTIONS.md`

## Technology Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite 5
- **UI Library**: Vuetify 3 (Material Design 3)
- **State Management**: Pinia
- **Internationalization**: vue-i18n
- **Routing**: unplugin-vue-router (file-based)
- **HTTP Client**: Axios / ofetch
- **Charts**: ApexCharts
- **Editor**: Tiptap
