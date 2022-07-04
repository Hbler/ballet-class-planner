import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
  classes: Class[];
  login: (email: string, password: string) => void;
  signUp: (newUser: newUser) => void;
}

const UserContext = createContext<UserProviderData>({} as UserProviderData);

export const ContextUser = () => {
  const context = useContext(UserContext);
  return context;
};

export default function UserProvider({ children }: UserProviderProps) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({} as User);
  const [classes, setClasses] = useState([] as Class[]);

  useEffect(() => {
    const currentToken = localStorage.getItem("@BCPlanner:token") || "";

    if (currentToken) {
      const auth = {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      };

      API.get("classes/", auth)
        .then((_) => setToken(currentToken))
        .catch((err) => {
          setToken("");
          console.log(err);
        });
    }
  }, []);

  const login = (email: string, password: string) => {
    API.post("login", { email, password })
      .then((res) => {
        setToken(res.data.accessToken);
        localStorage.setItem("@BCPlanner:token", res.data.accessToken);

        setUser({ ...res.data.user });
        user.updateClasses();
        setClasses(user.classes);
        setTimeout(() => {
          localStorage.removeItem("@BCPlanner:token");
          setToken("");
        }, 3.6e6);
      })
      .catch((err) => console.log(err));
  };

  const signUp = (newUser: newUser) => {
    console.log(newUser);

    API.post("register", newUser)
      .then((res) => {
        setToken(res.data.accessToken);
        localStorage.setItem("@BCPlanner:token", res.data.accessToken);

        setUser({ ...res.data.user });
        user.updateClasses();
        setClasses(user.classes);
        setTimeout(() => {
          localStorage.removeItem("@BCPlanner:token");
          setToken("");
        }, 3.6e6);
      })
      .catch((err) => console.log(err));
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        classes,
        login,
        signUp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
