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

type Props = { children: ReactNode };
type User = Teacher | Student;

interface UserProviderData {
  token: string;
  user: User;
  classes: Class[];
  login: (email: string, password: string) => void;
}

const UserContext = createContext<UserProviderData>({} as UserProviderData);

export const CurrentUser = () => {
  const context = useContext(UserContext);
  return context;
};

export default function UserProvider({ children }: Props) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({} as User);
  const [classes, setClasses] = useState([] as Class[]);

  useEffect(() => {
    const currentToken = localStorage.getItem("@BCPlanner:token") || "";

    API.get("classes")
      .then((_) => setToken(currentToken))
      .catch((_) => setToken(""));
  }, []);

  const login = (email: string, password: string) => {
    API.post("/users", { email, password })
      .then((res) => {
        setToken(res.data.accessToken);
        localStorage.setItem("@BCPlanner:token", res.data.accessToken);

        setUser({ ...res.data.user });
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
