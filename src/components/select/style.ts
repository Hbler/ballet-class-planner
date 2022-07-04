import styled from "styled-components";

export const SelectContainer = styled.div`
  padding: 0.5rem 0;

  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  select {
    height: 45px;
    padding: 0 0.8rem;

    font-size: 1rem;
    color: ${({ theme: { colors } }) => colors.secondaryText};

    border: none;
    border-radius: 3px 3px 0 0;
    border-bottom: 2px solid;
    border-color: ${({ theme: { colors } }) => colors.secondaryText};
    background-color: ${({ theme: { colors } }) => colors.bg};
  }
`;
