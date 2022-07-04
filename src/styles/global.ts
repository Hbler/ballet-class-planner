import styled, { createGlobalStyle } from "styled-components";
import { Theme } from "./theme";

const breakpoints = [576, 768, 992, 1200, 2000];
export const mq = breakpoints.map((bp) => `@media (min-width: ${bp}px)`);

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
:root{
    --toastify-color-light: ${({ theme: { colors } }) => colors.bg};
    --toastify-color-success: ${({ theme: { colors } }) => colors.success};
    --toastify-color-error: ${({ theme: { colors } }) => colors.error};
    --toastify-text-color-light: ${({ theme: { colors } }) => colors.text};
}

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Josefin Sans', sans-serif;
    transition: 0.2s;
}

body{
    color: ${({ theme: { colors } }) => colors.secondaryText};
    background-color: ${({ theme: { colors } }) => colors.bg};
    position: relative;


  ::after {
    content: "";
    inset: 0;
    opacity: 0.3;

    /* background-image: url("https://images.unsplash.com/photo-1593793516936-7a6b517c1075?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"); */
    background-image: url("https://images.pexels.com/photos/5154372/pexels-photo-5154372.jpeg");
    background-size: cover;
    background-position: center;

    position: fixed;
    z-index: -1;
  }
}

img{
    width: 100%;
}


ul,ol{
    list-style: none;
}

button{
    border: none;
    cursor: pointer;
}

.container{
    width: 100%;
    max-width: 1200px;
    margin: auto;
    padding: 0.8rem;
}
`;

export const Logo = styled.h1`
  font-size: 2.2rem;
  font-family: "Dancing Script", cursive;
  color: ${({ theme: { colors } }) => colors.secondaryText};
`;

export const AccessMain = styled.main`
  height: 85vh;
  padding-bottom: 1rem;

  overflow-y: scroll;

  .container {
    height: 100%;

    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    & > div {
      max-width: 350px;
      margin: auto;

      ${mq[2]} {
        margin: 12vh auto 0;
      }

      display: flex;
      flex-direction: column;
      gap: 1rem;

      border-radius: 10px;

      p {
        font-weight: 300;
        font-size: 1.1rem;
      }
    }
  }
`;

export const StyledP = styled.p`
  margin: 0 0 0.5rem 0;
`;
