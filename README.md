# FixMate

**Repairs you can track, payments you can trust.**

FixMate is a repair service platform for Dhaka. Customers find verified technicians for phones, laptops, ACs, fridges, TVs, washing machines and electrical work, send a repair request, follow the job step by step, and pay online only after it is done. Technicians manage their listings and jobs, and admins keep the marketplace safe.

- **Live site:** `https://<your-client>.vercel.app` (add after deploy)
- **API:** see the `fixmate-server` repository

## Test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fixmate.test` | `Admin@123` |
| Technician | `rafiq@fixmate.test` | `Tech@123` |
| Technician | `nusrat@fixmate.test` | `Tech@123` |
| Technician | `tanvir@fixmate.test` | `Tech@123` |
| Customer | `nadia@fixmate.test` | `Customer@123` |
| Customer | `karim@fixmate.test` | `Customer@123` |
| Customer | `farhana@fixmate.test` | `Customer@123` |

To try a payment, use Stripe's test card `4242 4242 4242 4242` with any future expiry date and any CVC.

## Key features

**For everyone**
- Home page with search, featured services, categories, how it works and testimonials.
- Browse services with search, category and mode filters, sorting and pagination. Filters live in the URL, so reloading or sharing a link keeps them.
- Service details with the technician's profile, ratings and customer reviews.
- Light and dark mode, and a layout tuned for mobile, tablet and desktop.

**Customers**
- Send a repair request with a preferred date, address and problem description.
- Track every booking with a timeline: requested, accepted, in progress, completed, paid.
- Cancel a request before it is accepted.
- Pay for completed jobs through Stripe Checkout. Reloading the success page never charges or records twice.
- Rate and review paid jobs, and see payment history and spending charts.

**Technicians**
- Add services with an image upload (ImgBB). New and edited services wait for admin approval.
- Edit, delete and show or hide services.
- Accept or reject requests, start work and complete jobs with a final amount.
- Overview with new requests, job and earnings charts.

**Admins**
- Approve, reject or unpublish services.
- Change user roles (but never their own).
- Watch all bookings and transactions, with platform charts and total revenue.

**Under the hood**
- Sessions come from BetterAuth. Dashboard routes are guarded twice: a fast cookie check in `proxy.ts`, then a real session and role check on the server. Reloading any page keeps you signed in.
- Dashboard pages load their data on the server, so there is no loading flicker.
- Profile changes update the navbar and dashboard right away, without signing out.

## Tech stack

Next.js 16 (App Router) with React 19 and TypeScript, Tailwind CSS 4, shadcn/ui, BetterAuth on MongoDB, Recharts for charts, sonner for toasts and axios for API calls.

## Getting started

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run dev                  # http://localhost:3000
```

The API (`fixmate-server`) must be running too, on the URL set in `NEXT_PUBLIC_API_URL`.

### Environment variables

| Variable | Purpose |
|---|---|
| `CS_MONGODB_URI` | MongoDB connection string (same database as the server) |
| `CS_DB_NAME` | Database name, e.g. `fixmate` |
| `BETTER_AUTH_SECRET` | Long random secret for BetterAuth (different from `CS_JWT_SECRET`) |
| `BETTER_AUTH_URL` | This app's URL, e.g. `http://localhost:3000` |
| `CS_JWT_SECRET` | Must match `CS_JWT_SECRET` on the server |
| `NEXT_PUBLIC_API_URL` | API base URL without `/api`, e.g. `http://localhost:5000` |
| `CS_GOOGLE_CLIENT_ID`, `CS_GOOGLE_CLIENT_SECRET` | Optional. The Google button appears only when both are set |

Never commit `.env.local`; only `.env.example` is tracked.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run seed:users` | Create the test accounts above through BetterAuth. It prints the target database first and is safe to run again |

For demo services, bookings and payments, run `npm run seed:data` in `fixmate-server` after `seed:users`.

## Deploying to Vercel

1. Import the repository in Vercel (framework preset: Next.js).
2. Add the variables above with production values. Set `BETTER_AUTH_URL` to the deployed URL and `NEXT_PUBLIC_API_URL` to the deployed API.
3. On the server, add this site's URL to `CS_CLIENT_URL` and `CS_CORS_ORIGINS`, then redeploy it.
4. If you use Google login, add `https://<your-client>.vercel.app/api/auth/callback/google` as an authorized redirect URI in Google Cloud.

## npm packages

| Package | Use |
|---|---|
| `next`, `react`, `react-dom` | App framework |
| `better-auth`, `mongodb` | Authentication and sessions stored in MongoDB |
| `jsonwebtoken` | Signing the short-lived token sent to the API |
| `axios` | API calls from the browser, with the token added automatically |
| `tailwindcss`, `@tailwindcss/turbopack`, `tw-animate-css` | Styling |
| `shadcn`, `radix-ui`, `class-variance-authority`, `cn` | UI components (dialogs, menus, switches, sheets) |
| `lucide-react` | Icons |
| `recharts` | Dashboard charts |
| `sonner` | Toast messages |
| `next-themes` | Light and dark mode |
| `babel-plugin-react-compiler` | React Compiler |
| `typescript`, `eslint`, `eslint-config-next`, `tsx` | Type checking, linting and the seed script |
