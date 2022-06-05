require('dotenv').config();
const fs = require('fs');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postUploadCoverHandler({ params, payload }, h) {
    const { cover } = payload;
    const { id } = params;

    await this._validator.validateImageHeaders(cover.hapi.headers);

    const album = await this._albumsService.getAlbumOnlyById(id);

    // hapus file sebelumnya
    if (album.coverUrl) {
      await this._storageService.removeFile(album.coverUrl);
    }

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    await this._albumsService.editCoverUrl(
      id,
      `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
    );

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
