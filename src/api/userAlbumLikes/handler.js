class UserAlbumLikeHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    this.postUserAlbumLikesHandler = this.postUserAlbumLikesHandler.bind(this);
    this.getUserAlbumLikesCountHandler =
      this.getUserAlbumLikesCountHandler.bind(this);
  }

  async postUserAlbumLikesHandler({ auth, params }, h) {
    const { id: albumId } = params;
    const { id: credentialId } = auth.credentials;

    await this._albumsService.getAlbumOnlyById(albumId);

    let action;
    if (
      await this._userAlbumLikesService.getIsUserLikedAlbumById(
        credentialId,
        albumId
      )
    ) {
      await this._userAlbumLikesService.removeUserAlbumLike(
        credentialId,
        albumId
      );
      action = 'batal menyukai';
    } else {
      await this._userAlbumLikesService.addUserAlbumLike(credentialId, albumId);
      action = 'menyukai';
    }

    const response = h.response({
      status: 'success',
      message: `Berhasil ${action} album`,
    });
    response.code(201);
    return response;
  }

  async getUserAlbumLikesCountHandler({ params }, h) {
    const { id: albumId } = params;

    await this._albumsService.getAlbumOnlyById(albumId);

    const data = await this._userAlbumLikesService.getCountUserAlbumLikesById(
      albumId
    );

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(data.count, 10),
      },
    });
    if (data.source === 'cache') {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }
}

module.exports = UserAlbumLikeHandler;
