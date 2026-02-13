export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      valentine_pages: {
        Row: {
          id: string;
          user_id: string;
          recipient_name: string;
          sender_name: string;
          start_date: string;
          hero_title: string;
          hero_subtitle: string;
          primary_color: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipient_name?: string;
          sender_name?: string;
          start_date?: string;
          hero_title?: string;
          hero_subtitle?: string;
          primary_color?: string;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          recipient_name?: string;
          sender_name?: string;
          start_date?: string;
          hero_title?: string;
          hero_subtitle?: string;
          primary_color?: string;
          is_published?: boolean;
          updated_at?: string;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          page_id: string;
          src: string;
          type: "image" | "video";
          caption: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          src: string;
          type: "image" | "video";
          caption?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          src?: string;
          type?: "image" | "video";
          caption?: string;
          order_index?: number;
        };
      };
      timeline_items: {
        Row: {
          id: string;
          page_id: string;
          label: string;
          title: string;
          description: string;
          image_src: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          label: string;
          title: string;
          description?: string;
          image_src?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          label?: string;
          title?: string;
          description?: string;
          image_src?: string | null;
          order_index?: number;
        };
      };
      reasons: {
        Row: {
          id: string;
          page_id: string;
          text: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          text: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          text?: string;
          order_index?: number;
        };
      };
      love_poems: {
        Row: {
          id: string;
          page_id: string;
          title: string;
          lines: string[];
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          title: string;
          lines: string[];
          order_index?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          lines?: string[];
          order_index?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
