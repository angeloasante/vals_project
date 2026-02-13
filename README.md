# 💕 vals.love - Create Beautiful Valentine's Pages

A SaaS platform where anyone can create personalized, interactive Valentine's Day websites for their loved ones. Sign up, customize your page, and share the magic with a unique link.

🌐 **Live Site:** [vals.love](https://vals-project-chi.vercel.app)

---

## ✨ Features

### 🔐 User Authentication
- Sign up with email and custom username
- Secure login with Supabase Auth
- Each user gets a unique page at `vals.love/u/[username]`

### 📊 Dashboard
- Easy-to-use dashboard to customize your page
- Live preview (mobile & desktop views)
- Publish/unpublish toggle
- Manage all content from one place

### 🎵 Our Song
- Custom music player with spinning vinyl animation
- Auto-plays your special song on loop
- Play/pause controls with visual feedback

### 📖 Love Book
- Interactive book with page-flip animations
- Collection of personalized poems and love letters

### 💝 Will You Be My Valentine?
- Interactive valentine card with Yes/No buttons
- "No" button triggers a love virus effect 😂
- Celebration confetti when they say yes!

### 📸 Photo Gallery
- Upload your own photos from dashboard
- Tinder-style swipeable gallery
- Add captions to each photo
- Supports images with beautiful display

### 🕐 Memories Timeline
- Create your own timeline of memories
- Add photos to each timeline item (optional)
- Tell your love story step by step

### 💌 Open When Notes (Love Letters)
- Envelope-style notes for different occasions
- Customize messages for "when you're mad", "sad", "miss me"
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
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage (for photo uploads)
- **Fonts:** Inter, Dancing Script, Playfair Display
- **Icons:** Iconify
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

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
# Add your Supabase credentials to .env

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
- **valentine_pages** - User page settings & content
- **gallery_items** - Photo gallery with captions
- **timeline_items** - Story timeline with optional images
- **reasons** - "Why I Love You" reasons
- **bucket_list** - Bucket list items

### Storage Buckets
- **user-uploads** - User uploaded photos

---

## 📁 Project Structure

```
├── app/
│   ├── components/
│   │   ├── bento/           # Bento grid cards
│   │   ├── modals/          # Modal components
│   │   ├── ui/              # Reusable UI
│   │   ├── Gallery.tsx      # Swipeable gallery
│   │   ├── Timeline.tsx     # Story timeline
│   │   ├── BucketList.tsx   # Bucket list
│   │   └── ...
│   ├── dashboard/
│   │   └── page.tsx         # User dashboard
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Signup page
│   ├── u/
│   │   └── [username]/
│   │       └── page.tsx     # Dynamic user pages
│   └── page.tsx             # Landing page
├── lib/
│   └── supabase/
│       └── client.ts        # Supabase client
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
   - Settings: Names, dates, titles
   - Gallery: Upload photos with captions
   - Timeline: Add your love story
   - Reasons: Add why you love them
   - Bucket List: Add goals together
3. **Publish** - Toggle your page live
4. **Share** - Send `vals.love/u/yourusername` to your valentine!

---

## 💖 Made With Love

Create something special for someone special. Every page is unique, every love story is different.

**Happy Valentine's Day!** 💕

---

## 📄 License

MIT License - Feel free to use and modify for your own projects.

