# DataPeCharcha Recommends

<div align="center">

**A premium, modern web application for discovering and exploring curated technical resources**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-ff69b4?style=flat-square&logo=framer)](https://www.framer.com/motion/)

[Live Demo](https://dpc-recommends.vercel.app/) • [Report Bug](mailto:mahaprasad003@gmail.com)

</div>

---

## 📖 Overview

**DPC Recommends** is a production-ready, full-stack web application designed to showcase a curated library of 300+ high-quality technical resources. Built with modern web technologies, it features a polished user experience with advanced search capabilities, intelligent filtering, and premium animations—all optimized for performance and accessibility.

The platform offers both **authenticated access** for full functionality and a **sneak peek mode** for unauthenticated visitors, encouraging user engagement while maintaining content value.

### 🎯 What Makes This Project Special

- **Premium UI/UX**: Smooth framer-motion animations, interactive parallax effects, and micro-interactions
- **Advanced Search**: Global search with keyboard shortcuts (⌘K), fuzzy matching across multiple fields
- **Smart Authentication**: Seamless Supabase authentication with protected routes and sneak peek content
- **Performance Optimized**: React Query caching, optimized database queries, lazy loading, and GPU-accelerated animations
- **Production Ready**: Comprehensive error handling, security headers, RLS policies, and accessibility features
- **Developer Experience**: Full TypeScript coverage, reusable components, extensive documentation

---

## ✨ Key Features

### 🔐 Authentication & Access Control
- **Email/Password Authentication** powered by Supabase Auth
- **Sneak Peek Mode** for unauthenticated users (limited preview content)
- **Protected Routes** with automatic redirects
- **Session Management** with persistent login state
- **Newsletter Integration** for user engagement

### 🔍 Search & Discovery
- **Global Search Modal** with keyboard shortcuts (⌘K / Ctrl+K)
- **Multi-field Search**: Title, author, source, publisher, topics, and key takeaways
- **Real-time Results** with debounced input
- **Search Highlighting** in results

### 🎛️ Filtering & Sorting
- **Multi-select Filters**: Topics, difficulty, content type, categories, and subcategories
- **Dynamic Filter Options** populated from database
- **Active Filter Badges** with one-click removal
- **Multiple Sort Options**: Date added, rating, title, difficulty
- **Sort Direction Toggle**: Ascending/descending

### 🎨 Premium UI/UX
- **Framer Motion Animations**: Page transitions, card reveals, button interactions
- **Interactive Parallax** on hero section (mouse-tracking)
- **Smooth Transitions**: 60fps GPU-accelerated animations
- **Dark/Light Mode** with system preference detection
- **Responsive Design**: Mobile-first, touch-optimized
- **Accessibility**: Reduced motion support, ARIA labels, keyboard navigation

### ⚡ Performance
- **React Query**: Smart caching, background refetching, stale-while-revalidate
- **Optimized Images**: Next.js image optimization
- **Database Indexing**: Fast queries with GIN and B-tree indexes
- **Code Splitting**: Automatic route-based splitting
- **Edge-Ready**: Deployable to Vercel Edge Network

### 🔒 Security
- **Row Level Security (RLS)**: Database-level access control
- **Input Sanitization**: XSS protection on all user inputs
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Environment Variables**: Secure credential management
- **Public Read-Only**: Controlled data exposure

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router, SSR, and API routes | 14.0+ |
| **React** | UI component library | 18.2+ |
| **TypeScript** | Type-safe development | 5.3+ |
| **Tailwind CSS** | Utility-first styling framework | 3.4+ |
| **Framer Motion** | Production-ready animation library | 12.23+ |
| **Lucide React** | Beautiful icon set | 0.303+ |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database, authentication, and real-time subscriptions |
| **@supabase/supabase-js** | Official Supabase JavaScript client |
| **Row Level Security** | Database-level authorization |

### State Management & Data Fetching
| Technology | Purpose |
|------------|---------|
| **TanStack Query (React Query)** | Async state management, caching, and synchronization |
| **Custom Hooks** | Reusable data fetching logic |

### Utilities & Validation
| Technology | Purpose |
|------------|---------|
| **Zod** | Runtime type validation |
| **date-fns** | Modern date manipulation |
| **clsx** | Conditional className composition |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code quality and consistency |
| **PostCSS** | CSS transformations |
| **Autoprefixer** | CSS vendor prefixing |
| **tsx** | TypeScript execution for scripts |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Supabase Account** (free tier available)

### Quick Setup

> **Already have a database?** Skip to [QUICK_START.md](./QUICK_START.md)

#### 1. Clone the Repository

```bash
git clone https://github.com/Mahaprasad003/DPC-Recommends.git
cd DPC-Recommends
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Environment Configuration

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> 💡 Find these in your Supabase project: **Settings** → **API**

#### 4. Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create technical_content table
CREATE TABLE technical_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  author TEXT,
  source TEXT,
  topics TEXT[],
  tag_categories TEXT[],
  tag_subcategories TEXT[],
  difficulty TEXT,
  content_type TEXT,
  rating NUMERIC(3,2),
  key_takeaways TEXT[],
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  publisher TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE technical_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access (authenticated users only)
CREATE POLICY "Authenticated users can view all content"
  ON technical_content FOR SELECT
  TO authenticated
  USING (true);

-- Create sneak peek policy (unauthenticated users see limited content)
CREATE POLICY "Public can view sneak peek content"
  ON technical_content FOR SELECT
  TO anon
  USING (id IN (
    SELECT id FROM technical_content 
    ORDER BY date_added DESC 
    LIMIT 6
  ));

-- Performance indexes
CREATE INDEX idx_technical_content_title ON technical_content(title);
CREATE INDEX idx_technical_content_topics ON technical_content USING GIN(topics);
CREATE INDEX idx_technical_content_tag_categories ON technical_content USING GIN(tag_categories);
CREATE INDEX idx_technical_content_tag_subcategories ON technical_content USING GIN(tag_subcategories);
CREATE INDEX idx_technical_content_difficulty ON technical_content(difficulty);
CREATE INDEX idx_technical_content_content_type ON technical_content(content_type);
CREATE INDEX idx_technical_content_date_added ON technical_content(date_added DESC);
CREATE INDEX idx_technical_content_rating ON technical_content(rating DESC);
```

#### 5. Start Development Server

```bash
npm run dev
```

🎉 Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Architecture

---

## 📁 Project Architecture

```
dpc-recommends/
├── 📂 app/                          # Next.js App Router
│   ├── layout.tsx                   # Root layout with theme provider
│   ├── page.tsx                     # Homepage with search, filters, grid
│   ├── providers.tsx                # React Query provider
│   ├── globals.css                  # Global styles + animations
│   ├── actions/                     # Server actions
│   │   └── cache.ts                 # Revalidation actions
│   ├── api/                         # API routes
│   │   ├── resources/               # Fetch resources
│   │   ├── resource-options/        # Filter options
│   │   ├── sneak-peek/              # Unauthenticated preview
│   │   ├── verify/                  # DB verification
│   │   └── revalidate/              # Cache invalidation
│   └── auth/callback/               # Auth callback handler
│
├── 📂 components/
│   ├── ui/                          # Base UI components
│   │   ├── Button.tsx               # Button with variants
│   │   ├── Input.tsx                # Styled input field
│   │   ├── Card.tsx                 # Card container
│   │   ├── Badge.tsx                # Status badges
│   │   ├── Tag.tsx                  # Content tags
│   │   └── Select.tsx               # Dropdown select
│   │
│   ├── features/                    # Feature components
│   │   ├── ResourceCard.tsx         # Individual resource card
│   │   ├── CardGrid.tsx             # Grid layout with animations
│   │   ├── SearchBar.tsx            # Search with global modal
│   │   ├── FilterPanel.tsx          # Advanced filtering UI
│   │   ├── HeroSection.tsx          # Landing hero with parallax
│   │   └── GlobalSearch.tsx         # Keyboard-accessible search
│   │
│   ├── layout/                      # Layout components
│   │   ├── Header.tsx               # Navigation + auth
│   │   └── Footer.tsx               # Footer section
│   │
│   ├── auth/                        # Authentication components
│   │   └── LoginModal.tsx           # Sign in/up modal
│   │
│   └── admin/                       # Admin components
│       ├── AdminPanel.tsx           # Admin interface
│       └── AdminPanelWrapper.tsx    # Admin wrapper with checks
│
├── 📂 lib/
│   ├── supabase/                    # Supabase configuration
│   │   ├── client.ts                # Client-side Supabase
│   │   └── server.ts                # Server-side Supabase
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useResources.ts          # Resource fetching + caching
│   │   ├── useAuth.ts               # Authentication state
│   │   └── useSneakPeekContent.ts   # Sneak peek data
│   │
│   └── utils/                       # Utility functions
│       ├── animations.ts            # Framer Motion variants
│       ├── validation.ts            # Input validation
│       ├── sanitize.ts              # XSS protection
│       ├── format.ts                # Data formatting
│       ├── admin.ts                 # Admin utilities
│       └── cn.ts                    # Tailwind className merger
│
├── 📂 types/
│   └── database.ts                  # TypeScript types + interfaces
│
├── 📂 public/                       # Static assets
│   └── logo.png                     # Brand logo
│
├── 📂 scripts/                      # Utility scripts
│   └── verify-schema.ts             # Schema verification
│
└── 📄 Configuration Files
    ├── next.config.js               # Next.js config + security headers
    ├── tailwind.config.js           # Tailwind CSS config
    ├── tsconfig.json                # TypeScript config
    ├── postcss.config.js            # PostCSS plugins
    ├── package.json                 # Dependencies + scripts
    └── .env.local                   # Environment variables (create this)
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Deep blue for CTAs and accents
- **Secondary**: Muted gray for secondary actions
- **Muted**: Light backgrounds and borders
- **Accent**: Highlight colors for interactive elements
- **Destructive**: Error and warning states

### Typography
- **Font**: System font stack for optimal performance
- **Sizes**: Responsive scaling from mobile to desktop
- **Weights**: Regular (400) and Semibold (600)

### Components
All components follow a consistent API pattern with:
- **Variants**: Multiple visual styles
- **Sizes**: Small, medium, large
- **States**: Default, hover, active, disabled
- **Accessibility**: ARIA labels, keyboard navigation

---

## 🎭 Animation System

Premium animations powered by **Framer Motion**:

### Page Transitions
- Smooth fade-in/out on route changes
- Staggered content reveal
- Loading skeleton with shimmer effect

### Interactive Elements
- **Buttons**: Scale feedback on hover/tap
- **Cards**: Lift effect on hover with smooth shadow transition
- **Badges**: Pop-in animation with exit transitions
- **Filters**: Expand/collapse with height animation

### Special Effects
- **Hero Parallax**: Mouse-tracking background movement
- **Icon Animations**: Rotate and float effects
- **Search Modal**: Scale and fade entrance
- **Sparkles**: Continuous pulse and wiggle

All animations respect `prefers-reduced-motion` for accessibility.

> 📖 See [ANIMATIONS.md](./ANIMATIONS.md) for complete documentation

---

## 🔐 Security Features

### Database Security
- **Row Level Security (RLS)** enabled on all tables
- **Authenticated access** for full content
- **Sneak peek policy** for limited preview
- **Secure by default** with explicit policies

### Application Security
- **Input Sanitization**: XSS protection on all user inputs
- **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Environment Variables**: No hardcoded credentials
- **HTTPS Only**: Enforced in production
- **Rate Limiting**: Recommended for API routes

### Authentication Security
- **Supabase Auth**: Industry-standard authentication
- **Secure Cookies**: HttpOnly, Secure, SameSite
- **Session Management**: Automatic refresh and expiry
- **Protected Routes**: Server-side auth checks

---

## 📊 Database Schema

### `technical_content` Table

| Column | Type | Description | Indexed |
|--------|------|-------------|---------|
| `id` | UUID | Primary key | ✓ |
| `title` | TEXT | Resource title | ✓ |
| `url` | TEXT | Resource link | - |
| `author` | TEXT | Author name(s) | - |
| `source` | TEXT | Source/publication | - |
| `topics` | TEXT[] | Array of topics | ✓ (GIN) |
| `tag_categories` | TEXT[] | Category tags | ✓ (GIN) |
| `tag_subcategories` | TEXT[] | Subcategory tags | ✓ (GIN) |
| `difficulty` | TEXT | Difficulty level | ✓ |
| `content_type` | TEXT | Type of content | ✓ |
| `rating` | NUMERIC(3,2) | Rating (0-5) | ✓ |
| `key_takeaways` | TEXT[] | Key points | - |
| `date_added` | TIMESTAMPTZ | When added | ✓ |
| `publisher` | TEXT | Publisher name | - |
| `created_at` | TIMESTAMPTZ | Record creation | - |
| `updated_at` | TIMESTAMPTZ | Last update | - |

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Deploy** 🚀
   - Automatic deployments on every push
   - Preview deployments for pull requests
   - Production deployment on main branch

### Other Platforms

**Netlify**
```bash
npm run build
```
Deploy the `.next` folder

**AWS Amplify**
- Build command: `npm run build`
- Output directory: `.next`

**Self-Hosted**
```bash
npm run build
npm start
```

---

## 🧪 Testing & Verification

### Database Connection Test
Visit `/test-db` to verify:
- ✓ Supabase connection
- ✓ Table existence
- ✓ RLS policies
- ✓ Data retrieval

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resources` | GET | Fetch resources (authenticated) |
| `/api/sneak-peek` | GET | Preview content (public) |
| `/api/resource-options` | GET | Filter options |
| `/api/verify` | GET | Database verification |
| `/api/revalidate` | POST | Cache invalidation |

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |

### Next.js Configuration

Key features enabled in `next.config.js`:
- **Security Headers**: CSP, HSTS, frame protection
- **Image Optimization**: Automatic WebP conversion
- **Compression**: Gzip enabled
- **Environment**: Type-checked variables

---

## 📚 Additional Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Fast setup for existing databases
- **[SCHEMA_MAPPING.md](./SCHEMA_MAPPING.md)** - Custom schema mapping guide
- **[ANIMATIONS.md](./ANIMATIONS.md)** - Complete animation documentation
- **[MVP_SUMMARY.md](./MVP_SUMMARY.md)** - MVP feature summary
- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Development roadmap
- **[ADMIN_PANEL.md](./ADMIN_PANEL.md)** - Admin features guide

---

## 🐛 Troubleshooting

### Common Issues

**❌ No data showing (0 resources)**
- **Cause**: RLS policies blocking access
- **Fix**: Run the RLS policy SQL from setup section
- **Verify**: Check `/test-db` endpoint

**❌ Authentication not working**
- **Cause**: Incorrect Supabase URL/keys
- **Fix**: Verify `.env.local` values
- **Test**: Check browser console for errors

**❌ Filters not populating**
- **Cause**: Empty arrays or incorrect data types
- **Fix**: Ensure topics/tags are TEXT[] arrays
- **Verify**: Query data directly in Supabase

**❌ Slow performance**
- **Cause**: Missing database indexes
- **Fix**: Run index creation SQL
- **Monitor**: Use Supabase performance insights

**❌ Build errors**
- **Cause**: TypeScript errors or missing dependencies
- **Fix**: `npm install` and check types
- **Clean**: Delete `.next` folder and rebuild

> 📖 Full troubleshooting guide: Check console logs and Supabase dashboard

---

## 🎯 Roadmap & Future Enhancements

- [ ] **Bookmarking System**: Save favorite resources
- [ ] **User Profiles**: Personalized recommendations
- [ ] **Resource Ratings**: User-submitted ratings
- [ ] **Comments & Discussions**: Community engagement
- [ ] **Export Functionality**: CSV/JSON export
- [ ] **Advanced Analytics**: Usage tracking
- [ ] **Mobile App**: React Native version
- [ ] **AI Recommendations**: ML-powered suggestions
- [ ] **Social Sharing**: Share resources easily
- [ ] **Offline Support**: PWA capabilities

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure TypeScript types are correct

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mahaprasad**
- GitHub: [@Mahaprasad003](https://github.com/Mahaprasad003)
- Project: [DPC-Recommends](https://github.com/Mahaprasad003/DPC-Recommends)

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Supabase** for the backend infrastructure
- **Vercel** for seamless deployment
- **Framer Motion** for beautiful animations
- **Tailwind CSS** for the utility-first approach
- **Open Source Community** for inspiration and tools

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Supabase**

⭐ Star this repo if you find it helpful!

</div>

