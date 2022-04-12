const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InternalServerError = require('../../exceptions/InternalServerError');

class PlaylistSongActivities {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivities(playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InternalServerError('Maaf, terjadi kegagalan pada server kami');
    }
  }

  async getActivityByPlaylistId(id) {
    const query = {
      text: 'SELECT u.username, s.title, a.action, a.time FROM playlist_song_activities a LEFT JOIN users u ON a.user_id = u.id LEFT JOIN songs s ON a.song_id = s.id WHERE a.playlist_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongActivities;
