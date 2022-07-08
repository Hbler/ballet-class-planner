import API from "../services/API";
import Exercise from "./Exercise";
import Sequence from "./Sequence";

export default class Class {
  id?: number;
  name: string;
  userId: number;
  exercises: Exercise[];

  constructor(name: string, userId: number, id?: number) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.exercises = [];
  }

  addExercise(name: string, sequences?: Sequence[]): void {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    const newExercise = {
      name,
      classId: this.id,
      userId: this.userId,
      sequences: sequences ? [...sequences] : [],
    };

    API.post("exercises", newExercise, auth)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    this.updateExercises();
  }

  updateExercises(): void {
    this.exercises.splice(0, this.exercises.length);

    API.get(`classes/${this.id}/exercises`)
      .then((res) =>
        res.data.foEach((ex: Exercise) => {
          const exercise = new Exercise(ex.name, ex.classId, ex.userId, ex.id);
          this.exercises.push(exercise);
        })
      )
      .catch((err) => console.log(err));
  }
}
