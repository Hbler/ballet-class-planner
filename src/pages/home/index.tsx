import { useEffect } from "react";

import Header from "../../components/header";
import { ContextUser } from "../../providers/userProvider";

export default function Home() {
  const { user, checkLocalUser } = ContextUser();

  useEffect(() => {
    const savedUser = localStorage.getItem("@BCPlanner:user") || "";

    if (savedUser && Object.keys(user).length === 0) checkLocalUser(savedUser);
  }, [checkLocalUser, user]);

  return (
    <>
      <Header />
      <section>
        <h2>Olá {user.name}</h2>
      </section>
    </>
  );
}
