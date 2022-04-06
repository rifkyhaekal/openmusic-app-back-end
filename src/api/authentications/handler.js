const ClientError = require('../../exceptions/ClientError');
const InternalServerError = require('../../exceptions/InternalServerError');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    this._internServerErrMsg = 'Maaf, terjadi kegagalan pada server kami';

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validatePostAuthenticationPayload(payload);

      const { username, password } = payload;
      const id = await this._usersService.verifyUserCredential(
        username,
        password
      );

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });

      response.code(201);
      console.log(response);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      console.error(error);
      return new InternalServerError(this._internServerErrMsg);
    }
  }

  async putAuthenticationHandler({ payload }) {
    try {
      this._validator.validatePutAuthenticationPayload(payload);

      const { refreshToken } = payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        data: {
          accessToken,
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

  async deleteAuthenticationHandler({ payload }) {
    try {
      this._validator.validateDeleteAuthenticationPayload(payload);

      const { refreshToken } = payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
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

module.exports = AuthenticationsHandler;
