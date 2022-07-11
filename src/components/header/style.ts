import styled from "styled-components";

export const StyledHeader = styled.header`
  height: 15vh;

  background-color: ${({ theme: { colors } }) => colors.bgAlpha};

  .container {
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    svg {
      right: 5rem;

      font-size: 2rem;
      position: absolute;

      :hover {
        cursor: pointer;
        color: ${({ theme: { colors } }) => colors.highlight};
      }
    }
  }
`;
