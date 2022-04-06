const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `plysong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getPlaylistSongsById(playlistId) {
    const playlistQuery = {
      text: 'SELECT DISTINCT ON (playlists.id) playlists.id, playlists.name, users.username FROM playlist_songs LEFT JOIN playlists ON playlists.id = playlist_id LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1',
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(playlistQuery);

    if (!resultPlaylist.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlistSongs = resultPlaylist.rows[0];

    const songQuery = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlist_songs LEFT JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId],
    };

    const songResult = await this._pool.query(songQuery);

    playlistSongs.songs = songResult.rows;

    return playlistSongs;
  }

  async deletePlaylistSongById(id) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist Song gagal dihapus');
    }
  }
}

module.exports = PlaylistSongsServices;
