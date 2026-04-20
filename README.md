# BiyondBytes

A modern, full-stack editorial blogging platform built with Next.js 14. BiyondBytes lets writers publish articles, readers discover content by tags and search, and everyone engage through comments, likes, and bookmarks — all wrapped in a clean, editorial-style UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB via Prisma ORM |
| Auth | NextAuth.js v5 (Google OAuth) |
| Editor | Tiptap (rich text) |
| File Uploads | UploadThing |
| Push Notifications | Firebase Cloud Messaging |
| State Management | Redux Toolkit |
| Animations | GSAP, Lenis smooth scroll |

---

## Features

- **Rich text editor** — Tiptap-powered editor with image, table, YouTube embed, link, and code block support
- **Authentication** — Google OAuth via NextAuth.js with role-based access (Admin / Writer / User)
- **Search** — Full-text search by keyword and tag filtering
- **Tags** — Browsable tag directory organized by topic
- **Comments** — Nested comment threads with likes and replies
- **Bookmarks** — Save articles to your personal reading list
- **Likes** — Like articles and comments
- **Follow system** — Follow writers and get notified of new posts
- **Push notifications** — Firebase-powered browser push notifications
- **SEO** — Per-post meta title, meta description, Open Graph image, sitemap, and JSON-LD structured data
- **Admin dashboard** — Manage blogs, comments, tags, and suspend writers
- **Settings** — Profile editing, connected accounts, notification preferences
- **Responsive** — Mobile-first design across all pages

---

## Project Structure

```
src/
├── app/
│   ├── (editor)/write/[operation]   # Create / edit post page
│   ├── (pages)/
│   │   ├── post/[slug]              # Article detail page
│   │   ├── search/                  # Search page
│   │   ├── tags/                    # Tag browser
│   │   ├── settings/                # User settings
│   │   ├── profile/dashboard/       # Author profile
│   │   └── ...
│   ├── api/                         # Route handlers (blog, auth, user, tags…)
│   └── page.tsx                     # Homepage
├── components/
│   ├── (cards)/MainCard             # Blog card component
│   ├── layoutComponents/
│   │   ├── HeroSection              # Animated hero
│   │   ├── Navbar                   # Top navigation
│   │   └── EditorsPick              # Featured articles section
│   ├── Pagination/                  # Prev / Next pagination
│   └── SearchBar/                   # Search input
├── lib/                             # Auth helpers, utilities
├── redux/                           # Redux store and slices
└── prisma/
    └── schema.prisma                # MongoDB data models
```

---

## Data Models

- **User** — name, email, image, bio, username, role (ADMIN / WRITER / USER)
- **Blog** — title, slug, content, image, tags, readTime, likes, comments, bookmarks
- **Comment** — nested (parent/child), likes, replies
- **Tags** — grouped tag categories with multiple values
- **Follows** — follower / following relationships
- **bookmarks**, **Like**, **notifications**, **PushNotificationToken**

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (Atlas or local)
- Google OAuth credentials
- UploadThing account
- Firebase project (for push notifications)

### Installation

```bash
git clone https://github.com/your-username/biyondbytes.git
cd biyondbytes
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Database
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/biyondbytes"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<your-secret>"

# Google OAuth
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"

# UploadThing
UPLOADTHING_SECRET="<your-uploadthing-secret>"
UPLOADTHING_APP_ID="<your-uploadthing-app-id>"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="<key>"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<domain>"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="<project-id>"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="<sender-id>"
NEXT_PUBLIC_FIREBASE_APP_ID="<app-id>"

# App
BASE_URL="http://localhost:3000"
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

The project is optimized for deployment on **Vercel**.

1. Push your repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy

---

## License

MIT
