import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.slate[900]};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.slate[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.slate[400]};
    border-radius: ${props => props.theme.borderRadius.lg};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.slate[500]};
  }

  /* Focus visible for accessibility */
  *:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

export default GlobalStyles;
