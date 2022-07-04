import styled from "styled-components";

export const InputContainer = styled.div`
  padding: 0.5rem 0;

  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  input {
    height: 45px;
    padding: 0 0.8rem;

    font-size: 1rem;
    color: ${({ theme: { colors } }) => colors.secondaryText};

    border: none;
    border-radius: 3px 3px 0 0;
    border-bottom: 2px solid;
    border-color: ${({ theme: { colors } }) => colors.secondaryText};
    background-color: ${({ theme: { colors } }) => colors.bg};

    ::placeholder {
      color: ${({ theme: { colors } }) => colors.text};
    }
  }

  small {
    margin-top: 0.3rem;
    color: ${({ theme: { colors } }) => colors.bg};
  }
`;
