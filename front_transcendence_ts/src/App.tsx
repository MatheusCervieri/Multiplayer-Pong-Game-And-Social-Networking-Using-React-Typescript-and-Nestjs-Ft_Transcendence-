import Displayroute from './Displayroute';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    margin: 0;
    padding: 0;
  }
`;

function App() {

  return (
    <>
    <GlobalStyle />
    <ToastContainer />
    <Displayroute/>
    </>
  );
}

export default App;
