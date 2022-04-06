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
    this._internServerErrMsg = 'Maaf, terjadi kegagalan pada server kami';

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongByIdHandler =
      this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongHandler({ payload, params, auth }, h) {
    const { id: userId } = auth.credentials;
    const { id: playlistId } = params;
    const { songId } = payload;

    this._validator.validatePlaylistSongPayload(payload);

    await this._songsService.verifySongId(songId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

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

  async getPlaylistSongsHandler({ params, auth }) {
    const { id: userId } = auth.credentials;
    const { id: playlistId } = params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const playlist = await this._playlistSongsService.getPlaylistSongs(
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
