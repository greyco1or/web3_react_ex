import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import GreetingArtifact from "../artifacts/contracts/Greeting.sol/Greeting.json"
import styled from "styled-components"

const StyledDeployContractButton = styled.button`
    width: 180px;
    height: 2rem;
    border-radius: 1rem;
    border-color: blue;
    cursor: pointer;
    place-self: center;
`;

const StyledGreetingDiv = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

const StyledLabel = styled.label`
    font-weight: bold;
`

export function ContractCall() {
    const { active, library } = useWeb3React();
    //greetingContract는 contract object
    const [greetingContract, setGreetingContract] = useState();
    const [greetingContractAddr, setGreetingContractAddr] = useState('');
    const [signer, setSigner] = useState();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        //라이브러리가 없으면
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library])

    const handleDepolyContract = (event) => {
        event.preventDefault();

        //이미 배포된 상태면 배포할 필요가 없으니까 return
        if (greetingContract) {
            return;
        }

        //ContractFactory: contarctInterface(json안의 abi)과 contract bytecode(json안의 bytecode), signer가 매개변수로 들어간다.
        async function deployGreetingContract() {
            const Greeting = new ethers.ContractFactory(
                GreetingArtifact.abi,
                GreetingArtifact.bytecode,
                signer
            );
            
            try {
                //deploy의 매개변수: greeting.sol의 생성자 함수에 넣어줄 매개변수
                //deploy가 완료가 되면 컨트랙트가 배포되었다는 것이 아니라 배포되기 전의 트랜잭션을 구성하는 단계에 가깝다.
                const greetingContract = await Greeting.deploy('Hello, new visitor');
                //여기가 진짜 배포
                await greetingContract.deployed();

                const greeting = await greetingContract.greet();

                setGreetingContract(greetingContract);
                setGreeting(greeting);
                setGreetingContractAddr(greetingContract.address);
                window.alert(`Greeting deployed to : ${greetingContract.address}`)

            } catch (error) {
                window.alert('Error: ', (error && error.message ? `${error.message}` : ''))
            }

        }
        deployGreetingContract();
    }

    return (
        <>
            <StyledDeployContractButton disabled={!active || greetingContract ? true: false} onClick={handleDepolyContract}>Deploy Greeting Contract</StyledDeployContractButton>
            <StyledGreetingDiv>
                <StyledLabel>Contract address</StyledLabel>
                <div> {greetingContractAddr ? greetingContractAddr : 'Contract not yet deployed' }</div>
            </StyledGreetingDiv>
            <StyledGreetingDiv>
                <StyledLabel>Greeting</StyledLabel>
                <div>{greeting ? greeting : <>Contract not yet deployed</>}</div>
            </StyledGreetingDiv>
        </>
    )
}