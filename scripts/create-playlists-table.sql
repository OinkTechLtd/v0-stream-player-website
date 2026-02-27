-- Создаём таблицу для пользовательских плейлистов
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  streams JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON playlists(created_at DESC);

-- Функция для автообновления updated_at
CREATE OR REPLACE FUNCTION update_playlist_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления временной метки
DROP TRIGGER IF EXISTS trigger_update_playlist_timestamp ON playlists;
CREATE TRIGGER trigger_update_playlist_timestamp
BEFORE UPDATE ON playlists
FOR EACH ROW
EXECUTE FUNCTION update_playlist_timestamp();
