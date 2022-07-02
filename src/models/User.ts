import API from "../services/API";
import Class from "./Class";

class User {
  id?: number;
  email: string;
  name: string;
  type: string;
  classes: Class[];

  constructor(email: string, name: string, type: string, id?: number) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.type = type;
    this.classes = [];
  }
}

export class Teacher extends User {
  students: number[];

  constructor(email: string, name: string, type: string, id?: number) {
    super(email, name, type, id);
    this.students = [];
  }

  addStudent(userId: number): void {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    API.get(`users/${this.id}`, auth).then(
      (res) => (this.students = [...res.data?.students])
    );

    this.students.push(userId);

    const students = { students: this.students };

    API.patch(`users/${this.id}`, students, auth)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  addClass(name: string): void {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    const newClass = {
      name,
      userId: this.id,
    };

    API.post("classes", newClass, auth)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    this.updateClasses();
  }

  updateClasses(): void {
    this.classes.splice(0, this.classes.length);

    API.get(`users/${this.id}/classes`)
      .then((res) =>
        res.data.foEach((cl: Class) => {
          const aClass = new Class(cl.name, cl.userId, cl.id);
          this.classes.push(aClass);
        })
      )
      .catch((err) => console.log(err));
  }
}

export class Student extends User {
  teachers: number[];

  constructor(email: string, name: string, type: string, id?: number) {
    super(email, name, type, id);
    this.teachers = [];
  }

  addTeacher(userId: number): void {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    API.get(`users/${this.id}`, auth)
      .then((res) => (this.teachers = [...res.data?.teachers]))
      .catch((err) => console.log(err));

    this.teachers.push(userId);

    const teachers = { teachers: this.teachers };

    API.patch(`users/${this.id}`, teachers, auth)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  updateClasses(): void {
    this.classes.splice(0, this.classes.length);

    this.teachers.forEach((teacher) => {
      API.get(`users/${teacher}/classes`)
        .then((res) =>
          res.data.foEach((cl: Class) => {
            const aClass = new Class(cl.name, cl.userId, cl.id);
            this.classes.push(aClass);
          })
        )
        .catch((err) => console.log(err));
    });
  }
}
