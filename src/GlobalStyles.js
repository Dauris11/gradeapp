import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color ${props => props.theme.transitions.base}, 
                color ${props => props.theme.transitions.base},
                border-color ${props => props.theme.transitions.base};
  }

  :root {
    color-scheme: ${props => props.theme.mode};
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text.primary};
    line-height: ${props => props.theme.typography.lineHeight.normal};
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    line-height: ${props => props.theme.typography.lineHeight.tight};
    color: ${props => props.theme.colors.slate[900]};
  }

  button {
    cursor: pointer;
    font-family: inherit;
    transition: all ${props => props.theme.transitions.base};
    border: none;
    outline: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.slate[300]};
    border-radius: 10px;
    
    &:hover {
      background: ${props => props.theme.colors.slate[400]};
    }
  }

  /* Animations */
  .page-transition-enter {
    opacity: 0;
    transform: translateY(10px);
  }
  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms, transform 300ms;
  }
  .page-transition-exit {
    opacity: 1;
    transform: translateY(0);
  }
  .page-transition-exit-active {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 300ms, transform 300ms;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Utility Classes */
  .glass {
    ${props => props.theme.glassmorphism}
  }
  
  /* Focus visible for accessibility */
  *:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

export default GlobalStyles;
