import styled from "styled-components";
import { mq } from "../../styles/global";

export const StyledAccess = styled.form`
  width: 100%;
  height: fit-content;
  max-width: 350px;
  margin: auto;
  padding: 0.8rem;

  border-radius: 5px;
  background-color: ${({ theme: { colors } }) => colors.text};

  ${mq[2]} {
    margin: 10vh auto 0;
  }

  p {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    text-align: center;

    a {
      text-decoration: none;
      color: ${({ theme: { colors } }) => colors.bg};
      :hover {
        color: ${({ theme: { colors } }) => colors.bgAlpha};
      }
    }
  }
`;

export const StyledInternal = styled.form``;
