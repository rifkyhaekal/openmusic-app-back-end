const ClientError = require('../../exceptions/ClientError');
const InternalServerError = require('../../exceptions/InternalServerError');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._internServerErrMsg = 'Maaf, terjadi kegagalan pada server kami';

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const albumId = await this._service.addAlbum(request.payload);

      const response = h.response({
        status: 'success',
        data: {
          albumId,
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

  async getAlbumByIdHandler({ params }) {
    try {
      const { id } = params;
      const album = await this._service.getAlbumById(id);

      return {
        status: 'success',
        data: {
          album,
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

  async putAlbumByIdHandler({ payload, params }) {
    try {
      this._validator.validateAlbumPayload(payload);
      const { id } = params;

      await this._service.editAlbumById(id, payload);

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      console.error(error);
      return new InternalServerError(this._internServerErrMsg);
    }
  }

  async deleteAlbumByIdHandler({ params }) {
    try {
      const { id } = params;

      await this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
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

module.exports = AlbumsHandler;
