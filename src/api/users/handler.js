const ClientError = require('../../exceptions/ClientError');
const InternalServerError = require('../../exceptions/InternalServerError');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._internServerErrMsg = 'Maaf, terjadi kegagalan pada server kami';

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler({ payload }, h) {
    try {
      this._validator.validateUserPayload(payload);
      const { username, password, fullname } = payload;

      const userId = await this._service.addUser({
        username,
        password,
        fullname,
      });

      const response = h.response({
        status: 'success',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      console.error(error);
      return new InternalServerError(this._internServerErrMsg);
    }
  }
}

module.exports = UserHandler;
