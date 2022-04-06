class PlaylistSongActivitiesHandler {
  constructor(playlistService, activityService) {
    this._activityService = activityService;
    this._playlistService = playlistService;

    this.getActivityByIdHandler = this.getActivityByIdHandler.bind(this);
  }

  async getActivityByIdHandler({ params, auth }) {
    const { id: userId } = auth.credentials;
    const { id: playlistId } = params;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const activities = await this._activityService.getActivityByPlaylistId(
      playlistId
    );

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
