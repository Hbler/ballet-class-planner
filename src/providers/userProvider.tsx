import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { errorToast, successToast } from "../components/toasts";
import Class from "../models/Class";
import { Student, Teacher } from "../models/User";
import API from "../services/API";

type UserProviderProps = { children: ReactNode };
type User = Teacher | Student;

interface newUser {
  name: string;
  email: string;
  password: string;
  type: string;
  [k: string]: any;
}
interface UserProviderData {
  token: string;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  classes: Class[];
  login: (email: string, password: string) => void;
  signUp: (newUser: newUser) => void;
  checkLocalUser: (savedUser: string) => void;
}

export const UserContext = createContext<UserProviderData>(
  {} as UserProviderData
);

export const ContextUser = () => {
  const context = useContext(UserContext);
  return context;
};

export default function UserProvider({ children }: UserProviderProps) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({} as User);
  const [classes, setClasses] = useState([] as Class[]);

  useEffect(() => {
    const savedToken = localStorage.getItem("@BCPlanner:token") || "";
    const savedUser = localStorage.getItem("@BCPlanner:user") || "";

    if (savedToken) {
      const auth = {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      };

      API.get("classes/", auth)
        .then((_) => setToken(savedToken))
        .catch((err) => {
          setToken("");
          console.log(err);
        });
    }

    if (savedUser && Object.keys(user).length === 0) checkLocalUser(savedUser);
  }, [user]);

  const login = (email: string, password: string) => {
    API.post("login", { email, password })
      .then((res) => {
        setToken(res.data.accessToken);
        localStorage.setItem("@BCPlanner:token", res.data.accessToken);
        const loggedUser = res.data.user;
        const currentUser =
          loggedUser.type === "teacher"
            ? new Teacher(
                loggedUser.email,
                loggedUser.name,
                loggedUser.type,
                loggedUser.id
              )
            : new Student(
                loggedUser.email,
                loggedUser.name,
                loggedUser.type,
                loggedUser.id
              );

        localStorage.setItem("@BCPlanner:user", JSON.stringify(currentUser));
        currentUser.updateClasses();
        setClasses([...currentUser.classes]);

        setTimeout(() => {
          localStorage.removeItem("@BCPlanner:token");
          localStorage.removeItem("@BCPlanner:user");
          setToken("");
        }, 3.6e6);
      })
      .catch((err) => {
        let message;

        err.response.data.includes("password")
          ? (message = "Ops! Senha incorreta")
          : err.response.data.includes("find")
          ? (message = "Email não encontrado")
          : (message = "Ops! Ocorreu um erro!");

        errorToast(message);
      });
  };

  const signUp = (newUser: newUser) => {
    API.post("register", newUser)
      .then((_) => {
        localStorage.setItem("@BCPlanner:registered", "true");
        successToast("O cadastro foi realizado com sucesso!");
      })
      .catch((err) => {
        let message;

        err.response.data.includes("Email")
          ? (message = "Esse email já está cadastrado")
          : (message = "Ops! Ocorreu um erro!");

        errorToast(message);
      });
  };

  const checkLocalUser = (savedUser: string) => {
    if (savedUser) {
      const currentUser = JSON.parse(savedUser);
      const userInstance =
        currentUser.type === "teacher"
          ? new Teacher(
              currentUser.email,
              currentUser.name,
              currentUser.type,
              currentUser.id
            )
          : new Student(
              currentUser.email,
              currentUser.name,
              currentUser.type,
              currentUser.id
            );

      setUser(userInstance);
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        setUser,
        classes,
        login,
        signUp,
        checkLocalUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
