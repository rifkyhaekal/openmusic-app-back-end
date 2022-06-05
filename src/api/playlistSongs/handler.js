class PlaylistSongHandler {
  constructor(
    songsService,
    playlistsService,
    playlistSongsService,
    playlistSongActivitiesService,
    validator
  ) {
    this._songsService = songsService;
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsByIdHandler =
      this.getPlaylistSongsByIdHandler.bind(this);
    this.deletePlaylistSongByIdHandler =
      this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongHandler({ payload, params, auth }, h) {
    this._validator.validatePlaylistSongPayload(payload);

    const { id: userId } = auth.credentials;
    const { id: playlistId } = params;
    const { songId } = payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._songsService.verifySongId(songId);

    await this._playlistSongsService.addPlaylistSong(playlistId, songId);
    await this._playlistSongActivitiesService.addPlaylistSongActivities(
      playlistId,
      songId,
      userId,
      'add'
    );

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsByIdHandler({ params, auth }) {
    const { id: userId } = auth.credentials;
    const { id: playlistId } = params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const playlist = await this._playlistSongsService.getPlaylistSongsById(
      playlistId
    );

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongByIdHandler({ payload, params, auth }) {
    const { id: userId } = auth.credentials;
    const { id: playlistId } = params;
    const { songId } = payload;

    this._validator.validatePlaylistSongPayload(payload);
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    await this._playlistSongsService.deletePlaylistSongById(songId);
    await this._playlistSongActivitiesService.addPlaylistSongActivities(
      playlistId,
      songId,
      userId,
      'delete'
    );

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongHandler;
