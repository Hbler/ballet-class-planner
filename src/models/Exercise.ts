import API from "../services/API";
import Sequence from "./Sequence";

export default class Exercise {
  id?: number;
  name: string;
  userId: number;
  classId: number;
  sequences: Sequence[];

  constructor(name: string, userId: number, classId: number, id?: number) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.classId = classId;
    this.sequences = [];
  }

  addSequence(
    sequence: string[],
    musicName?: string,
    album?: string,
    artist?: string,
    url?: string
  ): void {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    const newSequence = {
      sequence,
      userId: this.userId,
      classId: this.classId,
      exerciseId: this.id,
      music: {
        name: musicName,
        album,
        artist,
        url,
      },
    };

    API.post("sequences", newSequence, auth)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    this.updateSequences();
  }

  updateSequences(): void {
    this.sequences.splice(0, this.sequences.length);

    API.get(`exercises/${this.id}/sequencees`)
      .then((res) =>
        res.data.foEach((sq: Sequence) => {
          const sequence = new Sequence(
            sq.sequence,
            sq.userId,
            sq.classId,
            sq.exerciseId,
            sq.id,
            sq.music?.name,
            sq.music?.album,
            sq.music?.artist,
            sq.music?.url
          );
          this.sequences.push(sequence);
        })
      )
      .catch((err) => console.log(err));
  }
}
