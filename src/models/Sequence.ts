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
  id?: number;
  sequence: string[];
  userId: number;
  classId: number;
  exerciseId: number;
  music: Music;

  constructor(
    sequence: string[],
    userId: number,
    classId: number,
    exerciseId: number,
    id?: number,
    musicName?: string,
    album?: string,
    artist?: string,
    url?: string
  ) {
    this.id = id;
    this.sequence = sequence;
    this.userId = userId;
    this.classId = classId;
    this.exerciseId = exerciseId;
    this.music = new Music(musicName, album, artist, url);
  }
}
