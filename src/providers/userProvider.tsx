import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import Class from "../models/Class";
import API from "../services/API";

import { errorToast, successToast } from "../components/toasts";
import { Student, Teacher } from "../models/User";

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
  setClasses: Dispatch<SetStateAction<Class[]>>;
  classes: Class[];
  login: (
    email: string,
    password: string,
    callback: (route: string) => void
  ) => void;
  logOut: (callback: (route: string) => void) => void;
  signUp: (newUser: newUser, callback: (route: string) => void) => void;
  forceUpdate: () => void;
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
  const [update, updateState] = useState<{}>();

  const forceUpdate = useCallback(() => updateState({}), []);

  const login = (
    email: string,
    password: string,
    callback: (route: string) => void
  ) => {
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

        setTimeout(() => {
          localStorage.removeItem("@BCPlanner:token");
          localStorage.removeItem("@BCPlanner:user");
          setToken("");
        }, 3.6e6);

        setUser(currentUser);
        callback("/home");
      })
      .catch((err) => {
        let message;
        console.log(err);

        err.response.data.includes("password")
          ? (message = "Ops! Senha incorreta")
          : err.response.data.includes("find")
          ? (message = "Email não encontrado")
          : (message = "Ops! Ocorreu um erro!");

        errorToast(message);
      });
  };

  const logOut = (callback: (route: string) => void) => {
    localStorage.removeItem("@BCPlanner:token");
    localStorage.removeItem("@BCPlanner:user");
    setToken("");
    callback("/");
  };

  const createProfile = (data: any, callback: (route: string) => void) => {
    const { accessToken, user } = data;
    const { name, id, type } = user;

    const route = type === "teacher" ? "teachers" : "students";

    const auth = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const profile = {
      name,
      userId: id,
      classes: [],
    };

    API.post(route, profile, auth)
      .then((_) => {
        successToast("O cadastro foi realizado com sucesso!");
        callback("/");
      })
      .catch((err) => {
        console.log(err);
        errorToast("Ops! Ocorreu um erro...");
      });
  };

  const signUp = (newUser: newUser, callback: (route: string) => void) => {
    API.post("register", newUser)
      .then((res) => {
        createProfile(res.data, callback);
      })
      .catch((err) => {
        console.log(err);

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

  // const parseJwt = (token: string) => {
  //   console.log(decode.exp);
  //   if (decode.exp * 1000 < new Date().getTime()) {
  //     console.log("Time Expired");
  //   }
  // };

  useEffect(() => {
    const savedToken = localStorage.getItem("@BCPlanner:token") || "";
    const savedUser = localStorage.getItem("@BCPlanner:user") || "";

    if (savedToken) {
      //parse jwt
      const decode = JSON.parse(atob(savedToken.split(".")[1]));

      // verify token expiration
      if (!(decode.exp * 1000 < new Date().getTime())) {
        const auth = {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        };

        API.get(`users/${decode.sub}/classes`, auth)
          .then((res) => {
            const classList: Class[] = [];
            res.data.forEach((cl: Class) => {
              const aClass = new Class(cl.name, cl.userId, cl.id);

              aClass.updateExercises();
              classList.push(aClass);
            });
            setClasses([...classList]);
            setToken(savedToken);
          })
          .catch((err) => {
            setToken("");

            console.log(err);
          });
      } else {
        localStorage.clear();
        errorToast("Sua sessão expirou...");
      }
    }

    if (savedUser && Object.keys(user).length === 0) checkLocalUser(savedUser);
  }, [user, update]);

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        setUser,
        setClasses,
        classes,
        login,
        logOut,
        signUp,
        forceUpdate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
