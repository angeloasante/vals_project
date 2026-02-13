"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ValentinePage from "@/app/components/ValentinePage";
import { GalleryItem } from "@/app/components/Gallery";
import { TimelineItemData } from "@/app/components/Timeline";
import { ReasonItemData, ReasonCardSettings } from "@/app/components/bento/ReasonCard";
import { BucketListItemData } from "@/app/components/BucketList";
import { OpenWhenNoteData } from "@/app/components/OpenWhenNotes";
import { PoemData } from "@/app/components/LoveBook";
import { MusicSettingsData } from "@/app/components/bento/MusicCard";
import { CouponItemData } from "@/app/components/LoveCoupons";
import { ValentineCardSettings } from "@/app/components/bento/ValentineCard";
import { CelebrationModalSettings } from "@/app/components/modals/CelebrationModal";
import { RejectionModalSettings } from "@/app/components/modals/RejectionModal";
import { SecondRejectionModalSettings } from "@/app/components/modals/SecondRejectionModal";
import { LoveVirusSettings } from "@/app/components/LoveVirusEffect";

interface PageData {
  startDate: Date;
  recipientName: string;
  senderName: string;
  heroTitle: string;
  heroSubtitle: string;
  galleryItems: GalleryItem[];
  timelineItems: TimelineItemData[];
  reasons: ReasonItemData[];
  bucketList: BucketListItemData[];
  openWhenNotes: OpenWhenNoteData[];
  poems: PoemData[];
  musicSettings: MusicSettingsData;
  coupons: CouponItemData[];
  showBucketList: boolean;
  showOpenWhen: boolean;
  showCoupons: boolean;
  showPoems: boolean;
  showTimeline: boolean;
  showGallery: boolean;
  reasonCardSettings: ReasonCardSettings;
  valentineCardSettings: ValentineCardSettings;
  celebrationSettings: CelebrationModalSettings;
  rejectionSettings: RejectionModalSettings;
  secondRejectionSettings: SecondRejectionModalSettings;
  virusSettings: LoveVirusSettings;
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

      // Get reasons
      const { data: reasonsData } = await supabase
        .from("reasons")
        .select("*")
        .eq("page_id", page.id)
        .order("order_index", { ascending: true });

      // Get bucket list
      const { data: bucketData } = await supabase
        .from("bucket_list")
        .select("*")
        .eq("page_id", page.id)
        .order("order_index", { ascending: true });

      // Get open when notes
      const { data: openWhenData } = await supabase
        .from("open_when_notes")
        .select("*")
        .eq("page_id", page.id)
        .order("order_index", { ascending: true });

      // Get poems
      const { data: poemsData } = await supabase
        .from("poems")
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

      // Transform reasons
      const reasons: ReasonItemData[] = (reasonsData || []).map((item) => ({
        id: item.id,
        text: item.text,
      }));

      // Transform bucket list
      const bucketList: BucketListItemData[] = (bucketData || []).map((item) => ({
        id: item.id,
        text: item.text,
        completed: item.completed || false,
      }));

      // Transform open when notes
      const openWhenNotes: OpenWhenNoteData[] = (openWhenData || []).map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        icon: item.icon,
        iconColor: item.icon_color,
      }));

      // Transform poems
      const poems: PoemData[] = (poemsData || []).map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
      }));

      setPageData({
        startDate: new Date(page.start_date),
        recipientName: page.recipient_name,
        senderName: page.sender_name,
        heroTitle: page.hero_title || "You are my forever.",
        heroSubtitle: page.hero_subtitle || "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
        galleryItems,
        timelineItems,
        reasons,
        bucketList,
        openWhenNotes,
        poems,
        // These will use defaults if not customized (future feature)
        musicSettings: {},
        coupons: [],
        // Visibility settings
        showBucketList: page.show_bucket_list !== false,
        showOpenWhen: page.show_open_when !== false,
        showCoupons: page.show_coupons !== false,
        showPoems: page.show_poems !== false,
        showTimeline: page.show_timeline !== false,
        showGallery: page.show_gallery !== false,
        // CTA Card settings
        reasonCardSettings: {
          title: page.reason_card_title || "Why I Love You",
          subtitle: page.reason_card_subtitle || "Tap to reveal a reason",
          buttonText: page.reason_card_button || "Tell Me Why",
          anotherButtonText: page.reason_card_another_button || "Another One",
        },
        valentineCardSettings: {
          label: page.valentine_card_label || "Important",
          question: page.valentine_card_question || "Will you be my\nValentine?",
          yesText: page.valentine_card_yes_text || "Yes, Always",
          noText: page.valentine_card_no_text || "No",
        },
        // Modal settings
        celebrationSettings: {
          title: page.celebration_title || "Yay! ❤️",
          message: page.celebration_message || "You just made me the happiest person alive. I love you so much!",
          buttonText: page.celebration_button || "Can't wait!",
        },
        rejectionSettings: {
          title: page.rejection_title || "Are you sure?",
          message: page.rejection_message || "My heart might break into a million pieces...",
          acceptButton: page.rejection_accept_button || "Yes, I'll be yours",
          rejectButton: page.rejection_reject_button || "Still No",
        },
        secondRejectionSettings: {
          title: page.second_rejection_title || "Last Chance!",
          message: page.second_rejection_message || "I'll make you the happiest person, I promise!",
          acceptButton: page.second_rejection_accept_button || "Okay, Yes! ❤️",
          rejectButton: page.second_rejection_reject_button || "No 😤",
        },
        virusSettings: {
          images: page.virus_images || [],
          messages: page.virus_messages || ["I LOVE YOU! 💕", "YOU'RE MINE! 💝", "FOREVER! 💗", "MY BABY! 🥰", "LOCKED IN! 🔐", "NO ESCAPE! 😘"],
          finalTitle: page.virus_final_title || "You can't escape my love!",
          finalMessage: page.virus_final_message || "At this point you don't even have an option, we locked in 😂😂",
          finalSubmessage: page.virus_final_submessage || "Every moment with you is a treasure. Please be my Valentine? 🥺",
          finalButton: page.virus_final_button || "Fine, YES! I love you too! ❤️",
        },
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
      reasons={pageData.reasons}
      bucketList={pageData.bucketList}
      openWhenNotes={pageData.openWhenNotes}
      poems={pageData.poems}
      musicSettings={pageData.musicSettings}
      coupons={pageData.coupons}
      showBucketList={pageData.showBucketList}
      showOpenWhen={pageData.showOpenWhen}
      showCoupons={pageData.showCoupons}
      showPoems={pageData.showPoems}
      showTimeline={pageData.showTimeline}
      showGallery={pageData.showGallery}
      reasonCardSettings={pageData.reasonCardSettings}
      valentineCardSettings={pageData.valentineCardSettings}
      celebrationSettings={pageData.celebrationSettings}
      rejectionSettings={pageData.rejectionSettings}
      secondRejectionSettings={pageData.secondRejectionSettings}
      virusSettings={pageData.virusSettings}
    />
  );
}
