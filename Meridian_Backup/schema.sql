-- SQL SCHEMA FOR MERIDIAN ACADEMY
CREATE TABLE library_progress (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES library_books(id) ON DELETE CASCADE,
  scroll_percentage integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, book_id)
);
ALTER TABLE library_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON library_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON library_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON library_progress FOR UPDATE USING (auth.uid() = user_id);
