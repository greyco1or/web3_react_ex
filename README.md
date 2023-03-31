# Web3 React, Metamask, Solidity

frontend:   

![image](https://user-images.githubusercontent.com/104502156/229039173-eb08a570-150d-4568-a1a2-7bfab51b1800.png)


- web3 React provider: 전역적으로 Root에 위치. 하위에 여러 컴포넌트 구성

- connect.tsx: 메타마스크와 네트워크를 연동하거나 disconnect 할 수 있는 컴포넌트

- walletStatus.tsx: 연결된 이후에 관련된 chain ID나 account, balance, block number 등을 가져오는 컴포넌트

- SignMessage.tsx: 메타마스크를 통해서 메시지를 sing하는 컴포넌트

- ContractCall.tsx: 컨트랙트를 배포하고, 배포한 컨트랙트에 접근하는 컴포넌트




# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
