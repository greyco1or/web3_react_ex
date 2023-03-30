import { InjectedConnector } from '@web3-react/injected-connector';
//web3 react inject Connector 활용
export const injected = new InjectedConnector({
    //어떤 체인 support할지 명시. 이더리움의 경우 체인아이디는 1, hardhat test체인은 31337
    supportedChainIds: [1, 31337]
});