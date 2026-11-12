-- Bookmarks Table
CREATE TABLE IF NOT EXISTS library_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES library_books(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES library_chapters(id) ON DELETE CASCADE,
  page_number int NOT NULL,
  label text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id, page_number)
);
ALTER TABLE library_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON library_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Highlights/Notes Table
CREATE TABLE IF NOT EXISTS library_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES library_books(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES library_chapters(id) ON DELETE CASCADE,
  selected_text text NOT NULL,
  note_content text,
  page_number int NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE library_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notes" ON library_notes FOR ALL USING (auth.uid() = user_id);
