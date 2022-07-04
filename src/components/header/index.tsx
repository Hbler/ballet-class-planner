import { Logo } from "../../styles/global";
import { StyledHeader } from "./style";

export default function Header() {
  return (
    <StyledHeader>
      <div className="container">
        <Logo>Ballet Class Planner</Logo>
      </div>
    </StyledHeader>
  );
}
