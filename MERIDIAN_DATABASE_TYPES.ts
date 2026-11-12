export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      blog_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "journal_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_poll_votes: {
        Row: {
          created_at: string | null
          id: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_index?: number
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "channel_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_polls: {
        Row: {
          channel_id: string
          created_at: string | null
          id: string
          options: Json
          question: string
          user_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string | null
          id?: string
          options: Json
          question: string
          user_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string | null
          id?: string
          options?: Json
          question?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_polls_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: string
          published: boolean | null
          slug: string
          thumbnail_url: string | null
          title: string
          track: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level: string
          published?: boolean | null
          slug: string
          thumbnail_url?: string | null
          title: string
          track: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: string
          published?: boolean | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          track?: string
        }
        Relationships: []
      }
      daily_news: {
        Row: {
          category: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string | null
          source: string
          title: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          source: string
          title: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          source?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string | null
          enrolled_at: string | null
          id: string
          progress: number | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string | null
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          accent_color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          owner_id: string
          slug: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          owner_id: string
          slug: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          owner_id?: string
          slug?: string
        }
        Relationships: []
      }
      journal_articles: {
        Row: {
          author_avatar: string | null
          author_bio: string | null
          author_name: string | null
          body: Json
          category_id: string | null
          cover_image: string | null
          excerpt: string | null
          featured: boolean | null
          format: string | null
          id: string
          published_at: string | null
          reading_minutes: number | null
          slug: string
          status: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_avatar?: string | null
          author_bio?: string | null
          author_name?: string | null
          body?: Json
          category_id?: string | null
          cover_image?: string | null
          excerpt?: string | null
          featured?: boolean | null
          format?: string | null
          id?: string
          published_at?: string | null
          reading_minutes?: number | null
          slug: string
          status?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_avatar?: string | null
          author_bio?: string | null
          author_name?: string | null
          body?: Json
          category_id?: string | null
          cover_image?: string | null
          excerpt?: string | null
          featured?: boolean | null
          format?: string | null
          id?: string
          published_at?: string | null
          reading_minutes?: number | null
          slug?: string
          status?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "journal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_bookmarks: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "journal_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_categories: {
        Row: {
          accent_color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      journal_reading_progress: {
        Row: {
          article_id: string
          completed: boolean | null
          id: string
          scroll_percentage: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          article_id: string
          completed?: boolean | null
          id?: string
          scroll_percentage?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          article_id?: string
          completed?: boolean | null
          id?: string
          scroll_percentage?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_reading_progress_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "journal_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_vault: {
        Row: {
          analogies: Json
          applications: Json
          connections: Json
          core_concept: string
          created_at: string | null
          detailed_explanation: string
          discipline: string
          first_principles: Json
          further_questions: Json
          id: string
          title: string
        }
        Insert: {
          analogies: Json
          applications: Json
          connections: Json
          core_concept: string
          created_at?: string | null
          detailed_explanation: string
          discipline: string
          first_principles: Json
          further_questions: Json
          id?: string
          title: string
        }
        Update: {
          analogies?: Json
          applications?: Json
          connections?: Json
          core_concept?: string
          created_at?: string | null
          detailed_explanation?: string
          discipline?: string
          first_principles?: Json
          further_questions?: Json
          id?: string
          title?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          attempts: number | null
          best_score: number | null
          completed: boolean | null
          completed_at: string | null
          id: string
          last_attempt_at: string | null
          lesson_id: string
          quiz_passed: boolean | null
          quiz_score: number | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          best_score?: number | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          last_attempt_at?: string | null
          lesson_id: string
          quiz_passed?: boolean | null
          quiz_score?: number | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          best_score?: number | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          last_attempt_at?: string | null
          lesson_id?: string
          quiz_passed?: boolean | null
          quiz_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string | null
          id: string
          is_final_exam: boolean | null
          mission_id: string | null
          order_index: number
          pass_threshold: number | null
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_final_exam?: boolean | null
          mission_id?: string | null
          order_index: number
          pass_threshold?: number | null
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_final_exam?: boolean | null
          mission_id?: string | null
          order_index?: number
          pass_threshold?: number | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      library_bookmarks: {
        Row: {
          book_id: string | null
          chapter_id: string | null
          created_at: string | null
          id: string
          label: string | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          label?: string | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          label?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_bookmarks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_bookmarks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "library_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      library_books: {
        Row: {
          accent_color: string | null
          category: string | null
          cover_style: string | null
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          published: boolean | null
          slug: string
          subtitle: string
          title: string
          xp_reward: number | null
        }
        Insert: {
          accent_color?: string | null
          category?: string | null
          cover_style?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          published?: boolean | null
          slug: string
          subtitle: string
          title: string
          xp_reward?: number | null
        }
        Update: {
          accent_color?: string | null
          category?: string | null
          cover_style?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          published?: boolean | null
          slug?: string
          subtitle?: string
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      library_chapters: {
        Row: {
          book_id: string | null
          chapter_number: number
          content: string
          created_at: string | null
          id: string
          title: string
          word_count: number | null
        }
        Insert: {
          book_id?: string | null
          chapter_number: number
          content: string
          created_at?: string | null
          id?: string
          title: string
          word_count?: number | null
        }
        Update: {
          book_id?: string | null
          chapter_number?: number
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "library_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
        ]
      }
      library_notes: {
        Row: {
          book_id: string | null
          chapter_id: string | null
          created_at: string | null
          id: string
          note_content: string | null
          page_number: number
          selected_text: string
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          note_content?: string | null
          page_number: number
          selected_text: string
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          note_content?: string | null
          page_number?: number
          selected_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_notes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_notes_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "library_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      library_progress: {
        Row: {
          book_id: string
          chapter_id: string | null
          completed_at: string | null
          is_bookmarked: boolean | null
          scroll_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_id?: string | null
          completed_at?: string | null
          is_bookmarked?: boolean | null
          scroll_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_id?: string | null
          completed_at?: string | null
          is_bookmarked?: boolean | null
          scroll_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_progress_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "library_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      "Meridian Academy": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      missions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          module_id: string
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          module_id: string
          order_index?: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          module_id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          learning_language: string | null
          level: string | null
          native_language: string | null
          shards: number | null
          username: string | null
          xp: number | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          learning_language?: string | null
          level?: string | null
          native_language?: string | null
          shards?: number | null
          username?: string | null
          xp?: number | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          learning_language?: string | null
          level?: string | null
          native_language?: string | null
          shards?: number | null
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_index: number
          created_at: string | null
          id: string
          lesson_id: string
          options: Json
          order_index: number
          question: string
        }
        Insert: {
          correct_index: number
          created_at?: string | null
          id?: string
          lesson_id: string
          options: Json
          order_index?: number
          question: string
        }
        Update: {
          correct_index?: number
          created_at?: string | null
          id?: string
          lesson_id?: string
          options?: Json
          order_index?: number
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_domains: {
        Row: {
          accent_color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          domain_id: string | null
          id: string
          max_level: number | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          domain_id?: string | null
          id?: string
          max_level?: number | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          domain_id?: string | null
          id?: string
          max_level?: number | null
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "skill_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      study_specs: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          methodology: string
          objective: string
          prompt: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          methodology: string
          objective: string
          prompt: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          methodology?: string
          objective?: string
          prompt?: string
          title?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          channel_id: string | null
          created_at: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threads_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_resume_state: {
        Row: {
          href: string
          id: string
          progress_data: Json | null
          resource_id: string
          resource_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          href: string
          id?: string
          progress_data?: Json | null
          resource_id: string
          resource_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          href?: string
          id?: string
          progress_data?: Json | null
          resource_id?: string
          resource_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_skill_progress: {
        Row: {
          id: string
          level: number
          skill_id: string
          updated_at: string | null
          user_id: string
          xp: number
        }
        Insert: {
          id?: string
          level?: number
          skill_id: string
          updated_at?: string | null
          user_id: string
          xp?: number
        }
        Update: {
          id?: string
          level?: number
          skill_id?: string
          updated_at?: string | null
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_progress_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          skill_level: number | null
          skill_name: string
          unlocked: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          skill_level?: number | null
          skill_name: string
          unlocked?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          skill_level?: number | null
          skill_name?: string
          unlocked?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_shards: {
        Args: { activity_reason: string; shard_amount: number }
        Returns: undefined
      }
      award_skill_xp: {
        Args: { p_reason?: string; p_skill_slug: string; p_xp_amount: number }
        Returns: {
          leveled_up: boolean
          new_level: number
          new_xp: number
        }[]
      }
      calc_skill_level: { Args: { p_xp: number }; Returns: number }
      get_combat_level: { Args: { p_user_id: string }; Returns: number }
      get_quiz_questions: {
        Args: { p_lesson_id: string }
        Returns: {
          id: string
          options: Json
          order_index: number
          question: string
        }[]
      }
      is_admin_user: { Args: never; Returns: boolean }
      submit_quiz: {
        Args: { p_answers: Json; p_lesson_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
