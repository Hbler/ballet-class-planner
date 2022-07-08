class Music {
  name?: string;
  album?: string;
  artist?: string;
  url?: string;

  constructor(name?: string, album?: string, artist?: string, url?: string) {
    this.name = name;
    this.album = album;
    this.artist = artist;
    this.url = url;
  }
}

export default class Sequence {
  sequence: string[];
  music: Music;

  constructor(
    sequence: string[],
    musicName?: string,
    album?: string,
    artist?: string,
    url?: string
  ) {
    this.sequence = sequence;
    this.music = new Music(musicName, album, artist, url);
  }
}
