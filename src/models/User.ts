import { errorToast, successToast } from "../components/toasts";
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
    type === "teacher"
      ? Object.setPrototypeOf(this, Teacher.prototype)
      : Object.setPrototypeOf(this, Student.prototype);
  }

  updateProfile() {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    const currentList = this.classes.map((cl) => cl.id);

    API.patch(this.type + `s/${this.id}`, currentList, auth).catch((err) =>
      console.log(err)
    );
  }
}

export class Teacher extends User {
  students: number[];

  constructor(
    email: string,
    name: string,
    type: string,
    id?: number,
    students?: number[]
  ) {
    super(email, name, type, id);
    this.students = students ? [...students] : [];
  }

  addStudent(studentId: number): void {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    API.get(`users/${this.id}`, auth).then(
      (res) => (this.students = [...res.data?.students])
    );

    this.students.push(studentId);

    const update = { students: this.students };

    API.patch(`users/${this.id}`, update, auth)
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
      .then((_) => {
        successToast("Aula criada!");
      })
      .catch((err) => {
        console.log(err);
        errorToast("Ops! ocorreu um erro...");
      });

    this.updateClasses();
  }

  updateClasses() {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    this.classes.splice(0, this.classes.length);

    API.get(`users/${this.id}/classes`, auth)
      .then((res) => {
        res.data.forEach((cl: Class) => {
          const aClass = new Class(cl.name, cl.userId, cl.id);
          this.classes.push(aClass);
        });
      })
      .catch((err) => console.log(err));

    this.updateProfile();
  }
}

export class Student extends User {
  teachers: number[];

  constructor(
    email: string,
    name: string,
    type: string,
    id?: number,
    teachers?: number[]
  ) {
    super(email, name, type, id);
    this.teachers = teachers ? [...teachers] : [];
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

    const update = { teachers: this.teachers };

    API.patch(`users/${this.id}`, update, auth)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  updateClasses(): void {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@BCPlanner:token")}`,
      },
    };

    this.classes.splice(0, this.classes.length);

    this.teachers.forEach((teacher) => {
      API.get(`users/${teacher}/classes`, auth)
        .then((res) =>
          res.data.forEach((cl: Class) => {
            const aClass = new Class(cl.name, cl.userId, cl.id);
            this.classes.push(aClass);
          })
        )
        .catch((err) => console.log(err));
    });

    this.updateProfile();
  }
}
