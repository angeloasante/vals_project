"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ValentinePage from "@/app/components/ValentinePage";
import { GalleryItem } from "@/app/components/Gallery";
import { TimelineItemData } from "@/app/components/Timeline";

interface PageData {
  startDate: Date;
  recipientName: string;
  senderName: string;
  heroTitle: string;
  heroSubtitle: string;
  galleryItems: GalleryItem[];
  timelineItems: TimelineItemData[];
}

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [notPublished, setNotPublished] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      const supabase = createClient();

      // Get user profile by username
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();

      if (!profile || profileError) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Get user's valentine page
      const { data: page, error: pageError } = await supabase
        .from("valentine_pages")
        .select("*")
        .eq("user_id", profile.id)
        .single();

      if (!page || pageError) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Check if published
      if (!page.is_published) {
        setNotPublished(true);
        setLoading(false);
        return;
      }

      // Get gallery items
      const { data: galleryData } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("page_id", page.id)
        .order("order_index", { ascending: true });

      // Get timeline items
      const { data: timelineData } = await supabase
        .from("timeline_items")
        .select("*")
        .eq("page_id", page.id)
        .order("order_index", { ascending: true });

      // Transform gallery items
      const galleryItems: GalleryItem[] = (galleryData || []).map((item) => ({
        id: item.id,
        src: item.src,
        type: item.type || "image",
        caption: item.caption || "",
      }));

      // Transform timeline items
      const timelineItems: TimelineItemData[] = (timelineData || []).map((item) => ({
        id: item.id,
        label: item.label,
        title: item.title,
        description: item.description || "",
        imageSrc: item.image_src,
      }));

      setPageData({
        startDate: new Date(page.start_date),
        recipientName: page.recipient_name,
        senderName: page.sender_name,
        heroTitle: page.hero_title || "You are my forever.",
        heroSubtitle: page.hero_subtitle || "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
        galleryItems,
        timelineItems,
      });
      setLoading(false);
    };

    if (username) {
      loadPage();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading your surprise... 💕</div>
      </div>
    );
  }

  if (notPublished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <p className="text-6xl mb-4">🔒</p>
        <h1 className="text-3xl font-bold text-white mb-2">Coming Soon!</h1>
        <p className="text-rose-100 mb-6">This love page is being prepared... check back soon! 💕</p>
        <p className="text-rose-200/60 text-sm">
          (If this is your page, go to your dashboard and click &quot;Publish&quot;)
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <p className="text-6xl mb-4">💔</p>
        <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-rose-100">This username doesn&apos;t exist. Double check the URL!</p>
      </div>
    );
  }

  if (!pageData) return null;

  return (
    <ValentinePage
      startDate={pageData.startDate}
      recipientName={pageData.recipientName}
      senderName={pageData.senderName}
      heroTitle={pageData.heroTitle}
      heroSubtitle={pageData.heroSubtitle}
      galleryItems={pageData.galleryItems}
      timelineItems={pageData.timelineItems}
    />
  );
}
