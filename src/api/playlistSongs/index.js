const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist_songs',
  version: '1.0.0',
  register: async (
    server,
    {
      songsService,
      playlistsService,
      playlistSongsService,
      playlistSongActivitiesService,
      validator,
    }
  ) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      songsService,
      playlistsService,
      playlistSongsService,
      playlistSongActivitiesService,
      validator
    );
    server.route(routes(playlistSongsHandler));
  },
};
