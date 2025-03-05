export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          title: string | null
          location: string | null
          about: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          title?: string | null
          location?: string | null
          about?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          title?: string | null
          location?: string | null
          about?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employer_profiles: {
        Row: {
          id: string
          company_name: string | null
          email: string | null
          industry: string | null
          location: string | null
          about: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name?: string | null
          email?: string | null
          industry?: string | null
          location?: string | null
          about?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string | null
          email?: string | null
          industry?: string | null
          location?: string | null
          about?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          employer_id: string
          title: string
          company: string
          location: string | null
          salary: string | null
          description: string
          requirements: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          title: string
          company: string
          location?: string | null
          salary?: string | null
          description: string
          requirements?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          title?: string
          company?: string
          location?: string | null
          salary?: string | null
          description?: string
          requirements?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_skills: {
        Row: {
          id: string
          job_id: string
          skill: string
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          skill: string
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          skill?: string
          created_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill?: string
          created_at?: string
        }
      }
      job_preferences: {
        Row: {
          id: string
          user_id: string
          remote: boolean
          full_time: boolean
          contract: boolean
          relocation: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          remote?: boolean
          full_time?: boolean
          contract?: boolean
          relocation?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          remote?: boolean
          full_time?: boolean
          contract?: boolean
          relocation?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      job_swipes: {
        Row: {
          id: string
          user_id: string
          job_id: string
          liked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          liked: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          liked?: boolean
          created_at?: string
        }
      }
      candidate_swipes: {
        Row: {
          id: string
          employer_id: string
          user_id: string
          job_id: string
          liked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          user_id: string
          job_id: string
          liked: boolean
          created_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          user_id?: string
          job_id?: string
          liked?: boolean
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user_id: string
          employer_id: string
          job_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          employer_id: string
          job_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          employer_id?: string
          job_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}

