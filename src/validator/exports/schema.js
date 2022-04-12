const Joi = require('joi');

const ExportsPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportsPlaylistPayloadSchema;
