import styled from 'styled-components';
import { Connect } from './components/Connect';

const StyleAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`

function App() {
  return (
    <StyleAppDiv>
      <Connect />
    </StyleAppDiv>
  );
}

export default App;
