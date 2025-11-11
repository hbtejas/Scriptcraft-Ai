# ScriptCraftAI 🎙️

> Turn your ideas into AI-generated podcast scripts with summaries and quizzes

ScriptCraftAI is a production-ready full-stack web application that enables content creators to generate professional podcast scripts using Google Gemini AI. Built with React, TailwindCSS, and Supabase, it provides a seamless experience for creating, managing, and organizing podcast content.

## ✨ Features

- **AI-Powered Script Generation**: Create podcast scripts from simple ideas using Google Gemini API
- **Multiple Tone Options**: Choose from conversational, formal, humorous, or storytelling styles
- **Auto-Summarization**: Generate concise summaries of your scripts automatically
- **Interactive Quizzes**: Create comprehension quizzes (3-5 questions) from your content
- **User Authentication**: Secure email/password and Google OAuth login via Supabase Auth
- **Personal Dashboard**: Save, manage, edit, and delete all your scripts
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback and state management with Zustand

## 🏗️ Tech Stack

### Frontend
- **React** (Vite) - Fast, modern React development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (Email + Google OAuth)
  - Edge Functions (Deno runtime)
  - Row Level Security (RLS)

### AI
- **Google Gemini API** - Text generation for scripts, summaries, and quizzes

### Deployment
- **Netlify** - Frontend hosting with auto-deploy
- **Supabase Cloud** - Managed backend services

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase CLI** (for local development and deployment)
- **Supabase Account** ([Create one here](https://supabase.com))
- **Google API Key** for Gemini ([Get one here](https://makersuite.google.com/app/apikey))
- **Netlify Account** (optional, for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/scriptcraftai.git
cd scriptcraftai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase Project

#### Create a Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details and wait for setup to complete

#### Run Database Migration
1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Run the migration:
```bash
supabase db push
```

Or manually run the SQL in `supabase/migrations/001_create_podcast_scripts.sql` in the Supabase SQL Editor.

#### Enable Google OAuth (Optional)
1. Go to Authentication → Providers in Supabase Dashboard
2. Enable Google provider
3. Add your OAuth credentials from Google Cloud Console

### 4. Setup Environment Variables

#### Frontend (.env in root directory)
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in: Supabase Dashboard → Settings → API

#### Backend (Supabase Edge Functions)
In Supabase Dashboard → Project Settings → Edge Functions:
```env
GOOGLE_API_KEY=your_google_gemini_api_key
```

### 5. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy generate-script
supabase functions deploy summarize-script
supabase functions deploy generate-quiz
```

Or deploy all at once:
```bash
cd supabase/functions
for dir in */; do supabase functions deploy "${dir%/}"; done
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

### Deploy Frontend to Netlify

#### Option 1: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option 2: Deploy via GitHub
1. Push your code to GitHub
2. Go to [Netlify Dashboard](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy!

### Update OAuth Redirect URLs
After deploying, add your production URL to:
1. Supabase Dashboard → Authentication → URL Configuration
2. Add your Netlify URL (e.g., `https://your-app.netlify.app`) to:
   - Site URL
   - Redirect URLs

## 🗂️ Project Structure

```
ScriptCraftAI/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── QuizPlayer.jsx
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Generator.jsx
│   │   ├── ScriptView.jsx
│   │   ├── Profile.jsx
│   │   └── ResetPassword.jsx
│   ├── services/          # API services
│   │   ├── aiService.js       # Gemini AI integration
│   │   └── scriptService.js   # Supabase database operations
│   ├── store/             # State management
│   │   └── authStore.js       # Zustand auth store
│   ├── lib/               # Utilities and config
│   │   └── supabase.js        # Supabase client
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── supabase/
│   ├── functions/         # Edge Functions
│   │   ├── generate-script/
│   │   ├── summarize-script/
│   │   └── generate-quiz/
│   └── migrations/        # Database migrations
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── netlify.toml           # Netlify configuration
└── README.md              # This file
```

## 🗄️ Database Schema

### `podcast_scripts` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `title` | TEXT | Script title |
| `prompt` | TEXT | User's original input |
| `script` | TEXT | AI-generated script |
| `summary` | TEXT | AI-generated summary (optional) |
| `quiz` | JSONB | Quiz questions array (optional) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

## 🔐 Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Authentication**: Managed by Supabase Auth
- **API Keys**: Stored securely in environment variables
- **CORS**: Configured for Edge Functions
- **XSS Protection**: Security headers via Netlify

## 🎨 Customization

### Change Color Scheme
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    400: '#your-color',
    // ... other shades
  }
}
```

### Modify AI Prompts
Edit the prompts in:
- `supabase/functions/generate-script/index.ts`
- `supabase/functions/summarize-script/index.ts`
- `supabase/functions/generate-quiz/index.ts`

## 🐛 Troubleshooting

### Edge Functions Not Working
- Verify `GOOGLE_API_KEY` is set in Supabase Dashboard
- Check function logs: `supabase functions logs <function-name>`
- Ensure CORS headers are correct

### Authentication Issues
- Verify Supabase URL and Anon Key are correct
- Check redirect URLs in Supabase Auth settings
- Clear browser cache and cookies

### Build Errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Ensure Node.js version is 18+

## 📝 Environment Variables Reference

### Frontend (.env)
```env
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Your Supabase anonymous key
```

### Backend (Supabase Dashboard)
```env
GOOGLE_API_KEY=             # Your Google Gemini API key
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** - Amazing backend-as-a-service platform
- **Google Gemini** - Powerful AI for text generation
- **Netlify** - Seamless deployment and hosting
- **TailwindCSS** - Beautiful utility-first CSS framework

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@scriptcraftai.com
- Discord: [Join our community](#)

## 🗺️ Roadmap

- [ ] Audio generation from scripts using TTS APIs
- [ ] Export scripts to PDF/DOCX
- [ ] Collaborative editing
- [ ] Script templates library
- [ ] Advanced analytics dashboard
- [ ] Public sharing with custom links
- [ ] Mobile app (React Native)

---

**Built with ❤️ by [Your Name]**

⭐ Star this repo if you find it useful!
