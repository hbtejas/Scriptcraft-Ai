-- Create podcast_scripts table
CREATE TABLE IF NOT EXISTS podcast_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  script TEXT NOT NULL,
  summary TEXT,
  quiz JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_podcast_scripts_user_id ON podcast_scripts(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_podcast_scripts_created_at ON podcast_scripts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE podcast_scripts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own scripts
CREATE POLICY "Users can view their own scripts"
  ON podcast_scripts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own scripts
CREATE POLICY "Users can insert their own scripts"
  ON podcast_scripts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own scripts
CREATE POLICY "Users can update their own scripts"
  ON podcast_scripts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own scripts
CREATE POLICY "Users can delete their own scripts"
  ON podcast_scripts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_podcast_scripts_updated_at
  BEFORE UPDATE ON podcast_scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
