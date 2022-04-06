const ClientError = require('../../exceptions/ClientError');
const InternalServerError = require('../../exceptions/InternalServerError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._internServerErrMsg = 'Maaf, terjadi kegagalan pada server kami';

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    try {
      this._validator.validatePlaylistPayload(payload);

      const { name } = payload;
      const { id: ownerId } = auth.credentials;

      const playlistId = await this._service.addPlaylist(ownerId, name);

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      console.error(error);
      return new InternalServerError(this._internServerErrMsg);
    }
  }

  async getPlaylistsHandler({ auth }) {
    try {
      const { id: ownerId } = auth.credentials;

      const playlists = await this._service.getPlaylists(ownerId);

      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      console.error(error);
      return new InternalServerError(this._internServerErrMsg);
    }
  }

  async deletePlaylistByIdHandler({ params, auth }) {
    try {
      const { id: playlistId } = params;
      const { id: ownerId } = auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, ownerId);
      await this._service.deletePlaylistById(playlistId);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      console.error(error);
      return new InternalServerError(this._internServerErrMsg);
    }
  }
}

module.exports = PlaylistsHandler;
