const ClientError = require('../../exceptions/ClientError');
const InternalServerError = require('../../exceptions/InternalServerError');

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
    try {
      this._validator.validateCollaborationsPayload(payload);

      const { playlistId, userId } = payload;
      const { userId: credentialId } = auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );

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
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }
      return new InternalServerError(this._internServerErrMsg);
    }
  }

  async deleteCollaborationsHandler({ payload, auth }) {
    try {
      this._validator.validateCollaborationsPayload(payload);

      const { playlistId, userId } = payload;
      const { userId: credentialId } = auth.credentials;
      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );

      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }
      return new InternalServerError(this._internServerErrMsg);
    }
  }
}

module.exports = CollaborationsHandler;
