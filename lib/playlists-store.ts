// Глобальное хранилище плейлистов
const playlistsStore = new Map<string, Array<{ title: string; file: string }>>()

export { playlistsStore }
