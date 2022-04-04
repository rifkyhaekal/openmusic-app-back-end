/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

const mapSongsDBToSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const getSongByTitle = (songs, title) =>
  songs.title.toLowerCase().includes(title);

const getSongByPerformer = (songs, performer) =>
  songs.performer.toLowerCase().includes(performer);

const getSongByTitleAndPerformer = (songs, title, performer) =>
  songs.title.toLowerCase().includes(title) &&
  songs.performer.toLowerCase().includes(performer);

module.exports = {
  mapSongsDBToSongModel,
  getSongByTitle,
  getSongByPerformer,
  getSongByTitleAndPerformer,
};
