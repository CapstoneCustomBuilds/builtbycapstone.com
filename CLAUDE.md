# Capstone Custom Builds — builtbycapstone.com

## Project Overview
Marketing website for Capstone Custom Builds, a custom construction company.
Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React 19.
Deployed on Vercel — every push to `main` triggers a production deploy.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans + Geist Mono (via next/font)
- **Deployment**: Vercel (auto-deploy on push to main)

## Development
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Conventions
- Use the `app/` directory (App Router, not Pages Router)
- Path alias: `@/*` maps to project root
- Prefer Tailwind utility classes over custom CSS
- Components go in `components/` at project root
- Keep pages/layouts in `app/`
- Use semantic HTML for accessibility and SEO
- Mobile-first responsive design

## Git Workflow
- Feature branches for new work
- PRs to `main` for review (Vercel creates preview deploys on PRs)
- Merge to `main` = production deploy
