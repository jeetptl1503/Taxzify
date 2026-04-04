# Taxzify

> Financial Opportunity Discovery & Benefit-Optimization Platform for Indian Taxpayers

Taxzify helps Indian taxpayers discover government rebates, deductions, exemptions, subsidies, and schemes they qualify for but don't know about.

---

## Prerequisites

- **Node.js** (v18+ recommended) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** — [Download here](https://git-scm.com/downloads)

---

## Getting Started

### 1. Clone or Download the Project

```bash
git clone https://github.com/YOUR_USERNAME/taxzify.git
cd taxzify
```

Or download the ZIP and extract it.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Taxzify landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taxzify.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in with GitHub
2. Click **"Add New Project"**
3. Select your `taxzify` repository from the list
4. Vercel will auto-detect Next.js — leave all settings as default
5. Click **"Deploy"**
6. Your site will be live at `https://taxzify.vercel.app` (or a custom domain)

### 3. Custom Domain (Optional)

1. In your Vercel project dashboard, go to **Settings → Domains**
2. Add your custom domain (e.g., `taxzify.com`)
3. Follow Vercel's instructions to update your DNS records

---

## Configuration

### Update Formspree ID

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form and copy the form ID (looks like `xrgvqwpz`)
3. Open `components/FooterCTA.jsx`
4. Replace `YOUR_FORM_ID` in the form action URL:
   ```
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```

### Change Colors

Edit `tailwind.config.js` and modify the color tokens under `theme.extend.colors`:

```js
colors: {
  accent: '#0A84FF',      // Change the accent color
  light: { ... },          // Light mode colors
  dark: { ... },           // Dark mode colors
}
```

### Add Favicon

Replace the `public/favicon.ico` file with your own favicon. You can generate one at [favicon.io](https://favicon.io/).

---

## Tech Stack

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| Next.js 14     | React framework (App Router) |
| Tailwind CSS 3 | Utility-first styling      |
| Framer Motion  | Animations                 |
| Lucide React   | Icons                      |
| next-themes    | Dark/Light mode toggle     |
| Formspree      | Waitlist form backend      |

---

## Project Structure

```
taxzify/
├── app/
│   ├── globals.css        # Global styles & Tailwind imports
│   ├── layout.js          # Root layout with ThemeProvider
│   ├── page.js            # Main landing page
│   └── theme-provider.js  # Client-side theme wrapper
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── ProblemSection.jsx
│   ├── FeaturesGrid.jsx
│   ├── HowItWorks.jsx
│   ├── BenefitShowcase.jsx
│   ├── RegimeComparison.jsx
│   ├── SecuritySection.jsx
│   ├── Roadmap.jsx
│   ├── FooterCTA.jsx
│   └── ThemeToggle.jsx
├── public/
│   └── favicon.ico
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── package.json
└── README.md
```

---

## License

© 2025 Taxzify. All rights reserved.
