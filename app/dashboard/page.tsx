"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

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
  show_bucket_list: boolean;
  show_open_when: boolean;
  show_coupons: boolean;
  show_poems: boolean;
  show_timeline: boolean;
  show_gallery: boolean;
  // CTA Card customization
  reason_card_title: string;
  reason_card_subtitle: string;
  reason_card_button: string;
  reason_card_another_button: string;
  valentine_card_label: string;
  valentine_card_question: string;
  valentine_card_yes_text: string;
  valentine_card_no_text: string;
  // Popup/Modal customization
  celebration_title: string;
  celebration_message: string;
  celebration_button: string;
  rejection_title: string;
  rejection_message: string;
  rejection_accept_button: string;
  rejection_reject_button: string;
  second_rejection_title: string;
  second_rejection_message: string;
  second_rejection_accept_button: string;
  second_rejection_reject_button: string;
}

interface GalleryItem {
  id: string;
  src: string;
  caption: string;
  order_index: number;
}

interface TimelineItem {
  id: string;
  label: string;
  title: string;
  description: string;
  image_src: string | null;
  order_index: number;
}

interface ReasonItem {
  id: string;
  text: string;
  order_index: number;
}

interface BucketListItem {
  id: string;
  text: string;
  completed: boolean;
  order_index: number;
}

interface OpenWhenNote {
  id: string;
  type: string;
  title: string;
  message: string;
  icon: string;
  icon_color: string;
}

interface MusicSettings {
  song_url: string;
  song_title: string;
  artist: string;
  album_cover: string;
}

interface CouponItem {
  id: string;
  title: string;
  subtitle: string;
  order_index: number;
}

interface PoemItem {
  id: string;
  title: string;
  content: string;
  order_index: number;
}

// Helper function to convert AudioBuffer to WAV
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferOut = new ArrayBuffer(length);
  const view = new DataView(bufferOut);
  const channels: Float32Array[] = [];
  let sample: number;
  let offset = 0;
  let pos = 0;

  // Write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // Write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (sample < 0 ? sample * 0x8000 : sample * 0x7fff) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++;
  }

  return bufferOut;

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");
  const [saving, setSaving] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>>([]);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<ValentinePage | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  const [timelineForm, setTimelineForm] = useState({ label: "", title: "", description: "", imageSrc: "" });
  const [uploadingTimelineImage, setUploadingTimelineImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineImageInputRef = useRef<HTMLInputElement>(null);
  
  // Reasons state
  const [reasons, setReasons] = useState<ReasonItem[]>([]);
  const [showReasonForm, setShowReasonForm] = useState(false);
  const [editingReason, setEditingReason] = useState<ReasonItem | null>(null);
  const [reasonForm, setReasonForm] = useState({ text: "" });
  
  // Bucket list state
  const [bucketList, setBucketList] = useState<BucketListItem[]>([]);
  const [showBucketForm, setShowBucketForm] = useState(false);
  const [editingBucket, setEditingBucket] = useState<BucketListItem | null>(null);
  const [bucketForm, setBucketForm] = useState({ text: "", completed: false });
  
  // Open when notes state
  const [openWhenNotes, setOpenWhenNotes] = useState<OpenWhenNote[]>([]);
  const [showOpenWhenForm, setShowOpenWhenForm] = useState(false);
  const [editingOpenWhen, setEditingOpenWhen] = useState<OpenWhenNote | null>(null);
  const [openWhenForm, setOpenWhenForm] = useState({ type: "", title: "", message: "", icon: "solar:heart-linear", iconColor: "text-rose-400" });
  
  // AI Generation state
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStyle, setAiStyle] = useState("romantic");
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Music settings state
  const [musicSettings, setMusicSettings] = useState<MusicSettings>({ song_url: "", song_title: "", artist: "", album_cover: "" });
  const [extractingAudio, setExtractingAudio] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Coupons state
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [couponForm, setCouponForm] = useState({ title: "", subtitle: "" });
  
  // Poems state
  const [poems, setPoems] = useState<PoemItem[]>([]);
  const [showPoemForm, setShowPoemForm] = useState(false);
  const [editingPoem, setEditingPoem] = useState<PoemItem | null>(null);
  const [poemForm, setPoemForm] = useState({ title: "", content: "" });
  
  // AI Poem Generation
  const [showAiPoemPopup, setShowAiPoemPopup] = useState(false);
  const [aiPoemPrompt, setAiPoemPrompt] = useState("");
  const [aiPoemStyle, setAiPoemStyle] = useState("romantic");
  const [aiPoemGenerating, setAiPoemGenerating] = useState(false);
  
  // Gallery editing
  const [editingGalleryCaption, setEditingGalleryCaption] = useState<string | null>(null);
  const [galleryCaptionText, setGalleryCaptionText] = useState("");
  
  // Form states
  const [recipientName, setRecipientName] = useState("My Love");
  const [senderName, setSenderName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [heroTitle, setHeroTitle] = useState("To My Everything");
  const [heroSubtitle, setHeroSubtitle] = useState("A little corner of the internet, just for you 💕");
  const [isPublished, setIsPublished] = useState(false);
  
  // Section visibility toggles
  const [showBucketListSection, setShowBucketListSection] = useState(true);
  const [showOpenWhenSection, setShowOpenWhenSection] = useState(true);
  const [showCouponsSection, setShowCouponsSection] = useState(true);
  const [showPoemsSection, setShowPoemsSection] = useState(true);
  const [showTimelineSection, setShowTimelineSection] = useState(true);
  const [showGallerySection, setShowGallerySection] = useState(true);

  // CTA Card customization
  const [reasonCardTitle, setReasonCardTitle] = useState("Why I Love You");
  const [reasonCardSubtitle, setReasonCardSubtitle] = useState("Tap to reveal a reason");
  const [reasonCardButton, setReasonCardButton] = useState("Tell Me Why");
  const [reasonCardAnotherButton, setReasonCardAnotherButton] = useState("Another One");
  const [valentineCardLabel, setValentineCardLabel] = useState("Important");
  const [valentineCardQuestion, setValentineCardQuestion] = useState("Will you be my\nValentine?");
  const [valentineCardYesText, setValentineCardYesText] = useState("Yes, Always");
  const [valentineCardNoText, setValentineCardNoText] = useState("No");

  // Popup/Modal customization
  const [celebrationTitle, setCelebrationTitle] = useState("Yay! ❤️");
  const [celebrationMessage, setCelebrationMessage] = useState("You just made me the happiest person alive. I love you so much!");
  const [celebrationButton, setCelebrationButton] = useState("Can't wait!");
  const [rejectionTitle, setRejectionTitle] = useState("Are you sure?");
  const [rejectionMessage, setRejectionMessage] = useState("My heart might break into a million pieces...");
  const [rejectionAcceptButton, setRejectionAcceptButton] = useState("Yes, I'll be yours");
  const [rejectionRejectButton, setRejectionRejectButton] = useState("Still No");
  const [secondRejectionTitle, setSecondRejectionTitle] = useState("Last Chance!");
  const [secondRejectionMessage, setSecondRejectionMessage] = useState("I'll make you the happiest person, I promise!");
  const [secondRejectionAcceptButton, setSecondRejectionAcceptButton] = useState("Okay, Yes! ❤️");
  const [secondRejectionRejectButton, setSecondRejectionRejectButton] = useState("No 😤");
  // Love Virus Effect settings
  const [virusImages, setVirusImages] = useState<string[]>([]);
  const [virusMessages, setVirusMessages] = useState<string[]>(["I LOVE YOU! 💕", "YOU'RE MINE! 💝", "FOREVER! 💗", "MY BABY! 🥰", "LOCKED IN! 🔐", "NO ESCAPE! 😘"]);
  const [virusFinalTitle, setVirusFinalTitle] = useState("You can't escape my love!");
  const [virusFinalMessage, setVirusFinalMessage] = useState("At this point you don't even have an option, we locked in 😂😂");
  const [virusFinalSubmessage, setVirusFinalSubmessage] = useState("Every moment with you is a treasure. Please be my Valentine? 🥺");
  const [virusFinalButton, setVirusFinalButton] = useState("Fine, YES! I love you too! ❤️");
  const [newVirusMessage, setNewVirusMessage] = useState("");

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
      setShowBucketListSection(pageData.show_bucket_list !== false);
      setShowOpenWhenSection(pageData.show_open_when !== false);
      setShowCouponsSection(pageData.show_coupons !== false);
      setShowPoemsSection(pageData.show_poems !== false);
      setShowTimelineSection(pageData.show_timeline !== false);
      setShowGallerySection(pageData.show_gallery !== false);
      // CTA Card settings
      setReasonCardTitle(pageData.reason_card_title || "Why I Love You");
      setReasonCardSubtitle(pageData.reason_card_subtitle || "Tap to reveal a reason");
      setReasonCardButton(pageData.reason_card_button || "Tell Me Why");
      setReasonCardAnotherButton(pageData.reason_card_another_button || "Another One");
      setValentineCardLabel(pageData.valentine_card_label || "Important");
      setValentineCardQuestion(pageData.valentine_card_question || "Will you be my\nValentine?");
      setValentineCardYesText(pageData.valentine_card_yes_text || "Yes, Always");
      setValentineCardNoText(pageData.valentine_card_no_text || "No");
      // Popup/Modal settings
      setCelebrationTitle(pageData.celebration_title || "Yay! ❤️");
      setCelebrationMessage(pageData.celebration_message || "You just made me the happiest person alive. I love you so much!");
      setCelebrationButton(pageData.celebration_button || "Can't wait!");
      setRejectionTitle(pageData.rejection_title || "Are you sure?");
      setRejectionMessage(pageData.rejection_message || "My heart might break into a million pieces...");
      setRejectionAcceptButton(pageData.rejection_accept_button || "Yes, I'll be yours");
      setRejectionRejectButton(pageData.rejection_reject_button || "Still No");
      setSecondRejectionTitle(pageData.second_rejection_title || "Last Chance!");
      setSecondRejectionMessage(pageData.second_rejection_message || "I'll make you the happiest person, I promise!");
      setSecondRejectionAcceptButton(pageData.second_rejection_accept_button || "Okay, Yes! ❤️");
      setSecondRejectionRejectButton(pageData.second_rejection_reject_button || "No 😤");
      // Virus Effect settings
      setVirusImages(pageData.virus_images || []);
      setVirusMessages(pageData.virus_messages || ["I LOVE YOU! 💕", "YOU'RE MINE! 💝", "FOREVER! 💗", "MY BABY! 🥰", "LOCKED IN! 🔐", "NO ESCAPE! 😘"]);
      setVirusFinalTitle(pageData.virus_final_title || "You can't escape my love!");
      setVirusFinalMessage(pageData.virus_final_message || "At this point you don't even have an option, we locked in 😂😂");
      setVirusFinalSubmessage(pageData.virus_final_submessage || "Every moment with you is a treasure. Please be my Valentine? 🥺");
      setVirusFinalButton(pageData.virus_final_button || "Fine, YES! I love you too! ❤️");
      // Music settings
      setMusicSettings({
        song_url: pageData.song_url || "",
        song_title: pageData.song_title || "Our Song",
        artist: pageData.song_artist || "For Us 💕",
        album_cover: pageData.song_cover || "",
      });

      // Load gallery items
      const { data: galleryData } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("page_id", pageData.id)
        .order("order_index", { ascending: true });

      if (galleryData) {
        setGalleryItems(galleryData);
      }

      // Load timeline items
      const { data: timelineData } = await supabase
        .from("timeline_items")
        .select("*")
        .eq("page_id", pageData.id)
        .order("order_index", { ascending: true });

      if (timelineData) {
        setTimelineItems(timelineData);
      }

      // Load reasons
      const { data: reasonsData } = await supabase
        .from("reasons")
        .select("*")
        .eq("page_id", pageData.id)
        .order("order_index", { ascending: true });

      if (reasonsData) {
        setReasons(reasonsData);
      }

      // Load bucket list
      const { data: bucketData } = await supabase
        .from("bucket_list")
        .select("*")
        .eq("page_id", pageData.id)
        .order("order_index", { ascending: true });

      if (bucketData) {
        setBucketList(bucketData);
      }

      // Load open when notes
      const { data: openWhenData } = await supabase
        .from("open_when_notes")
        .select("*")
        .eq("page_id", pageData.id)
        .order("order_index", { ascending: true });

      if (openWhenData) {
        setOpenWhenNotes(openWhenData);
      }

      // Load poems
      const { data: poemsData } = await supabase
        .from("poems")
        .select("*")
        .eq("page_id", pageData.id)
        .order("order_index", { ascending: true });

      if (poemsData) {
        setPoems(poemsData);
      }
    }

    setLoading(false);
  };

  const handleSaveSettings = async () => {
    if (!page?.id) return;
    
    setSaving(true);

    const { error } = await supabase
      .from("valentine_pages")
      .update({
        recipient_name: recipientName,
        sender_name: senderName,
        start_date: startDate,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        is_published: isPublished,
        show_bucket_list: showBucketListSection,
        show_open_when: showOpenWhenSection,
        show_coupons: showCouponsSection,
        show_poems: showPoemsSection,
        show_timeline: showTimelineSection,
        show_gallery: showGallerySection,
        // CTA Card settings
        reason_card_title: reasonCardTitle,
        reason_card_subtitle: reasonCardSubtitle,
        reason_card_button: reasonCardButton,
        reason_card_another_button: reasonCardAnotherButton,
        valentine_card_label: valentineCardLabel,
        valentine_card_question: valentineCardQuestion,
        valentine_card_yes_text: valentineCardYesText,
        valentine_card_no_text: valentineCardNoText,
        // Popup/Modal settings
        celebration_title: celebrationTitle,
        celebration_message: celebrationMessage,
        celebration_button: celebrationButton,
        rejection_title: rejectionTitle,
        rejection_message: rejectionMessage,
        rejection_accept_button: rejectionAcceptButton,
        rejection_reject_button: rejectionRejectButton,
        second_rejection_title: secondRejectionTitle,
        second_rejection_message: secondRejectionMessage,
        second_rejection_accept_button: secondRejectionAcceptButton,
        second_rejection_reject_button: secondRejectionRejectButton,
        // Virus Effect settings
        virus_images: virusImages,
        virus_messages: virusMessages,
        virus_final_title: virusFinalTitle,
        virus_final_message: virusFinalMessage,
        virus_final_submessage: virusFinalSubmessage,
        virus_final_button: virusFinalButton,
        // Music settings
        song_url: musicSettings.song_url,
        song_title: musicSettings.song_title,
        song_artist: musicSettings.artist,
        song_cover: musicSettings.album_cover,
      })
      .eq("id", page.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Settings saved!");
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
      
    toast.success(newStatus ? "Your page is now live!" : "Page unpublished");
  };

  // Visibility toggle handlers - auto-save to database
  const handleToggleBucketListVisibility = async () => {
    if (!page?.id) return;
    
    const newValue = !showBucketListSection;
    setShowBucketListSection(newValue);
    
    await supabase
      .from("valentine_pages")
      .update({ show_bucket_list: newValue })
      .eq("id", page.id);
      
    toast.success(newValue ? "Bucket list is now visible" : "Bucket list is now hidden");
  };

  const handleToggleOpenWhenVisibility = async () => {
    if (!page?.id) return;
    
    const newValue = !showOpenWhenSection;
    setShowOpenWhenSection(newValue);
    
    await supabase
      .from("valentine_pages")
      .update({ show_open_when: newValue })
      .eq("id", page.id);
      
    toast.success(newValue ? "Love letters are now visible" : "Love letters are now hidden");
  };

  const handleToggleCouponsVisibility = async () => {
    if (!page?.id) return;
    
    const newValue = !showCouponsSection;
    setShowCouponsSection(newValue);
    
    await supabase
      .from("valentine_pages")
      .update({ show_coupons: newValue })
      .eq("id", page.id);
      
    toast.success(newValue ? "Coupons are now visible" : "Coupons are now hidden");
  };

  const handleTogglePoemsVisibility = async () => {
    if (!page?.id) return;
    
    const newValue = !showPoemsSection;
    setShowPoemsSection(newValue);
    
    await supabase
      .from("valentine_pages")
      .update({ show_poems: newValue })
      .eq("id", page.id);
      
    toast.success(newValue ? "Poems are now visible" : "Poems are now hidden");
  };

  const handleToggleTimelineVisibility = async () => {
    if (!page?.id) return;
    
    const newValue = !showTimelineSection;
    setShowTimelineSection(newValue);
    
    await supabase
      .from("valentine_pages")
      .update({ show_timeline: newValue })
      .eq("id", page.id);
      
    toast.success(newValue ? "Timeline is now visible" : "Timeline is now hidden");
  };

  const handleToggleGalleryVisibility = async () => {
    if (!page?.id) return;
    
    const newValue = !showGallerySection;
    setShowGallerySection(newValue);
    
    await supabase
      .from("valentine_pages")
      .update({ show_gallery: newValue })
      .eq("id", page.id);
      
    toast.success(newValue ? "Gallery is now visible" : "Gallery is now hidden");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !page?.id || !profile?.id) return;

    setUploadingPhoto(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are allowed");
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image must be less than 5MB");
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${profile.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload image");
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(fileName);

        // Save to gallery_items table
        const { data: newItem, error: dbError } = await supabase
          .from("gallery_items")
          .insert({
            page_id: page.id,
            src: urlData.publicUrl,
            caption: "",
            order_index: galleryItems.length,
          })
          .select()
          .single();

        if (dbError) {
          console.error("DB error:", dbError);
          toast.error("Failed to save image");
          continue;
        }

        if (newItem) {
          setGalleryItems((prev) => [...prev, newItem]);
        }
      }

      toast.success("Photo(s) uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    }

    setUploadingPhoto(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async (item: GalleryItem) => {
    if (!confirm("Delete this photo?")) return;

    try {
      // Extract file path from URL
      const url = new URL(item.src);
      const pathParts = url.pathname.split("/gallery/");
      const filePath = pathParts[1];

      // Delete from storage
      if (filePath) {
        await supabase.storage.from("gallery").remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", item.id);

      if (error) {
        toast.error("Failed to delete photo");
        return;
      }

      // Update local state
      setGalleryItems((prev) => prev.filter((g) => g.id !== item.id));
      toast.success("Photo deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete photo");
    }
  };

  // Timeline handlers
  const handleTimelineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingTimelineImage(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}/timeline-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (uploadError) {
        toast.error("Failed to upload image");
        setUploadingTimelineImage(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      setTimelineForm({ ...timelineForm, imageSrc: urlData.publicUrl });
    } catch {
      toast.error("Upload failed");
    }

    setUploadingTimelineImage(false);
    if (timelineImageInputRef.current) {
      timelineImageInputRef.current.value = "";
    }
  };

  const handleAddTimeline = async () => {
    if (!page?.id || !timelineForm.label || !timelineForm.title) {
      toast.error("Please fill in label and title");
      return;
    }

    setSaving(true);
    
    const { data: newItem, error } = await supabase
      .from("timeline_items")
      .insert({
        page_id: page.id,
        label: timelineForm.label,
        title: timelineForm.title,
        description: timelineForm.description,
        image_src: timelineForm.imageSrc || null,
        order_index: timelineItems.length,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add timeline item");
    } else if (newItem) {
      setTimelineItems((prev) => [...prev, newItem]);
      setTimelineForm({ label: "", title: "", description: "", imageSrc: "" });
      setShowTimelineForm(false);
      toast.success("Memory added!");
    }
    
    setSaving(false);
  };

  const handleEditTimeline = async () => {
    if (!editingTimeline) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from("timeline_items")
      .update({
        label: timelineForm.label,
        title: timelineForm.title,
        description: timelineForm.description,
        image_src: timelineForm.imageSrc || null,
      })
      .eq("id", editingTimeline.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setTimelineItems((prev) =>
        prev.map((item) =>
          item.id === editingTimeline.id
            ? { ...item, label: timelineForm.label, title: timelineForm.title, description: timelineForm.description, image_src: timelineForm.imageSrc || null }
            : item
        )
      );
      setEditingTimeline(null);
      setTimelineForm({ label: "", title: "", description: "", imageSrc: "" });
      toast.success("Memory updated!");
    }
    
    setSaving(false);
  };

  const handleDeleteTimeline = async (item: TimelineItem) => {
    if (!confirm("Delete this memory?")) return;

    const { error } = await supabase
      .from("timeline_items")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      setTimelineItems((prev) => prev.filter((t) => t.id !== item.id));
      toast.success("Memory deleted");
    }
  };

  const startEditTimeline = (item: TimelineItem) => {
    setEditingTimeline(item);
    setTimelineForm({ label: item.label, title: item.title, description: item.description, imageSrc: item.image_src || "" });
    setShowTimelineForm(true);
  };

  const cancelTimelineForm = () => {
    setShowTimelineForm(false);
    setEditingTimeline(null);
    setTimelineForm({ label: "", title: "", description: "", imageSrc: "" });
  };

  // Reasons handlers
  const handleAddReason = async () => {
    if (!page?.id || !reasonForm.text.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    setSaving(true);
    
    const { data: newItem, error } = await supabase
      .from("reasons")
      .insert({
        page_id: page.id,
        text: reasonForm.text.trim(),
        order_index: reasons.length,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add reason");
    } else if (newItem) {
      setReasons((prev) => [...prev, newItem]);
      setReasonForm({ text: "" });
      setShowReasonForm(false);
      toast.success("Reason added!");
    }
    
    setSaving(false);
  };

  const handleEditReason = async () => {
    if (!editingReason) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from("reasons")
      .update({ text: reasonForm.text.trim() })
      .eq("id", editingReason.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setReasons((prev) =>
        prev.map((item) =>
          item.id === editingReason.id ? { ...item, text: reasonForm.text.trim() } : item
        )
      );
      setEditingReason(null);
      setReasonForm({ text: "" });
      setShowReasonForm(false);
      toast.success("Reason updated!");
    }
    
    setSaving(false);
  };

  const handleDeleteReason = async (item: ReasonItem) => {
    if (!confirm("Delete this reason?")) return;

    const { error } = await supabase
      .from("reasons")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      setReasons((prev) => prev.filter((r) => r.id !== item.id));
      toast.success("Reason deleted");
    }
  };

  const startEditReason = (item: ReasonItem) => {
    setEditingReason(item);
    setReasonForm({ text: item.text });
    setShowReasonForm(true);
  };

  const cancelReasonForm = () => {
    setShowReasonForm(false);
    setEditingReason(null);
    setReasonForm({ text: "" });
  };

  // Bucket list handlers
  const handleAddBucketItem = async () => {
    if (!page?.id || !bucketForm.text.trim()) {
      toast.error("Please enter a bucket list item");
      return;
    }

    setSaving(true);
    
    const { data: newItem, error } = await supabase
      .from("bucket_list")
      .insert({
        page_id: page.id,
        text: bucketForm.text.trim(),
        completed: bucketForm.completed,
        order_index: bucketList.length,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add item");
    } else if (newItem) {
      setBucketList((prev) => [...prev, newItem]);
      setBucketForm({ text: "", completed: false });
      setShowBucketForm(false);
      toast.success("Bucket list item added!");
    }
    
    setSaving(false);
  };

  const handleEditBucketItem = async () => {
    if (!editingBucket) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from("bucket_list")
      .update({ 
        text: bucketForm.text.trim(),
        completed: bucketForm.completed 
      })
      .eq("id", editingBucket.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setBucketList((prev) =>
        prev.map((item) =>
          item.id === editingBucket.id 
            ? { ...item, text: bucketForm.text.trim(), completed: bucketForm.completed } 
            : item
        )
      );
      setEditingBucket(null);
      setBucketForm({ text: "", completed: false });
      setShowBucketForm(false);
      toast.success("Item updated!");
    }
    
    setSaving(false);
  };

  const handleDeleteBucketItem = async (item: BucketListItem) => {
    if (!confirm("Delete this item?")) return;

    const { error } = await supabase
      .from("bucket_list")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      setBucketList((prev) => prev.filter((b) => b.id !== item.id));
      toast.success("Item deleted");
    }
  };

  const handleToggleBucketComplete = async (item: BucketListItem) => {
    const newCompleted = !item.completed;
    
    const { error } = await supabase
      .from("bucket_list")
      .update({ completed: newCompleted })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setBucketList((prev) =>
        prev.map((b) => b.id === item.id ? { ...b, completed: newCompleted } : b)
      );
    }
  };

  const startEditBucketItem = (item: BucketListItem) => {
    setEditingBucket(item);
    setBucketForm({ text: item.text, completed: item.completed });
    setShowBucketForm(true);
  };

  const cancelBucketForm = () => {
    setShowBucketForm(false);
    setEditingBucket(null);
    setBucketForm({ text: "", completed: false });
  };

  // Open When Notes handlers
  const handleAddOpenWhen = async () => {
    if (!page?.id || !openWhenForm.title.trim() || !openWhenForm.message.trim()) {
      toast.error("Please fill in title and message");
      return;
    }

    setSaving(true);
    
    const { data: newItem, error } = await supabase
      .from("open_when_notes")
      .insert({
        page_id: page.id,
        type: openWhenForm.type || openWhenForm.title.toLowerCase().replace(/\s+/g, '-'),
        title: openWhenForm.title.trim(),
        message: openWhenForm.message.trim(),
        icon: openWhenForm.icon,
        icon_color: openWhenForm.iconColor,
        order_index: openWhenNotes.length,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add love letter");
    } else if (newItem) {
      setOpenWhenNotes((prev) => [...prev, newItem]);
      setOpenWhenForm({ type: "", title: "", message: "", icon: "solar:heart-linear", iconColor: "text-rose-400" });
      setShowOpenWhenForm(false);
      toast.success("Love letter added!");
    }
    
    setSaving(false);
  };

  const handleEditOpenWhen = async () => {
    if (!editingOpenWhen) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from("open_when_notes")
      .update({
        title: openWhenForm.title.trim(),
        message: openWhenForm.message.trim(),
        icon: openWhenForm.icon,
        icon_color: openWhenForm.iconColor,
      })
      .eq("id", editingOpenWhen.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setOpenWhenNotes((prev) =>
        prev.map((item) =>
          item.id === editingOpenWhen.id
            ? { ...item, title: openWhenForm.title.trim(), message: openWhenForm.message.trim(), icon: openWhenForm.icon, icon_color: openWhenForm.iconColor }
            : item
        )
      );
      setEditingOpenWhen(null);
      setOpenWhenForm({ type: "", title: "", message: "", icon: "solar:heart-linear", iconColor: "text-rose-400" });
      setShowOpenWhenForm(false);
      toast.success("Love letter updated!");
    }
    
    setSaving(false);
  };

  const handleDeleteOpenWhen = async (item: OpenWhenNote) => {
    if (!confirm("Delete this love letter?")) return;

    const { error } = await supabase
      .from("open_when_notes")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      setOpenWhenNotes((prev) => prev.filter((n) => n.id !== item.id));
      toast.success("Love letter deleted");
    }
  };

  const startEditOpenWhen = (item: OpenWhenNote) => {
    setEditingOpenWhen(item);
    setOpenWhenForm({ type: item.type, title: item.title, message: item.message, icon: item.icon, iconColor: item.icon_color });
    setShowOpenWhenForm(true);
  };

  const cancelOpenWhenForm = () => {
    setShowOpenWhenForm(false);
    setEditingOpenWhen(null);
    setOpenWhenForm({ type: "", title: "", message: "", icon: "solar:heart-linear", iconColor: "text-rose-400" });
  };

  // AI Love Letter Generator
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a vibe or context");
      return;
    }
    
    setAiGenerating(true);
    try {
      const response = await fetch("/api/generate-love-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, style: aiStyle }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.error || "Failed to generate");
        return;
      }
      
      // Insert generated message into the form
      setOpenWhenForm({ ...openWhenForm, message: data.message });
      setShowAiPopup(false);
      setAiPrompt("");
      toast.success("✨ Love letter generated!");
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Poem CRUD handlers
  const handleAddPoem = async () => {
    if (!page?.id || !poemForm.title.trim() || !poemForm.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from("poems")
      .insert({
        page_id: page.id,
        title: poemForm.title.trim(),
        content: poemForm.content.trim(),
        order_index: poems.length,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add poem");
    } else if (data) {
      setPoems([...poems, data]);
      setPoemForm({ title: "", content: "" });
      setShowPoemForm(false);
      toast.success("Poem added!");
    }
    setSaving(false);
  };

  const handleEditPoem = async () => {
    if (!editingPoem || !poemForm.title.trim() || !poemForm.content.trim()) return;

    setSaving(true);
    const { error } = await supabase
      .from("poems")
      .update({
        title: poemForm.title.trim(),
        content: poemForm.content.trim(),
      })
      .eq("id", editingPoem.id);

    if (error) {
      toast.error("Failed to update poem");
    } else {
      setPoems((prev) =>
        prev.map((item) =>
          item.id === editingPoem.id
            ? { ...item, title: poemForm.title.trim(), content: poemForm.content.trim() }
            : item
        )
      );
      setPoemForm({ title: "", content: "" });
      setShowPoemForm(false);
      setEditingPoem(null);
      toast.success("Poem updated!");
    }
    setSaving(false);
  };

  const handleDeletePoem = async (item: PoemItem) => {
    if (!confirm("Delete this poem?")) return;

    const { error } = await supabase.from("poems").delete().eq("id", item.id);
    if (error) {
      toast.error("Failed to delete poem");
    } else {
      setPoems((prev) => prev.filter((p) => p.id !== item.id));
      toast.success("Poem deleted!");
    }
  };

  const startEditPoem = (item: PoemItem) => {
    setEditingPoem(item);
    setPoemForm({ title: item.title, content: item.content });
    setShowPoemForm(true);
  };

  const cancelPoemForm = () => {
    setShowPoemForm(false);
    setEditingPoem(null);
    setPoemForm({ title: "", content: "" });
  };

  // AI Poem Generator
  const handleGeneratePoemWithAI = async () => {
    if (!aiPoemPrompt.trim()) {
      toast.error("Please enter a vibe or theme");
      return;
    }
    
    setAiPoemGenerating(true);
    try {
      const response = await fetch("/api/generate-poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPoemPrompt, style: aiPoemStyle }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.error || "Failed to generate");
        return;
      }
      
      // Insert generated content into the form
      setPoemForm({ ...poemForm, content: data.poem });
      setShowAiPoemPopup(false);
      setAiPoemPrompt("");
      toast.success("✨ Poem generated!");
    } catch (error) {
      console.error("AI poem generation error:", error);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setAiPoemGenerating(false);
    }
  };

  // Gallery caption handler
  const handleUpdateCaption = async (item: GalleryItem) => {
    if (galleryCaptionText === item.caption) {
      setEditingGalleryCaption(null);
      return;
    }

    const { error } = await supabase
      .from("gallery_items")
      .update({ caption: galleryCaptionText })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update caption");
    } else {
      setGalleryItems((prev) =>
        prev.map((g) => g.id === item.id ? { ...g, caption: galleryCaptionText } : g)
      );
      toast.success("Caption updated!");
    }
    setEditingGalleryCaption(null);
  };

  const startEditCaption = (item: GalleryItem) => {
    setEditingGalleryCaption(item.id);
    setGalleryCaptionText(item.caption || "");
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 overflow-x-hidden">
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

        {/* Main Content - Forms Left, Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Forms */}
          <div className="min-w-0">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {[
                { id: "settings", label: "⚙️ Settings" },
                { id: "music", label: "🎵 Music" },
                { id: "gallery", label: "📸 Gallery" },
                { id: "timeline", label: "📅 Timeline" },
                { id: "reasons", label: "💕 Reasons" },
                { id: "poems", label: "📖 Poems" },
                { id: "bucketlist", label: "📝 Bucket List" },
                { id: "openwhen", label: "💌 Open When" },
                { id: "coupons", label: "🎟️ Coupons" },
                { id: "ctacards", label: "💝 CTA Cards" },
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

              {/* Music Tab */}
              {activeTab === "music" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-2">🎵 Our Song</h2>
                    <p className="text-rose-200/70 text-sm mb-6">
                      Upload a video with music and we&apos;ll extract the audio to use as your song.
                    </p>
                  </div>

                  {/* Current Song Info */}
                  {musicSettings.song_url && (
                    <div className="bg-rose-900/30 rounded-xl p-4 border border-rose-800/30">
                      <p className="text-white font-medium mb-2">Current Song</p>
                      <div className="flex items-center gap-4">
                        {musicSettings.album_cover && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image src={musicSettings.album_cover} alt="Album cover" fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{musicSettings.song_title || "Our Song"}</p>
                          <p className="text-rose-200/70 text-sm">{musicSettings.artist || "For Us 💕"}</p>
                        </div>
                        <audio src={musicSettings.song_url} controls className="h-10" />
                      </div>
                    </div>
                  )}

                  {/* Upload Video */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-white font-medium mb-4">Upload Your Song</h3>
                    <p className="text-rose-200/60 text-sm mb-4">
                      Upload an audio file (MP3, WAV, etc.) or a video file and we&apos;ll extract the audio.
                    </p>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="audio/*,video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file && page) {
                          setExtractingAudio(true);
                          try {
                            // Check if it's an audio or video file
                            const isVideo = file.type.startsWith("video/");
                            
                            if (isVideo) {
                              // Extract audio from video using browser API
                              const video = document.createElement("video");
                              video.src = URL.createObjectURL(file);
                              await new Promise((resolve) => {
                                video.onloadedmetadata = resolve;
                              });

                              // Create audio context to process
                              const audioContext = new AudioContext();
                              const response = await fetch(video.src);
                              const arrayBuffer = await response.arrayBuffer();
                              const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                              
                              // Convert to WAV
                              const wavBuffer = audioBufferToWav(audioBuffer);
                              const audioBlob = new Blob([wavBuffer], { type: "audio/wav" });
                              
                              const formData = new FormData();
                              formData.append("audio", audioBlob, "audio.wav");
                              formData.append("pageId", page.id);

                              const uploadResponse = await fetch("/api/extract-audio", {
                                method: "POST",
                                body: formData,
                              });

                              const data = await uploadResponse.json();
                              if (data.success) {
                                setMusicSettings({
                                  ...musicSettings,
                                  song_url: data.audioUrl,
                                });
                                toast.success("Audio extracted successfully!");
                              } else {
                                throw new Error(data.error);
                              }
                              
                              URL.revokeObjectURL(video.src);
                            } else {
                              // Direct audio upload
                              const formData = new FormData();
                              formData.append("audio", file);
                              formData.append("pageId", page.id);

                              const uploadResponse = await fetch("/api/extract-audio", {
                                method: "POST",
                                body: formData,
                              });

                              const data = await uploadResponse.json();
                              if (data.success) {
                                setMusicSettings({
                                  ...musicSettings,
                                  song_url: data.audioUrl,
                                });
                                toast.success("Song uploaded successfully!");
                              } else {
                                throw new Error(data.error);
                              }
                            }
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : "Failed to upload audio");
                          } finally {
                            setExtractingAudio(false);
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => videoInputRef.current?.click()}
                      disabled={extractingAudio}
                      className="w-full py-4 border-2 border-dashed border-white/30 rounded-xl text-white/70 hover:border-white/50 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      {extractingAudio ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">🎵</span>
                          Click to upload audio or video
                        </>
                      )}
                    </button>
                    <p className="text-rose-200/50 text-xs mt-2 text-center">
                      Supported: MP3, WAV, MP4, MOV, WebM, etc.
                    </p>
                  </div>

                  {/* Song Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-rose-100 mb-2">Song Title</label>
                      <input
                        type="text"
                        value={musicSettings.song_title}
                        onChange={(e) => setMusicSettings({ ...musicSettings, song_title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Our Song"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-rose-100 mb-2">Artist / Dedicated To</label>
                      <input
                        type="text"
                        value={musicSettings.artist}
                        onChange={(e) => setMusicSettings({ ...musicSettings, artist: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="For Us 💕"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-rose-100 mb-2">Album Cover</label>
                      <div className="flex gap-4">
                        {musicSettings.album_cover && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <Image src={musicSettings.album_cover} alt="Cover" fill className="object-cover" />
                            <button
                              onClick={() => setMusicSettings({ ...musicSettings, album_cover: "" })}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file && page) {
                              setUploadingCover(true);
                              try {
                                const ext = file.name.split(".").pop();
                                const fileName = `${page.id}/album-cover-${Date.now()}.${ext}`;
                                const { error } = await supabase.storage
                                  .from("gallery")
                                  .upload(fileName, file);
                                if (!error) {
                                  const { data: { publicUrl } } = supabase.storage
                                    .from("gallery")
                                    .getPublicUrl(fileName);
                                  setMusicSettings({ ...musicSettings, album_cover: publicUrl });
                                }
                              } finally {
                                setUploadingCover(false);
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => coverInputRef.current?.click()}
                          disabled={uploadingCover}
                          className="flex-1 py-4 border-2 border-dashed border-white/30 rounded-xl text-white/70 hover:border-white/50 hover:text-white transition-all"
                        >
                          {uploadingCover ? "Uploading..." : "📷 Upload Cover Image"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "💾 Save Music Settings"}
                  </button>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Photo Gallery</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleGalleryVisibility}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          showGallerySection
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {showGallerySection ? "👁️ Visible" : "🚫 Hidden"}
                      </button>
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className={`bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all cursor-pointer inline-block ${
                            uploadingPhoto ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {uploadingPhoto ? "Uploading..." : "+ Add Photo"}
                        </label>
                      </div>
                    </div>
                  </div>

                  {!showGallerySection && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-sm">
                      ⚠️ Gallery is currently hidden from your public page. Click the button above to make it visible.
                    </div>
                  )}
                  
                  {galleryItems.length === 0 ? (
                    <div className="text-center py-12 text-rose-100/70">
                      <p className="text-4xl mb-4">📸</p>
                      <p>No photos yet. Add your first memory!</p>
                      <p className="text-sm mt-2 text-rose-100/50">
                        Upload up to 5MB per image
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="relative group rounded-xl overflow-hidden bg-white/10"
                        >
                          <div className="aspect-square relative">
                            <Image
                              src={item.src}
                              alt={item.caption || "Gallery photo"}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => startEditCaption(item)}
                                className="bg-white text-rose-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors"
                              >
                                ✏️ Caption
                              </button>
                              <button
                                onClick={() => handleDeletePhoto(item)}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          {/* Caption editing */}
                          {editingGalleryCaption === item.id ? (
                            <div className="p-2 bg-white/5">
                              <input
                                type="text"
                                value={galleryCaptionText}
                                onChange={(e) => setGalleryCaptionText(e.target.value)}
                                className="w-full px-2 py-1 text-xs rounded bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                                placeholder="Add a caption..."
                                autoFocus
                              />
                              <div className="flex gap-1 mt-1">
                                <button
                                  onClick={() => handleUpdateCaption(item)}
                                  className="flex-1 text-xs bg-white text-rose-600 py-1 rounded font-medium hover:bg-rose-50"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingGalleryCaption(null)}
                                  className="flex-1 text-xs bg-white/10 text-white py-1 rounded font-medium hover:bg-white/20"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : item.caption ? (
                            <div className="p-2 bg-white/5">
                              <p className="text-xs text-rose-100/80 truncate">{item.caption}</p>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-rose-100/50">
                    {galleryItems.length} photo{galleryItems.length !== 1 ? "s" : ""} uploaded
                  </p>
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Your Story Timeline</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleTimelineVisibility}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          showTimelineSection
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {showTimelineSection ? "👁️ Visible" : "🚫 Hidden"}
                      </button>
                      {!showTimelineForm && (
                        <button 
                          onClick={() => setShowTimelineForm(true)}
                          className="bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all"
                        >
                          + Add Memory
                        </button>
                      )}
                    </div>
                  </div>

                  {!showTimelineSection && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-sm">
                      ⚠️ Timeline is currently hidden from your public page. Click the button above to make it visible.
                    </div>
                  )}

                  {/* Add/Edit Form */}
                  {showTimelineForm && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-4 border border-white/10">
                      <h3 className="text-white font-medium">
                        {editingTimeline ? "Edit Memory" : "Add New Memory"}
                      </h3>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Label (e.g., &quot;First Date&quot;)</label>
                        <input
                          type="text"
                          value={timelineForm.label}
                          onChange={(e) => setTimelineForm({ ...timelineForm, label: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="First Date"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Title</label>
                        <input
                          type="text"
                          value={timelineForm.title}
                          onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="The Day Everything Changed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Description</label>
                        <textarea
                          value={timelineForm.description}
                          onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                          rows={3}
                          placeholder="Tell the story of this moment..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Photo (optional)</label>
                        <div className="flex items-center gap-3">
                          {timelineForm.imageSrc ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <Image
                                src={timelineForm.imageSrc}
                                alt="Timeline photo"
                                fill
                                className="object-cover"
                              />
                              <button
                                onClick={() => setTimelineForm({ ...timelineForm, imageSrc: "" })}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <>
                              <input
                                ref={timelineImageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleTimelineImageUpload}
                                className="hidden"
                                id="timeline-image-upload"
                              />
                              <label
                                htmlFor="timeline-image-upload"
                                className={`px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm cursor-pointer hover:bg-white/20 transition-all ${
                                  uploadingTimelineImage ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              >
                                {uploadingTimelineImage ? "Uploading..." : "📷 Add Photo"}
                              </label>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-rose-100/50 mt-1">Max 5MB</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={editingTimeline ? handleEditTimeline : handleAddTimeline}
                          disabled={saving || uploadingTimelineImage}
                          className="flex-1 bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all disabled:opacity-50"
                        >
                          {saving ? "Saving..." : editingTimeline ? "Update" : "Add Memory"}
                        </button>
                        <button
                          onClick={cancelTimelineForm}
                          className="px-4 py-2 rounded-xl font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {timelineItems.length === 0 && !showTimelineForm ? (
                    <div className="text-center py-12 text-rose-100/70">
                      <p className="text-4xl mb-4">📅</p>
                      <p>No timeline items yet. Tell your love story!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timelineItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-white/5 rounded-xl p-4 border border-white/10 group"
                        >
                          <div className="flex items-start gap-3">
                            {item.image_src && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image_src}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-rose-300 text-xs font-mono">{item.label}</span>
                                <span className="text-white/30 text-xs">#{index + 1}</span>
                              </div>
                              <h4 className="text-white font-medium">{item.title}</h4>
                              {item.description && (
                                <p className="text-rose-100/60 text-sm mt-1 line-clamp-2">{item.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => startEditTimeline(item)}
                                className="text-white/70 hover:text-white text-sm"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteTimeline(item)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-rose-100/50">
                    {timelineItems.length} memor{timelineItems.length !== 1 ? "ies" : "y"} in your story
                  </p>
                </div>
              )}

              {activeTab === "reasons" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Reasons I Love You</h2>
                    {!showReasonForm && (
                      <button 
                        onClick={() => setShowReasonForm(true)}
                        className="bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all"
                      >
                        + Add Reason
                      </button>
                    )}
                  </div>

                  {/* Add/Edit Form */}
                  {showReasonForm && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-4 border border-white/10">
                      <h3 className="text-white font-medium">
                        {editingReason ? "Edit Reason" : "Add New Reason"}
                      </h3>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Why do you love them?</label>
                        <textarea
                          value={reasonForm.text}
                          onChange={(e) => setReasonForm({ text: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                          rows={3}
                          placeholder="Their smile lights up the room..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={editingReason ? handleEditReason : handleAddReason}
                          disabled={saving}
                          className="flex-1 bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all disabled:opacity-50"
                        >
                          {saving ? "Saving..." : editingReason ? "Update" : "Add Reason"}
                        </button>
                        <button
                          onClick={cancelReasonForm}
                          className="px-4 py-2 rounded-xl font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {reasons.length === 0 && !showReasonForm ? (
                    <div className="text-center py-12 text-rose-100/70">
                      <p className="text-4xl mb-4">💕</p>
                      <p>No reasons yet. Share why you love them!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reasons.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-white/5 rounded-xl p-4 border border-white/10 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-rose-300 text-xs">💕 Reason #{index + 1}</span>
                              </div>
                              <p className="text-white">{item.text}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => startEditReason(item)}
                                className="text-white/70 hover:text-white text-sm"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteReason(item)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-rose-100/50">
                    {reasons.length} reason{reasons.length !== 1 ? "s" : ""} why you love them
                  </p>
                </div>
              )}

              {activeTab === "poems" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Love Poems (Book)</h2>
                    <div className="flex items-center gap-3">
                      {/* Visibility Toggle */}
                      <button
                        onClick={handleTogglePoemsVisibility}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          showPoemsSection
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "bg-red-500/20 text-red-300 border border-red-400/30"
                        }`}
                      >
                        {showPoemsSection ? "👁️ Visible" : "🚫 Hidden"}
                      </button>
                      {!showPoemForm && (
                        <button 
                          onClick={() => setShowPoemForm(true)}
                          className="bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all"
                        >
                          + Add Poem
                        </button>
                      )}
                    </div>
                  </div>

                  {!showPoemsSection && (
                    <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-3 text-yellow-200 text-sm">
                      ⚠️ This section is hidden on your page. Toggle visibility above to show it.
                    </div>
                  )}

                  {/* Add/Edit Form */}
                  {showPoemForm && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-4 border border-white/10">
                      <h3 className="text-white font-medium">
                        {editingPoem ? "Edit Poem" : "Add New Poem"}
                      </h3>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Poem Title</label>
                        <input
                          type="text"
                          value={poemForm.title}
                          onChange={(e) => setPoemForm({ ...poemForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="e.g., Forever Yours, My Heart..."
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm text-rose-100">Poem Content</label>
                          <button
                            type="button"
                            onClick={() => setShowAiPoemPopup(true)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-200 text-xs font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                          >
                            ✨ Generate with AI
                          </button>
                        </div>
                        <textarea
                          value={poemForm.content}
                          onChange={(e) => setPoemForm({ ...poemForm, content: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none font-mono text-sm"
                          rows={8}
                          placeholder="Write your poem here...&#10;Each line on a new row&#10;&#10;Leave empty lines for stanza breaks"
                        />
                        <p className="text-xs text-rose-100/50 mt-1">
                          Tip: Each line becomes a verse. Empty lines create stanza breaks.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={editingPoem ? handleEditPoem : handleAddPoem}
                          disabled={saving}
                          className="flex-1 bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all disabled:opacity-50"
                        >
                          {saving ? "Saving..." : editingPoem ? "Update" : "Add Poem"}
                        </button>
                        <button
                          onClick={cancelPoemForm}
                          className="px-4 py-2 rounded-xl font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {poems.length === 0 && !showPoemForm ? (
                    <div className="text-center py-12 text-rose-100/70">
                      <p className="text-4xl mb-4">📖</p>
                      <p>No poems yet. Add your first love poem!</p>
                      <p className="text-sm mt-2 text-rose-100/50">
                        These appear in the flip book on your page
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {poems.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-white/5 rounded-xl p-4 border border-white/10 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-rose-300 text-xs">📖 Page {index + 1}</span>
                              </div>
                              <h4 className="text-white font-medium">{item.title}</h4>
                              <p className="text-rose-100/60 text-sm mt-1 line-clamp-3 whitespace-pre-wrap">{item.content}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => startEditPoem(item)}
                                className="text-white/70 hover:text-white text-sm"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeletePoem(item)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-rose-100/50">
                    {poems.length} poem{poems.length !== 1 ? "s" : ""} in your book
                  </p>
                </div>
              )}

              {activeTab === "bucketlist" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Bucket List</h2>
                    <div className="flex items-center gap-3">
                      {/* Visibility Toggle */}
                      <button
                        onClick={handleToggleBucketListVisibility}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          showBucketListSection
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "bg-red-500/20 text-red-300 border border-red-400/30"
                        }`}
                      >
                        {showBucketListSection ? "👁️ Visible" : "🚫 Hidden"}
                      </button>
                      {!showBucketForm && (
                        <button 
                          onClick={() => setShowBucketForm(true)}
                          className="bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all"
                        >
                          + Add Item
                        </button>
                      )}
                    </div>
                  </div>

                  {!showBucketListSection && (
                    <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-3 text-yellow-200 text-sm">
                      ⚠️ This section is hidden on your page. Toggle visibility above to show it.
                    </div>
                  )}

                  {/* Add/Edit Form */}
                  {showBucketForm && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-4 border border-white/10">
                      <h3 className="text-white font-medium">
                        {editingBucket ? "Edit Item" : "Add New Item"}
                      </h3>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">What&apos;s on your bucket list?</label>
                        <input
                          type="text"
                          value={bucketForm.text}
                          onChange={(e) => setBucketForm({ ...bucketForm, text: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="Travel to Paris together..."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="bucket-completed"
                          checked={bucketForm.completed}
                          onChange={(e) => setBucketForm({ ...bucketForm, completed: e.target.checked })}
                          className="w-4 h-4 rounded border-white/20 bg-white/10 text-rose-500 focus:ring-rose-500"
                        />
                        <label htmlFor="bucket-completed" className="text-sm text-rose-100">
                          Already completed? ✅
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={editingBucket ? handleEditBucketItem : handleAddBucketItem}
                          disabled={saving}
                          className="flex-1 bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all disabled:opacity-50"
                        >
                          {saving ? "Saving..." : editingBucket ? "Update" : "Add Item"}
                        </button>
                        <button
                          onClick={cancelBucketForm}
                          className="px-4 py-2 rounded-xl font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {bucketList.length === 0 && !showBucketForm ? (
                    <div className="text-center py-12 text-rose-100/70">
                      <p className="text-4xl mb-4">📝</p>
                      <p>No bucket list items yet. Add your dreams together!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bucketList.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-white/5 rounded-xl p-4 border border-white/10 group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Checkbox to toggle complete */}
                            <button
                              onClick={() => handleToggleBucketComplete(item)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                item.completed
                                  ? "bg-green-500 text-white"
                                  : "border-2 border-white/30 hover:border-white/50"
                              }`}
                            >
                              {item.completed && <span className="text-xs">✓</span>}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-rose-300 text-xs">#{index + 1}</span>
                                {item.completed && (
                                  <span className="text-green-400 text-xs">✓ Done!</span>
                                )}
                              </div>
                              <p className={`text-white ${item.completed ? "line-through text-white/50" : ""}`}>
                                {item.text}
                              </p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => startEditBucketItem(item)}
                                className="text-white/70 hover:text-white text-sm"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteBucketItem(item)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-rose-100/50">
                    {bucketList.length} item{bucketList.length !== 1 ? "s" : ""} on your list
                    {bucketList.filter(b => b.completed).length > 0 && (
                      <span className="text-green-400 ml-2">
                        • {bucketList.filter(b => b.completed).length} completed!
                      </span>
                    )}
                  </p>
                  
                  <p className="text-xs text-rose-100/40 mt-4">
                    💡 Remember to save settings to apply visibility changes
                  </p>
                </div>
              )}

              {activeTab === "openwhen" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Love Letters (Open When...)</h2>
                    <div className="flex items-center gap-3">
                      {/* Visibility Toggle */}
                      <button
                        onClick={handleToggleOpenWhenVisibility}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          showOpenWhenSection
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "bg-red-500/20 text-red-300 border border-red-400/30"
                        }`}
                      >
                        {showOpenWhenSection ? "👁️ Visible" : "🚫 Hidden"}
                      </button>
                      {!showOpenWhenForm && (
                        <button 
                          onClick={() => setShowOpenWhenForm(true)}
                          className="bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all"
                        >
                          + Add Letter
                        </button>
                      )}
                    </div>
                  </div>

                  {!showOpenWhenSection && (
                    <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-3 text-yellow-200 text-sm">
                      ⚠️ This section is hidden on your page. Toggle visibility above to show it.
                    </div>
                  )}

                  {/* Add/Edit Form */}
                  {showOpenWhenForm && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-4 border border-white/10">
                      <h3 className="text-white font-medium">
                        {editingOpenWhen ? "Edit Love Letter" : "Add New Love Letter"}
                      </h3>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Envelope Title (e.g., &quot;You&apos;re Mad&quot;)</label>
                        <input
                          type="text"
                          value={openWhenForm.title}
                          onChange={(e) => setOpenWhenForm({ ...openWhenForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="Open When You're Sad"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm text-rose-100">Message Inside</label>
                          <button
                            type="button"
                            onClick={() => setShowAiPopup(true)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-200 text-xs font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                          >
                            ✨ Generate with AI
                          </button>
                        </div>
                        <textarea
                          value={openWhenForm.message}
                          onChange={(e) => setOpenWhenForm({ ...openWhenForm, message: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                          rows={4}
                          placeholder="Write your heartfelt message here..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Icon</label>
                        <select
                          value={openWhenForm.icon}
                          onChange={(e) => setOpenWhenForm({ ...openWhenForm, icon: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-white/40 outline-none"
                        >
                          <option value="solar:heart-linear">❤️ Heart</option>
                          <option value="solar:fire-linear">🔥 Fire (Angry)</option>
                          <option value="solar:cloud-rain-linear">🌧️ Rain (Sad)</option>
                          <option value="solar:map-point-search-linear">📍 Location (Miss Me)</option>
                          <option value="solar:sun-linear">☀️ Sun (Happy)</option>
                          <option value="solar:moon-linear">🌙 Moon (Night)</option>
                          <option value="solar:star-linear">⭐ Star</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Icon Color</label>
                        <select
                          value={openWhenForm.iconColor}
                          onChange={(e) => setOpenWhenForm({ ...openWhenForm, iconColor: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-white/40 outline-none"
                        >
                          <option value="text-rose-400">Pink</option>
                          <option value="text-red-400">Red</option>
                          <option value="text-blue-400">Blue</option>
                          <option value="text-yellow-400">Yellow</option>
                          <option value="text-green-400">Green</option>
                          <option value="text-purple-400">Purple</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={editingOpenWhen ? handleEditOpenWhen : handleAddOpenWhen}
                          disabled={saving}
                          className="flex-1 bg-white text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-all disabled:opacity-50"
                        >
                          {saving ? "Saving..." : editingOpenWhen ? "Update" : "Add Letter"}
                        </button>
                        <button
                          onClick={cancelOpenWhenForm}
                          className="px-4 py-2 rounded-xl font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {openWhenNotes.length === 0 && !showOpenWhenForm ? (
                    <div className="text-center py-12 text-rose-100/70">
                      <p className="text-4xl mb-4">💌</p>
                      <p>No love letters yet. Add your first one!</p>
                      <p className="text-sm mt-2 text-rose-100/50">
                        Create messages for when they&apos;re sad, mad, or missing you
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {openWhenNotes.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-white/5 rounded-xl p-4 border border-white/10 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-rose-300 text-xs">💌 Letter #{index + 1}</span>
                              </div>
                              <h4 className="text-white font-medium">Open When: {item.title}</h4>
                              <p className="text-rose-100/60 text-sm mt-1 line-clamp-2">{item.message}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => startEditOpenWhen(item)}
                                className="text-white/70 hover:text-white text-sm"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteOpenWhen(item)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-rose-100/50">
                    {openWhenNotes.length} love letter{openWhenNotes.length !== 1 ? "s" : ""} created
                  </p>
                </div>
              )}

              {activeTab === "coupons" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Love Coupons</h2>
                    <button
                      onClick={handleToggleCouponsVisibility}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        showCouponsSection
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {showCouponsSection ? "👁️ Visible" : "🚫 Hidden"}
                    </button>
                  </div>

                  {!showCouponsSection && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-sm">
                      ⚠️ Coupons are currently hidden from your public page. Click the button above to make them visible.
                    </div>
                  )}

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-rose-100/70 text-center py-8">
                      <span className="text-4xl block mb-4">🎟️</span>
                      Love Coupons customization coming soon!
                      <br />
                      <span className="text-sm text-rose-100/50 mt-2 block">
                        For now, default coupons will be shown.
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "ctacards" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">CTA Cards Customization</h2>
                  </div>
                  <p className="text-rose-100/70 text-sm">
                    Customize the text on the &quot;Why I Love You&quot; and &quot;Valentine Question&quot; cards.
                  </p>

                  {/* Reason Card Settings */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <span className="text-lg">💕</span> Why I Love You Card
                    </h3>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={reasonCardTitle}
                        onChange={(e) => setReasonCardTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Why I Love You"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={reasonCardSubtitle}
                        onChange={(e) => setReasonCardSubtitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Tap to reveal a reason"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={reasonCardButton}
                        onChange={(e) => setReasonCardButton(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Tell Me Why"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">&quot;Another&quot; Button Text (shown after reveal)</label>
                      <input
                        type="text"
                        value={reasonCardAnotherButton}
                        onChange={(e) => setReasonCardAnotherButton(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Another One"
                      />
                    </div>
                  </div>

                  {/* Valentine Card Settings */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <span className="text-lg">💝</span> Valentine Question Card
                    </h3>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Label Badge</label>
                      <input
                        type="text"
                        value={valentineCardLabel}
                        onChange={(e) => setValentineCardLabel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Important"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Question (use \n for line break)</label>
                      <textarea
                        value={valentineCardQuestion}
                        onChange={(e) => setValentineCardQuestion(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                        rows={2}
                        placeholder="Will you be my&#10;Valentine?"
                      />
                      <p className="text-xs text-rose-100/50 mt-1">Tip: Press Enter for a line break</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Yes Button Text</label>
                        <input
                          type="text"
                          value={valentineCardYesText}
                          onChange={(e) => setValentineCardYesText(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="Yes, Always"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">No Button Text</label>
                        <input
                          type="text"
                          value={valentineCardNoText}
                          onChange={(e) => setValentineCardNoText(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="No"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Celebration Popup (Yes clicked) */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <span className="text-lg">🎉</span> Celebration Popup (When they say &quot;Yes&quot;)
                    </h3>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Title</label>
                      <input
                        type="text"
                        value={celebrationTitle}
                        onChange={(e) => setCelebrationTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Yay! ❤️"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Message</label>
                      <textarea
                        value={celebrationMessage}
                        onChange={(e) => setCelebrationMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                        rows={2}
                        placeholder="You just made me the happiest person alive. I love you so much!"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={celebrationButton}
                        onChange={(e) => setCelebrationButton(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Can't wait!"
                      />
                    </div>
                  </div>

                  {/* First Rejection Popup */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <span className="text-lg">😢</span> First &quot;No&quot; Popup
                    </h3>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Title</label>
                      <input
                        type="text"
                        value={rejectionTitle}
                        onChange={(e) => setRejectionTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Are you sure?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Message</label>
                      <textarea
                        value={rejectionMessage}
                        onChange={(e) => setRejectionMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                        rows={2}
                        placeholder="My heart might break into a million pieces..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Accept Button</label>
                        <input
                          type="text"
                          value={rejectionAcceptButton}
                          onChange={(e) => setRejectionAcceptButton(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="Yes, I'll be yours"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Reject Button</label>
                        <input
                          type="text"
                          value={rejectionRejectButton}
                          onChange={(e) => setRejectionRejectButton(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="Still No"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Second Rejection Popup (Last Chance) */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <span className="text-lg">💔</span> Final &quot;No&quot; Popup (Last Chance)
                    </h3>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Title</label>
                      <input
                        type="text"
                        value={secondRejectionTitle}
                        onChange={(e) => setSecondRejectionTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                        placeholder="Last Chance!"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-rose-100 mb-1">Message</label>
                      <textarea
                        value={secondRejectionMessage}
                        onChange={(e) => setSecondRejectionMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                        rows={2}
                        placeholder="I'll make you the happiest person, I promise!"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Accept Button</label>
                        <input
                          type="text"
                          value={secondRejectionAcceptButton}
                          onChange={(e) => setSecondRejectionAcceptButton(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="Okay, Yes! ❤️"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Reject Button</label>
                        <input
                          type="text"
                          value={secondRejectionRejectButton}
                          onChange={(e) => setSecondRejectionRejectButton(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="No 😤"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Love Virus Effect Customization */}
                  <div className="bg-rose-900/30 rounded-xl p-4 space-y-4 border border-rose-800/30">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <span className="text-lg">🦠</span> Love Virus Effect (After Final No)
                    </h3>
                    <p className="text-rose-200/70 text-sm">
                      When they click the final &quot;No&quot;, they get bombarded with photos and messages! By default, it uses your gallery photos.
                    </p>
                    
                    {/* Virus Photos */}
                    <div>
                      <label className="block text-sm text-rose-100 mb-2">Custom Photos (optional - will use gallery if empty)</label>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {virusImages.map((img, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                            <Image src={img} alt="" fill className="object-cover" />
                            <button
                              onClick={() => setVirusImages(virusImages.filter((_, i) => i !== index))}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:border-white/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file && page) {
                                const ext = file.name.split(".").pop();
                                const fileName = `${page.id}/virus-${Date.now()}.${ext}`;
                                const { error } = await supabase.storage
                                  .from("gallery")
                                  .upload(fileName, file);
                                if (!error) {
                                  const { data: { publicUrl } } = supabase.storage
                                    .from("gallery")
                                    .getPublicUrl(fileName);
                                  setVirusImages([...virusImages, publicUrl]);
                                }
                              }
                            }}
                          />
                          <span className="text-white/50 text-2xl">+</span>
                        </label>
                      </div>
                    </div>

                    {/* Virus Messages */}
                    <div>
                      <label className="block text-sm text-rose-100 mb-2">Floating Messages</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {virusMessages.map((msg, index) => (
                          <span key={index} className="bg-white/10 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            {msg}
                            <button
                              onClick={() => setVirusMessages(virusMessages.filter((_, i) => i !== index))}
                              className="text-rose-300 hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newVirusMessage}
                          onChange={(e) => setNewVirusMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newVirusMessage.trim()) {
                              setVirusMessages([...virusMessages, newVirusMessage.trim()]);
                              setNewVirusMessage("");
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none text-sm"
                          placeholder="Add a message..."
                        />
                        <button
                          onClick={() => {
                            if (newVirusMessage.trim()) {
                              setVirusMessages([...virusMessages, newVirusMessage.trim()]);
                              setNewVirusMessage("");
                            }
                          }}
                          className="px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Final Message Customization */}
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      <p className="text-rose-100 text-sm font-medium">Final Message (appears after photos)</p>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Title</label>
                        <input
                          type="text"
                          value={virusFinalTitle}
                          onChange={(e) => setVirusFinalTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="You can't escape my love!"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Message</label>
                        <textarea
                          value={virusFinalMessage}
                          onChange={(e) => setVirusFinalMessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                          rows={2}
                          placeholder="At this point you don't even have an option..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Sub-message</label>
                        <textarea
                          value={virusFinalSubmessage}
                          onChange={(e) => setVirusFinalSubmessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none resize-none"
                          rows={2}
                          placeholder="Every moment with you is a treasure..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-rose-100 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={virusFinalButton}
                          onChange={(e) => setVirusFinalButton(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                          placeholder="Fine, YES! I love you too! ❤️"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full bg-white text-rose-600 px-4 py-3 rounded-xl font-medium hover:bg-rose-50 transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "💾 Save CTA Card Settings"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="order-first lg:order-last">
            <div className="lg:sticky lg:top-24">
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
                <div className="bg-gray-900 rounded-[2rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl max-w-[280px] sm:max-w-[320px] mx-auto">
                  {/* Phone Notch */}
                  <div className="bg-gray-900 h-5 sm:h-6 rounded-t-[1.5rem] sm:rounded-t-[2.5rem] flex items-center justify-center">
                    <div className="w-16 sm:w-20 h-4 sm:h-5 bg-black rounded-full" />
                  </div>
                  
                  {/* Phone Screen */}
                  <div className="bg-rose-600 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden h-[400px] sm:h-[580px] relative overflow-y-auto scrollbar-hide">
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-rose-600/90 backdrop-blur-sm px-4 py-2 flex justify-between items-center">
                      <span className="text-white/90 text-[10px] font-medium">For {recipientName || "my luv"} 💕</span>
                      <div className="flex gap-2 text-[8px] text-white/70">
                        <span>Memories</span>
                        <span>Dreams</span>
                        <span>Gifts</span>
                      </div>
                    </div>
                    
                    {/* Preview Content */}
                    <div className="relative z-10 p-4">
                      {/* Hero Badge */}
                      <div className="flex justify-center mb-2">
                        <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-white text-[8px]">
                          ✨ Made with love for {recipientName || "my luv"}
                        </span>
                      </div>
                      
                      {/* Hero Title */}
                      <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-white font-dancing leading-tight">
                          {heroTitle || "fat ass bitch"}
                        </h1>
                        <p className="text-rose-100/80 text-[9px] mt-1 px-4">
                          {heroSubtitle || "A little corner of the internet, just for you"}
                        </p>
                      </div>

                      {/* Love Letters / Poems Section */}
                      {showPoemsSection && poems.length > 0 && (
                        <div className="mb-4">
                          <p className="text-white/80 text-[10px] font-medium text-center mb-2">💕 Love Letters</p>
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 shadow-lg">
                            <div className="flex gap-2">
                              <div className="w-12 h-16 bg-amber-100 rounded border-l-2 border-amber-300 flex items-center justify-center text-[8px] text-amber-600">
                                📖
                              </div>
                              <div className="flex-1">
                                <p className="text-amber-800 font-dancing text-sm font-bold">{poems[0]?.title || "tight pussy gal"}</p>
                                <p className="text-amber-700/70 text-[7px] mt-0.5 line-clamp-3">{poems[0]?.content?.slice(0, 80) || "In a world where beauty meets..."}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bento Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {/* Counter Card */}
                        <div className="bg-white/90 backdrop-blur rounded-xl p-3">
                          <p className="text-rose-400 text-[8px] mb-0.5">💕 SINCE WE MET</p>
                          <p className="text-rose-900 font-bold text-lg">Loving you for</p>
                          <div className="flex gap-2 mt-1">
                            <div className="text-center">
                              <p className="text-rose-600 font-bold text-lg">{calculateDays()}</p>
                              <p className="text-rose-400 text-[7px]">DAYS</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Music Card */}
                        <div className="bg-rose-900/80 backdrop-blur rounded-xl p-3 flex flex-col items-center justify-center">
                          <div className="w-8 h-8 bg-black rounded-full mb-1" />
                          <p className="text-rose-200 text-[8px]">🎵 Our Song</p>
                          <p className="text-white text-[7px]">In My Life</p>
                        </div>
                        
                        {/* Reasons Card */}
                        <div className="bg-white/90 backdrop-blur rounded-xl p-3 text-center">
                          <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-1">
                            <span className="text-[10px]">✨</span>
                          </div>
                          <p className="text-rose-900 font-medium text-[10px]">{reasonCardTitle || "Why I Love You"}</p>
                          <p className="text-rose-400 text-[7px]">{reasonCardSubtitle || "Tap to reveal a reason"}</p>
                          <button className="bg-rose-600 text-white text-[7px] px-2 py-1 rounded-full mt-1">{reasonCardButton || "Tell Me Why"}</button>
                        </div>
                        
                        {/* Valentine Card */}
                        <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-3">
                          <span className="bg-rose-100 text-rose-600 text-[6px] px-1.5 py-0.5 rounded-full">{valentineCardLabel || "IMPORTANT"}</span>
                          <p className="text-rose-900 font-medium text-[10px] mt-1">{valentineCardQuestion?.split('\n')[0] || "Will you be my"}</p>
                          <p className="text-rose-900 font-medium text-[10px]">{valentineCardQuestion?.split('\n')[1] || "Valentine?"}</p>
                          <div className="flex gap-1 mt-1">
                            <span className="bg-rose-900 text-white text-[6px] px-2 py-0.5 rounded-full">{valentineCardYesText || "Yes, Always"} 💕</span>
                            <span className="bg-white border border-rose-200 text-rose-900 text-[6px] px-2 py-0.5 rounded-full">{valentineCardNoText || "No"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Preview */}
                      {showTimelineSection && timelineItems.length > 0 && (
                        <div className="mb-4">
                          <p className="text-white font-medium text-center mb-2">Our Story</p>
                          <p className="text-rose-200/70 text-[8px] text-center mb-2">HOW IT ALL BEGAN</p>
                          <div className="bg-rose-700/50 rounded-xl p-3">
                            {timelineItems.slice(0, 1).map((item) => (
                              <div key={item.id} className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <p className="text-rose-200 text-[8px]">{item.label}</p>
                                  <p className="text-white text-[10px] font-medium">{item.title}</p>
                                  <p className="text-rose-100/70 text-[7px]">{item.description?.slice(0, 50)}</p>
                                </div>
                                {item.image_src && (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                                    <Image src={item.image_src} alt="" width={48} height={48} className="object-cover w-full h-full" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bucket List Preview */}
                      {showBucketListSection && bucketList.length > 0 && (
                        <div className="bg-rose-700/50 rounded-xl p-3 mb-4">
                          <p className="text-white text-[10px] font-medium mb-2">✨ Our Bucket List</p>
                          {bucketList.slice(0, 2).map((item: { id: string; text: string; completed: boolean }) => (
                            <div key={item.id} className="flex items-center gap-2 text-[8px] text-white/80">
                              <span>{item.completed ? "✅" : "⬜"}</span>
                              <span>{item.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Love Coupons Preview */}
                      {showCouponsSection && (
                        <div className="mb-4">
                          <p className="text-white font-medium text-center mb-1">Love Coupons</p>
                          <p className="text-rose-200/70 text-[8px] text-center mb-2">Redeemable whenever you want</p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {["Back Massage", "Dinner Date", "Forgiveness"].map((coupon, i) => (
                              <div key={i} className="flex-shrink-0 w-20 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg p-2 text-center">
                                <p className="text-rose-600 text-[7px]">COUPON</p>
                                <p className="text-rose-900 font-medium text-[8px]">{coupon}</p>
                                <button className="bg-rose-600 text-white text-[6px] px-2 py-0.5 rounded mt-1">Redeem</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gallery Preview */}
                      {showGallerySection && galleryItems.length > 0 && (
                        <div className="mb-4">
                          <p className="text-white font-medium text-center mb-1">Our Moments</p>
                          <p className="text-rose-200/70 text-[8px] text-center mb-2">SWIPE THROUGH OUR MEMORIES</p>
                          <div className="aspect-square relative rounded-xl overflow-hidden max-w-[180px] mx-auto">
                            <Image src={galleryItems[0]?.src || ""} alt="" fill className="object-cover" />
                          </div>
                          <div className="flex justify-center gap-1 mt-2">
                            <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-[8px]">←</div>
                            <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-[8px]">💕</div>
                            <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-[8px]">→</div>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="text-center pt-4 pb-8">
                        <p className="text-white font-dancing text-lg">Forever & Always</p>
                        <p className="text-rose-200/70 text-[8px]">
                          {senderName || "ME TRU"} 💕 {recipientName || "YOUR SECRET ADMIRER"}
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
                  <div className="bg-rose-600 rounded-b-lg overflow-hidden h-[450px] relative overflow-y-auto scrollbar-hide">
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-rose-600/90 backdrop-blur-sm px-4 py-2 flex justify-between items-center">
                      <span className="text-white/90 text-[9px] font-medium">For {recipientName || "my luv"} 💕</span>
                      <div className="flex gap-3 text-[8px] text-white/70">
                        <span>Memories</span>
                        <span>Dreams</span>
                        <span>Gifts</span>
                        <span>Gallery</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-4 max-w-[400px] mx-auto">
                      {/* Hero Badge */}
                      <div className="flex justify-center mb-2">
                        <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-white text-[7px]">
                          ✨ Made with love for {recipientName || "my luv"}
                        </span>
                      </div>
                      
                      {/* Hero */}
                      <div className="text-center mb-4">
                        <h1 className="text-xl font-bold text-white font-dancing">
                          {heroTitle || "fat ass bitch"}
                        </h1>
                        <p className="text-rose-100/80 text-[8px] mt-1">
                          {heroSubtitle || "A little corner of the internet, just for you"}
                        </p>
                      </div>

                      {/* Poems Preview */}
                      {showPoemsSection && poems.length > 0 && (
                        <div className="mb-3">
                          <p className="text-white/80 text-[9px] font-medium text-center mb-1">💕 Love Letters</p>
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-2 shadow">
                            <div className="flex gap-2">
                              <div className="w-10 h-14 bg-amber-100 rounded border-l-2 border-amber-300 flex items-center justify-center text-[7px]">📖</div>
                              <div className="flex-1">
                                <p className="text-amber-800 font-dancing text-xs font-bold">{poems[0]?.title || "tight pussy gal"}</p>
                                <p className="text-amber-700/70 text-[6px] mt-0.5 line-clamp-2">{poems[0]?.content?.slice(0, 60)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Desktop Bento Grid */}
                      <div className="grid grid-cols-6 gap-1.5 mb-3">
                        {/* Counter */}
                        <div className="col-span-3 bg-white/90 rounded-lg p-2">
                          <p className="text-rose-400 text-[6px]">💕 SINCE WE MET</p>
                          <p className="text-rose-900 font-bold text-xs">Loving you for</p>
                          <p className="text-rose-600 font-bold text-sm">{calculateDays()} <span className="text-[7px] text-rose-400">DAYS</span></p>
                        </div>
                        {/* Music */}
                        <div className="col-span-3 bg-rose-900/80 rounded-lg p-2 flex items-center gap-2">
                          <div className="w-7 h-7 bg-black rounded-full flex-shrink-0" />
                          <div>
                            <p className="text-rose-200 text-[7px]">🎵 Our Song</p>
                            <p className="text-white text-[8px] font-medium">In My Life</p>
                          </div>
                        </div>
                        {/* Reasons */}
                        <div className="col-span-3 bg-white/90 rounded-lg p-2 text-center">
                          <p className="text-rose-900 font-medium text-[8px]">{reasonCardTitle || "Why I Love You"}</p>
                          <p className="text-rose-400 text-[6px]">{reasonCardSubtitle || "Tap to reveal"}</p>
                          <button className="bg-rose-600 text-white text-[6px] px-2 py-0.5 rounded-full mt-1">{reasonCardButton || "Tell Me Why"}</button>
                        </div>
                        {/* Valentine */}
                        <div className="col-span-3 bg-gradient-to-br from-rose-50 to-white rounded-lg p-2">
                          <span className="bg-rose-100 text-rose-600 text-[5px] px-1 py-0.5 rounded-full">{valentineCardLabel || "IMPORTANT"}</span>
                          <p className="text-rose-900 font-medium text-[8px] mt-0.5">{valentineCardQuestion?.replace('\n', ' ') || "Will you be my Valentine?"}</p>
                          <div className="flex gap-1 mt-1">
                            <span className="bg-rose-900 text-white text-[5px] px-1.5 py-0.5 rounded-full">{valentineCardYesText || "Yes"} 💕</span>
                            <span className="bg-white border border-rose-200 text-rose-900 text-[5px] px-1.5 py-0.5 rounded-full">{valentineCardNoText || "No"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      {showTimelineSection && timelineItems.length > 0 && (
                        <div className="bg-rose-700/50 rounded-lg p-2 mb-3">
                          <p className="text-white text-[9px] font-medium text-center mb-1">Our Story</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <p className="text-rose-200 text-[7px]">{timelineItems[0]?.label}</p>
                              <p className="text-white text-[8px] font-medium">{timelineItems[0]?.title}</p>
                            </div>
                            {timelineItems[0]?.image_src && (
                              <div className="w-10 h-10 rounded overflow-hidden">
                                <Image src={timelineItems[0].image_src} alt="" width={40} height={40} className="object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bucket List */}
                      {showBucketListSection && bucketList.length > 0 && (
                        <div className="bg-rose-700/50 rounded-lg p-2 mb-3">
                          <p className="text-white text-[9px] font-medium mb-1">✨ Our Bucket List</p>
                          <div className="space-y-0.5">
                            {bucketList.slice(0, 2).map((item: { id: string; text: string; completed: boolean }) => (
                              <div key={item.id} className="flex items-center gap-1 text-[7px] text-white/80">
                                <span>{item.completed ? "✅" : "⬜"}</span>
                                <span>{item.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gallery */}
                      {showGallerySection && galleryItems.length > 0 && (
                        <div className="mb-3">
                          <p className="text-white text-[9px] font-medium text-center mb-1">Our Moments</p>
                          <div className="grid grid-cols-3 gap-1">
                            {galleryItems.slice(0, 3).map((item) => (
                              <div key={item.id} className="aspect-square relative rounded overflow-hidden">
                                <Image src={item.src} alt="" fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="text-center pt-2 pb-4">
                        <p className="text-white font-dancing text-sm">Forever & Always</p>
                        <p className="text-rose-200/70 text-[7px]">
                          {senderName || "ME TRU"} 💕 {recipientName || "YOUR SECRET ADMIRER"}
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

      {/* AI Generation Popup */}
      {showAiPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-rose-900 to-pink-900 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                ✨ AI Love Letter Generator
              </h3>
              <button
                onClick={() => { setShowAiPopup(false); setAiPrompt(""); }}
                className="text-white/60 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-rose-100/80 text-sm mb-4">
              Describe the vibe or situation, and AI will write a heartfelt message for you!
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-rose-100 mb-1">What&apos;s the vibe?</label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                  placeholder="e.g., when they're stressed about work, feeling lonely, need motivation..."
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-rose-100 mb-1">Style</label>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-white/40 outline-none"
                >
                  <option value="romantic">💕 Romantic & Poetic</option>
                  <option value="funny">😂 Funny & Playful</option>
                  <option value="comforting">🤗 Comforting & Warm</option>
                  <option value="passionate">🔥 Passionate & Intense</option>
                  <option value="sweet">🍭 Sweet & Simple</option>
                </select>
              </div>
              
              <button
                onClick={handleGenerateWithAI}
                disabled={aiGenerating || !aiPrompt.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {aiGenerating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Generating magic...
                  </>
                ) : (
                  <>
                    ✨ Generate Love Letter
                  </>
                )}
              </button>
              
              <p className="text-rose-100/50 text-xs text-center">
                Powered by GPT-4o • You can edit the result after
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Poem Generation Popup */}
      {showAiPoemPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-rose-900 to-pink-900 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                ✨ AI Poem Generator
              </h3>
              <button
                onClick={() => { setShowAiPoemPopup(false); setAiPoemPrompt(""); }}
                className="text-white/60 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-rose-100/80 text-sm mb-4">
              Describe the theme or feeling, and AI will craft a beautiful poem for you!
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-rose-100 mb-1">What&apos;s the theme?</label>
                <input
                  type="text"
                  value={aiPoemPrompt}
                  onChange={(e) => setAiPoemPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-rose-200/50 focus:border-white/40 outline-none"
                  placeholder="e.g., our first kiss, how beautiful she is, my undying love..."
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-rose-100 mb-1">Style</label>
                <select
                  value={aiPoemStyle}
                  onChange={(e) => setAiPoemStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-white/40 outline-none"
                >
                  <option value="romantic">💕 Romantic & Elegant</option>
                  <option value="funny">😂 Funny & Playful</option>
                  <option value="passionate">🔥 Passionate & Intense</option>
                  <option value="sweet">🍭 Sweet & Tender</option>
                  <option value="poetic">📜 Literary & Artistic</option>
                </select>
              </div>
              
              <button
                onClick={handleGeneratePoemWithAI}
                disabled={aiPoemGenerating || !aiPoemPrompt.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {aiPoemGenerating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Writing poetry...
                  </>
                ) : (
                  <>
                    ✨ Generate Poem
                  </>
                )}
              </button>
              
              <p className="text-rose-100/50 text-xs text-center">
                Powered by GPT-4o • You can edit the result after
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
