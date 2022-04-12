class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler({ payload, auth, params }, h) {
    this._validator.validateExportPlaylistPayload(payload);

    const { playlistId } = params;
    const { targetEmail } = payload;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
