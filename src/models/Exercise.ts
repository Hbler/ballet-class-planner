import { successToast } from "../components/toasts";
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
    const newSequence = new Sequence(sequence, musicName, album, artist, url);

    this.sequences.push(newSequence);

    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    API.patch(`exercises/${this.id}`, this.sequences, auth)
      .then((res) => {
        console.log(res);
        successToast("Sequencia adicionada!");
      })
      .catch((err) => console.log(err));
  }
}
