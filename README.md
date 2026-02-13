# 💕 For Us - Valentine's Day Website

A romantic, interactive Valentine's Day website built with love. This is a personalized web experience featuring memories, love letters, music, and interactive elements to celebrate our relationship.

🌐 **Live Site:** [sekgo.vals.love](http://sekgo.vals.love)

---

## ✨ Features

### 🎵 Our Song
- Custom music player with spinning vinyl animation
- Auto-plays our special song on loop
- Play/pause controls with visual feedback

### 📖 Love Book
- Interactive book with page-flip animations
- Collection of personalized poems and love letters
- Real, honest expressions of love

### 💝 Will You Be My Valentine?
- Interactive valentine card with Yes/No buttons
- "No" button triggers a love virus effect 😂
- Pictures and "I LOVE YOU" messages flood the screen
- Celebration confetti when she says yes!

### 📸 Our Moments Gallery
- Tinder-style swipeable photo gallery
- Supports both images and videos
- Mute/unmute controls for video content
- Swipe left/right or use buttons to navigate

### 🕐 Memories Timeline
- Beautiful timeline of our journey together
- Photos from our special moments
- Scroll-reveal animations

### 💌 Open When Notes
- Envelope-style notes for different occasions
- "Open when you miss me", "Open when you're sad", etc.
- Heartfelt messages inside each envelope

### 🎯 Why I Love You
- Tap to reveal random reasons
- Mix of sweet and playful reasons 😏

### ✅ Our Bucket List
- Interactive checklist of things to do together
- Check off items as we complete them

### 🎟️ Love Coupons
- Redeemable coupons for special treats
- Movie nights, massages, breakfast in bed, etc.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Fonts:** Inter, Dancing Script, Playfair Display
- **Icons:** Iconify
- **Animations:** Custom CSS animations + Tailwind

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/angeloasante/my-personal-vals.git

# Navigate to project directory
cd my-personal-vals

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/
│   ├── components/
│   │   ├── bento/           # Bento grid components
│   │   │   ├── BentoGrid.tsx
│   │   │   ├── CounterCard.tsx
│   │   │   ├── MusicCard.tsx
│   │   │   ├── ReasonCard.tsx
│   │   │   └── ValentineCard.tsx
│   │   ├── modals/          # Modal components
│   │   │   ├── CelebrationModal.tsx
│   │   │   ├── NoteModal.tsx
│   │   │   ├── RejectionModal.tsx
│   │   │   └── SecondRejectionModal.tsx
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── Icon.tsx
│   │   │   └── Modal.tsx
│   │   ├── BackgroundEffects.tsx
│   │   ├── BucketList.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── LoveBook.tsx
│   │   ├── LoveCoupons.tsx
│   │   ├── LoveVirusEffect.tsx
│   │   ├── OpenWhenNotes.tsx
│   │   └── Timeline.tsx
│   ├── hooks/
│   │   └── useScrollReveal.ts
│   ├── utils/
│   │   └── effects.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── memories/            # Photo & video gallery
│   ├── youtube-audio.mov    # Our song
│   └── [photos].jpeg        # Timeline photos
└── README.md
```

---

## 🎨 Customization

### Adding Your Own Photos
1. Add photos to `public/` or `public/memories/`
2. Update the image paths in:
   - `Timeline.tsx` - Memory timeline photos
   - `Gallery.tsx` - Swipeable gallery
   - `LoveVirusEffect.tsx` - Love virus photos

### Changing the Music
1. Add your audio/video file to `public/`
2. Update `AUDIO_SRC` in `MusicCard.tsx`

### Editing Poems & Messages
- Love Book poems: `LoveBook.tsx` → `POEMS` array
- Reasons: `ReasonCard.tsx` → `reasons` array
- Open When notes: `OpenWhenNotes.tsx`
- Bucket list: `BucketList.tsx`
- Love coupons: `LoveCoupons.tsx`

---

## 💖 Made With Love

This website was created with all my heart for my special person. Every detail, every feature, every word is for you.

I know I'm not perfect. I disappear sometimes. I say sorry a lot. But one thing that will never change is how much I love you.

**Forever yours,**  
*Your boy* 💕

---

## 📄 License

This project is personal and private. Made exclusively for us. 💝

