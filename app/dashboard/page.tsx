"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Profile {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
}

interface ValentinePage {
  id: string;
  recipient_name: string;
  sender_name: string;
  start_date: string;
  hero_title: string;
  hero_subtitle: string;
  is_published: boolean;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>>([]);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<ValentinePage | null>(null);
  
  // Form states
  const [recipientName, setRecipientName] = useState("My Love");
  const [senderName, setSenderName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [heroTitle, setHeroTitle] = useState("To My Everything");
  const [heroSubtitle, setHeroSubtitle] = useState("A little corner of the internet, just for you 💕");
  const [isPublished, setIsPublished] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setHearts(
      [...Array(12)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 25 + 10,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
      }))
    );

    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    // Get user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Get user's valentine page
    const { data: pageData } = await supabase
      .from("valentine_pages")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (pageData) {
      setPage(pageData);
      setRecipientName(pageData.recipient_name || "My Love");
      setSenderName(pageData.sender_name || "");
      setStartDate(pageData.start_date || "");
      setHeroTitle(pageData.hero_title || "To My Everything");
      setHeroSubtitle(pageData.hero_subtitle || "A little corner of the internet, just for you 💕");
      setIsPublished(pageData.is_published || false);
    }

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    if (!page?.id) return;
    
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("valentine_pages")
      .update({
        recipient_name: recipientName,
        sender_name: senderName,
        start_date: startDate,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        is_published: isPublished,
      })
      .eq("id", page.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Settings saved!" });
    }
    
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!page?.id) return;
    
    const newStatus = !isPublished;
    setIsPublished(newStatus);
    
    await supabase
      .from("valentine_pages")
      .update({ is_published: newStatus })
      .eq("id", page.id);
      
    setMessage({ 
      type: "success", 
      text: newStatus ? "Your page is now live!" : "Page unpublished" 
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const pageUrl = `https://vals.love/u/${profile?.username}`;

  // Calculate days together for preview
  const calculateDays = () => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute text-white/10"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              fontSize: `${heart.size}px`,
              animation: `float ${heart.duration}s ease-in-out infinite`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white font-dancing">
            vals.love
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/u/${profile?.username}`}
              target="_blank"
              className="text-sm text-rose-100 hover:text-white transition-colors"
            >
              View Live Page →
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-rose-200/70 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Page URL & Publish Status */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">Your Love Page</h1>
              <div className="flex items-center gap-2">
                <span className="text-rose-100/80 text-sm">
                  {pageUrl}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(pageUrl)}
                  className="text-rose-200 text-sm hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPublished
                    ? "bg-green-500/20 text-green-300 border border-green-400/30"
                    : "bg-white/10 text-rose-100 border border-white/20"
                }`}
              >
                {isPublished ? "Published ✓" : "Draft"}
              </span>
              <button
                onClick={handlePublish}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  isPublished
                    ? "bg-white/20 text-white hover:bg-white/30 border border-white/20"
                    : "bg-white text-rose-600 hover:bg-rose-50"
                }`}
              >
                {isPublished ? "Unpublish" : "Publish Page"}
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl border ${
              message.type === "success"
                ? "bg-green-500/20 text-green-300 border-green-400/30"
                : "bg-red-500/20 text-red-300 border-red-400/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Main Content - Forms Left, Preview Right */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Forms */}
          <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: "settings", label: "⚙️ Settings" },
                { id: "gallery", label: "📸 Gallery" },
                { id: "timeline", label: "📅 Timeline" },
                { id: "reasons", label: "💕 Reasons" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-rose-600"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              {activeTab === "settings" && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-white">Page Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-rose-100 mb-2">
                      Recipient&apos;s Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                      placeholder="My Love"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-rose-100 mb-2">
                      Your Name (Sender)
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                      placeholder="Forever Yours"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-rose-100 mb-2">
                      When Did You Meet?
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-rose-100 mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                      placeholder="To My Everything"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-rose-100 mb-2">
                      Hero Subtitle
                    </label>
                    <input
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                      placeholder="A little corner of the internet, just for you"
                    />
                  </div>
                  
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Photo Gallery</h2>
                    <button className="bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all">
                      + Add Photo
                    </button>
                  </div>
                  
                  <div className="text-center py-12 text-rose-100/70">
                    <p className="text-4xl mb-4">📸</p>
                    <p>No photos yet. Add your first memory!</p>
                  </div>
                  <p className="text-sm text-rose-100/50">
                    Coming soon: Upload photos directly from here!
                  </p>
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Your Story Timeline</h2>
                    <button className="bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all">
                      + Add Memory
                    </button>
                  </div>
                  
                  <div className="text-center py-12 text-rose-100/70">
                    <p className="text-4xl mb-4">📅</p>
                    <p>No timeline items yet. Tell your love story!</p>
                  </div>
                  <p className="text-sm text-rose-100/50">
                    Coming soon: Edit timeline items directly!
                  </p>
                </div>
              )}

              {activeTab === "reasons" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Reasons I Love You</h2>
                    <button className="bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all">
                      + Add Reason
                    </button>
                  </div>
                  
                  <div className="text-center py-12 text-rose-100/70">
                    <p className="text-4xl mb-4">💕</p>
                    <p>No reasons yet. Share why you love them!</p>
                  </div>
                  <p className="text-sm text-rose-100/50">
                    Coming soon: Edit reasons directly!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {/* Preview Toggle */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-rose-100">Live Preview</h3>
                <div className="flex bg-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewMode === "mobile"
                        ? "bg-white text-rose-600"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    📱 Mobile
                  </button>
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewMode === "desktop"
                        ? "bg-white text-rose-600"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    💻 Desktop
                  </button>
                </div>
              </div>

              {/* Mobile Preview */}
              {previewMode === "mobile" && (
                <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl max-w-[320px] mx-auto">
                  {/* Phone Notch */}
                  <div className="bg-gray-900 h-6 rounded-t-[2.5rem] flex items-center justify-center">
                    <div className="w-20 h-5 bg-black rounded-full" />
                  </div>
                  
                  {/* Phone Screen */}
                  <div className="bg-rose-600 rounded-[2rem] overflow-hidden h-[580px] relative overflow-y-auto">
                    {/* Mini floating hearts */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute text-white/10 animate-float"
                          style={{
                            left: `${10 + (i * 12) % 80}%`,
                            top: `${10 + (i * 15) % 80}%`,
                            fontSize: '14px',
                            animationDelay: `${i * 0.5}s`,
                          }}
                        >
                          💕
                        </div>
                      ))}
                    </div>
                    
                    {/* Preview Content */}
                    <div className="relative z-10 p-4 text-center">
                      {/* Hero Section */}
                      <div className="pt-6 pb-4">
                        <p className="text-rose-200 text-[10px] mb-1">💕 For {recipientName || "My Love"} 💕</p>
                        <h1 className="text-xl font-bold text-white font-dancing mb-1">
                          {heroTitle || "To My Everything"}
                        </h1>
                        <p className="text-rose-100 text-[10px] px-2">
                          {heroSubtitle || "A little corner of the internet, just for you"}
                        </p>
                      </div>
                      
                      {/* Days Counter */}
                      {startDate && (
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 mb-4">
                          <p className="text-2xl font-bold text-white">{calculateDays()}</p>
                          <p className="text-rose-100 text-[10px]">Days Together</p>
                        </div>
                      )}
                      
                      {/* Bento Grid Preview */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {/* Gallery Card */}
                        <div className="bg-white/90 backdrop-blur rounded-xl p-3 text-left">
                          <p className="text-[10px] text-rose-600 font-medium mb-1">📸 Gallery</p>
                          <p className="text-[8px] text-gray-600">Our memories</p>
                        </div>
                        
                        {/* Music Card */}
                        <div className="bg-white/90 backdrop-blur rounded-xl p-3 text-left">
                          <p className="text-[10px] text-rose-600 font-medium mb-1">🎵 Our Song</p>
                          <p className="text-[8px] text-gray-600">Playing now...</p>
                        </div>
                        
                        {/* Reasons Card */}
                        <div className="bg-white/90 backdrop-blur rounded-xl p-3 text-left col-span-2">
                          <p className="text-[10px] text-rose-600 font-medium mb-1">💕 Why I Love You</p>
                          <p className="text-[8px] text-gray-600">100+ reasons and counting</p>
                        </div>
                        
                        {/* Valentine Card */}
                        <div className="bg-white/90 backdrop-blur rounded-xl p-3 text-center col-span-2">
                          <p className="text-[10px] text-rose-600 font-medium mb-2">Will you be my Valentine?</p>
                          <div className="flex gap-2 justify-center">
                            <span className="bg-rose-600 text-white text-[8px] px-3 py-1 rounded-full">Yes! 💕</span>
                            <span className="bg-white border border-rose-200 text-rose-600 text-[8px] px-3 py-1 rounded-full">No</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Timeline Preview */}
                      <div className="bg-white/90 backdrop-blur rounded-xl p-3 mb-4 text-left">
                        <p className="text-[10px] text-rose-600 font-medium mb-2">📅 Our Timeline</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rose-500 rounded-full" />
                            <p className="text-[8px] text-gray-600">First met</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rose-400 rounded-full" />
                            <p className="text-[8px] text-gray-600">First date</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rose-300 rounded-full" />
                            <p className="text-[8px] text-gray-600">Said &quot;I love you&quot;</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="pt-2 pb-4">
                        <p className="text-rose-200/70 text-[9px]">
                          Made with 💕 by {senderName || "Your Valentine"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Preview */}
              {previewMode === "desktop" && (
                <div className="bg-gray-800 rounded-xl p-2 shadow-2xl">
                  {/* Browser Header */}
                  <div className="bg-gray-700 rounded-t-lg px-3 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-2">
                      <div className="bg-gray-600 rounded px-2 py-1 text-[9px] text-gray-300 text-center">
                        vals.love/u/{profile?.username || "yourname"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Browser Content */}
                  <div className="bg-rose-600 rounded-b-lg overflow-hidden h-[400px] relative overflow-y-auto">
                    {/* Floating hearts */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute text-white/10 animate-float"
                          style={{
                            left: `${5 + (i * 10) % 90}%`,
                            top: `${5 + (i * 12) % 90}%`,
                            fontSize: '12px',
                            animationDelay: `${i * 0.3}s`,
                          }}
                        >
                          💕
                        </div>
                      ))}
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-4">
                      {/* Hero */}
                      <div className="text-center py-4">
                        <p className="text-rose-200 text-[9px] mb-1">💕 For {recipientName || "My Love"} 💕</p>
                        <h1 className="text-lg font-bold text-white font-dancing mb-1">
                          {heroTitle || "To My Everything"}
                        </h1>
                        <p className="text-rose-100 text-[9px]">
                          {heroSubtitle || "A little corner of the internet, just for you"}
                        </p>
                      </div>
                      
                      {/* Days Counter */}
                      {startDate && (
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 mb-3 text-center max-w-[200px] mx-auto">
                          <p className="text-xl font-bold text-white">{calculateDays()}</p>
                          <p className="text-rose-100 text-[9px]">Days Together</p>
                        </div>
                      )}
                      
                      {/* Desktop Bento Grid */}
                      <div className="grid grid-cols-3 gap-2 max-w-[350px] mx-auto">
                        <div className="bg-white/90 rounded-lg p-2">
                          <p className="text-[8px] text-rose-600 font-medium">📸 Gallery</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-2">
                          <p className="text-[8px] text-rose-600 font-medium">🎵 Music</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-2">
                          <p className="text-[8px] text-rose-600 font-medium">💕 Reasons</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-2 col-span-2">
                          <p className="text-[8px] text-rose-600 font-medium">📅 Timeline</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-2">
                          <p className="text-[8px] text-rose-600 font-medium">💌 Poems</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-2 col-span-3 text-center">
                          <p className="text-[8px] text-rose-600 font-medium mb-1">Will you be my Valentine?</p>
                          <div className="flex gap-1 justify-center">
                            <span className="bg-rose-600 text-white text-[7px] px-2 py-0.5 rounded-full">Yes!</span>
                            <span className="bg-white border border-rose-200 text-rose-600 text-[7px] px-2 py-0.5 rounded-full">No</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="text-center pt-4">
                        <p className="text-rose-200/70 text-[8px]">
                          Made with 💕 by {senderName || "Your Valentine"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
