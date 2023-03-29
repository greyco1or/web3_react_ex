import { Web3Provider } from '@ethersproject/providers';

export function getProvider(provider) {
    //provider에 메타마스크 등과 같은 써드파티, 플러그인들이 들어간다.
    const web3Provider = new Web3Provider(provider);

    //애는 없어도 되긴함
    web3Provider.pollingInterval = 1000;
    return web3Provider;
}