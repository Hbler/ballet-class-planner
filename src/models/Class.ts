import { successToast } from "../components/toasts";
import API from "../services/API";
import Exercise from "./Exercise";

export default class Class {
  id: number;
  name: string;
  userId: number;
  exercises: Exercise[];

  constructor(name: string, userId: number, id: number) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.exercises = [];
  }

  addExercise(name: string): void {
    console.log(name);

    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    const newExercise = {
      name,
      userId: this.userId,
      classId: this.id,
    };

    console.log(newExercise);

    API.post("exercises", newExercise, auth)
      .then((res) => {
        console.log(res);
        successToast("Exercício criado!");
      })
      .catch((err) => console.log(err));

    this.updateExercises();
  }

  updateExercises(): void {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    this.exercises.splice(0, this.exercises.length);

    API.get(`classes/${this.id}/exercises`, auth)
      .then((res) => {
        res.data.forEach((ex: Exercise) => {
          const exercise = new Exercise(ex.name, ex.classId, ex.userId, ex.id);
          this.exercises.push(exercise);
        });
      })
      .catch((err) => console.log(err));
  }
}
