import styled from 'styled-components';
import { Connect } from './components/Connect';
import { WalletStatus } from './components/WalletStatus';
import { SignMessage } from './components/SignMessage'
import { ContractCall } from './components/ContractCall';

const StyleAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`

function App() {
  return (
    <StyleAppDiv>
      <Connect />
      <WalletStatus />
      <SignMessage />
      <ContractCall />
    </StyleAppDiv>
  );
}

export default App;
