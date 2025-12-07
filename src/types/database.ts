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
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: 'draft' | 'published';
          attributes: Json | null;
          plan_data: Json | null;
          analysis_scores: Json | null;
          thumbnail_url: string | null;
          ai_personality: 'logical' | 'challenger' | 'mentor' | 'friend';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          status?: 'draft' | 'published';
          attributes?: Json | null;
          plan_data?: Json | null;
          analysis_scores?: Json | null;
          thumbnail_url?: string | null;
          ai_personality?: 'logical' | 'challenger' | 'mentor' | 'friend';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          status?: 'draft' | 'published';
          attributes?: Json | null;
          plan_data?: Json | null;
          analysis_scores?: Json | null;
          thumbnail_url?: string | null;
          ai_personality?: 'logical' | 'challenger' | 'mentor' | 'friend';
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          project_id: string;
          sender: 'user' | 'ai';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          sender: 'user' | 'ai';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          sender?: 'user' | 'ai';
          content?: string;
          created_at?: string;
        };
      };
    };
  };
}
