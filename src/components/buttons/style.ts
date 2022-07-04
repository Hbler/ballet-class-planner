import styled, { css } from "styled-components";

interface Props {
  color?: string;
  size?: string;
}
export const StyledBtn = styled.button<Props>`
  width: 100%;
  margin: 0.5rem 0;
  padding: 0 0.8rem;

  font-size: 1.2rem;
  color: ${({ theme: { colors } }) => colors.secondaryText};

  border-radius: 5px;
  cursor: pointer;

  ${({ color }) => {
    switch (color) {
      case "pink":
        return css`
          font-weight: 400;
          background-color: ${({ theme: { colors } }) => colors.highlight};
          :hover {
            font-weight: 300;
            color: ${({ theme: { colors } }) => colors.secondaryText};
            background-color: ${({ theme: { colors } }) => colors.secondary};
          }
        `;
      default:
        return css`
          font-weight: 400;
          border: 1px solid;
          border-color: ${({ theme: { colors } }) => colors.secondaryText};
          background-color: ${({ theme: { colors } }) => colors.text};
          :hover {
            font-weight: 300;
            color: ${({ theme: { colors } }) => colors.secondaryText};
            border: none;
            background-color: ${({ theme: { colors } }) => colors.primary};
          }
        `;
    }
  }}

  ${({ size }) => {
    switch (size) {
      case "sm":
        return css`
          height: 30px;
        `;
      case "lg":
        return css`
          height: 60px;
        `;
      default:
        return css`
          height: 45px;
        `;
    }
  }}
`;
