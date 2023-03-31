import styled from 'styled-components';
import { Connect } from './components/Connect';
import { WalletStatus } from './components/WalletStatus';

const StyleAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`

function App() {
  return (
    <StyleAppDiv>
      <Connect />
      <WalletStatus />
    </StyleAppDiv>
  );
}

export default App;
