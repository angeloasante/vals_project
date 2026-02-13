# 💕 vals.love - Create Beautiful Valentine's Pages

A SaaS platform where anyone can create personalized, interactive Valentine's Day websites for their loved ones. Sign up, customize your page, and share the magic with a unique link.

🌐 **Live Site:** [vals.love](https://vals-project-chi.vercel.app)

---

## ✨ Features

### 🔐 User Authentication
- Sign up with email and custom username
- Secure login with Supabase Auth
- Each user gets a unique page at `vals.love/u/[username]`

### 📊 Full Dashboard
- Easy-to-use dashboard to customize your entire page
- Live preview (mobile & desktop views)
- Publish/unpublish toggle
- Mobile-responsive design
- Toast notifications for all actions
- Manage all content from one place

### 🎵 Our Song / Music Player
- Upload your own audio files (MP3, WAV)
- **Extract audio from videos** (MP4, MOV, WebM) - client-side processing
- Custom music player with spinning vinyl animation
- Add song title, artist, and album cover
- Auto-plays your special song on loop
- Play/pause controls with visual feedback

### 📖 Love Poems
- Add custom poems from the dashboard
- **AI-powered poem generator** using GPT-4o
- Multiple styles: romantic, funny, passionate, sweet, literary
- Toggle section visibility on/off

### 💝 CTA Cards Customization
- **Reason Card**: Customize title, subtitle, and buttons
- **Valentine Card**: Customize label, question, Yes/No buttons
- Full control over all card text

### 🎭 Popup/Modal Customization
- **Celebration popup** (when they say Yes)
- **Rejection popup** with two stages of escalation
- Customize all titles, messages, and button text

### 💜 Love Virus Effect
- Triggered when they click "No"
- **Upload custom photos** that fly across screen
- **Custom messages** that appear during the chaos
- **Customizable final popup** with title, message, and button

### 📸 Photo Gallery
- Upload your own photos from dashboard
- Tinder-style swipeable gallery
- Add captions to each photo
- Toggle visibility on/off

### 🕐 Memories Timeline
- Create your own timeline of memories
- Add photos to each timeline item (optional)
- Tell your love story step by step
- Toggle visibility on/off

### 💌 Open When Notes (Love Letters)
- Envelope-style notes for different occasions
- Customize messages for any occasion
- **AI-powered love letter generator** using GPT-4o
- Multiple styles: romantic, funny, passionate, sweet, poetic
- Custom icons and colors
- Toggle visibility on/off

### 🎯 Why I Love You
- Add your own reasons from dashboard
- Tap to reveal random reasons
- Dynamic content from your database

### ✅ Our Bucket List
- Add bucket list items from dashboard
- Mark items as completed
- Toggle visibility on/off

### 🎟️ Love Coupons
- Redeemable coupons for special treats
- Toggle visibility on/off

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (sonner toasts)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage (for uploads)
- **AI:** OpenAI GPT-4o (love letters & poems)
- **Audio:** Web Audio API (video-to-audio extraction)
- **Fonts:** Inter, Dancing Script, Playfair Display
- **Icons:** Iconify
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vals-web.git

# Navigate to project directory
cd vals-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase and OpenAI credentials to .env

# Run database migrations in Supabase SQL Editor
# See supabase/schema.sql and supabase/migrations/

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🗄️ Database Schema

### Tables
- **profiles** - User profiles with username
- **valentine_pages** - User page settings, CTA customization, virus effect, music
- **gallery_items** - Photo gallery with captions
- **timeline_items** - Story timeline with optional images
- **reasons** - "Why I Love You" reasons
- **bucket_list** - Bucket list items
- **open_when_notes** - Love letters with icons
- **poems** - Custom poems
- **coupons** - Love coupons

### Storage Buckets
- **user-uploads** - User uploaded photos and audio

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── extract-audio/   # Audio upload & processing
│   │   ├── generate-love-letter/  # AI love letter generation
│   │   └── generate-poem/   # AI poem generation
│   ├── components/
│   │   ├── bento/           # Bento grid cards
│   │   ├── modals/          # Modal components
│   │   ├── ui/              # Reusable UI (sonner toasts)
│   │   ├── Gallery.tsx      # Swipeable gallery
│   │   ├── Timeline.tsx     # Story timeline
│   │   ├── BucketList.tsx   # Bucket list
│   │   ├── LoveVirusEffect.tsx  # Flying photos effect
│   │   └── ...
│   ├── dashboard/
│   │   └── page.tsx         # User dashboard (all features)
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Signup page
│   ├── u/
│   │   └── [username]/
│   │       └── page.tsx     # Dynamic user pages
│   └── page.tsx             # Landing page
├── lib/
│   ├── supabase/
│   │   └── client.ts        # Supabase client
│   └── utils.ts             # Utility functions
├── supabase/
│   ├── schema.sql           # Database schema
│   └── migrations/          # SQL migrations
└── public/
    └── ...
```

---

## 🎨 How It Works

1. **Sign Up** - Create account with email + unique username
2. **Dashboard** - Customize your page content
   - ⚙️ Settings: Names, dates, titles, visibility toggles
   - 🎵 Music: Upload song or extract from video
   - 📸 Gallery: Upload photos with captions
   - 📅 Timeline: Add your love story
   - 💕 Reasons: Add why you love them
   - 📖 Poems: Write or AI-generate poems
   - 📝 Bucket List: Add goals together
   - 💌 Open When: Love letters (manual or AI)
   - 🎟️ Coupons: Redeemable love coupons
   - 💝 CTA Cards: Customize all card text
3. **Publish** - Toggle your page live
4. **Share** - Send `vals.love/u/yourusername` to your valentine!

---

## 💖 Made With Love

Create something special for someone special. Every page is unique, every love story is different.

**Happy Valentine's Day!** 💕

---

## 👨‍💻 Created By

**Travis Moore**

- 🌐 [travismoore.com](https://travismoore.com)
- 🌐 [angeloasante.com](https://angeloasante.com)
- 🔗 [biofolio.link/u/travis_moore](https://biofolio.link/u/travis_moore)

---

© 2026 vals.love. All rights reserved.

