require('dotenv').config();

const Hapi = require('@hapi/hapi');

// services
const AlbumService = require('./service/postgres/AlbumService');
const SongService = require('./service/postgres/SongService');

// plugins
const albums = require('./api/albums');
const songs = require('./api/songs');

// validators
const AlbumValidator = require('./validator/albums');
const SongValidator = require('./validator/songs');

const init = async () => {
  const songService = new SongService();
  const albumService = new AlbumService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
