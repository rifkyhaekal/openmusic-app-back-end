class CollaborationsHandler {
  constructor(
    collaborationsService,
    playlistsService,
    usersService,
    validator
  ) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
    this._internServerErrMsg = 'Maaf, terjadi kegagalan pada server kami';

    this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
    this.deleteCollaborationsHandler =
      this.deleteCollaborationsHandler.bind(this);
  }

  async postCollaborationsHandler({ payload, auth }, h) {
    this._validator.validateCollaborationsPayload(payload);

    const { playlistId, userId } = payload;
    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._usersService.getUserById(userId);

    const id = await this._collaborationsService.addCollaboration(
      playlistId,
      userId
    );

    const response = h.response({
      status: 'success',
      data: {
        collaborationId: id,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationsHandler({ payload, auth }) {
    this._validator.validateCollaborationsPayload(payload);

    const { playlistId, userId: collaboratorId } = payload;
    const { id: credentialId } = auth.credentials;
    console.log(collaboratorId);
    console.log(credentialId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._collaborationsService.deleteCollaboration(
      playlistId,
      collaboratorId
    );

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
