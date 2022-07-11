import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

import { ContextUser } from "../../providers/userProvider";
import { Logo } from "../../styles/global";
import { StyledHeader } from "./style";

interface HeaderProps {
  username?: string;
}

export default function Header({ username }: HeaderProps) {
  const { logOut } = ContextUser();
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <div className="container">
        <Logo>{username} Ballet Class Planner</Logo>
        {!!username && (
          <MdLogout
            onClick={() => {
              logOut(navigate);
            }}
          />
        )}
      </div>
    </StyledHeader>
  );
}
