const ClientError = require('../../exceptions/ClientError');
const InternalServerError = require('../../exceptions/InternalServerError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._internServerErrMsg = 'Maaf, terjadi kegagalan pada server kami';

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler({ payload }, h) {
    try {
      this._validator.validateSongPayload(payload);

      const songId = await this._service.addSong(payload);

      const response = h.response({
        status: 'success',
        data: {
          songId,
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

  async getSongsHandler({ query }) {
    try {
      const params = query;
      const songs = await this._service.getSongs(params);

      return {
        status: 'success',
        data: {
          songs,
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

  async getSongByIdHandler({ params }) {
    try {
      const { id } = params;
      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
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

  async putSongByIdHandler({ payload, params }) {
    try {
      this._validator.validateSongPayload(payload);

      const { id } = params;

      await this._service.editSongById(id, payload);

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      console.error(error);
      return new InternalServerError(this._InternServerErrMsg);
    }
  }

  async deleteSongByIdHandler({ params }) {
    try {
      const { id } = params;

      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      console.error(error);
      return new InternalServerError(this._InternServerErrMsg);
    }
  }
}

module.exports = SongsHandler;
