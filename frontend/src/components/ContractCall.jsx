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

const StyledInput = styled.input`
    padding: 0.4rem 0.6rem;
`

const StyledButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: blue;
    cursor: pointer;
`

export function ContractCall() {
    const { active, library } = useWeb3React();
    //greetingContract는 contract object
    const [greetingContract, setGreetingContract] = useState();
    const [greetingContractAddr, setGreetingContractAddr] = useState('');
    const [signer, setSigner] = useState();
    const [greeting, setGreeting] = useState('');
    const [greetingInput, setGreetingInput] = useState('')

    useEffect(() => {
        //라이브러리가 없으면
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library])

    useEffect(() => {
        //컨트랙트가 배포되어있지 않을 경우
        if(!greetingContract) {
            return;
        }
        
        async function getGreeting(greetingContract) {
            const _greeting = await greetingContract.greet();

            //greeting 문자가 기존과 다를 경우에만 set해준다.
            if (_greeting !== greeting) {
                setGreeting(_greeting);
            }
        }

        getGreeting(greetingContract);
    }, [greetingContract, greeting])

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
                window.alert('Error: '+ (error && error.message ? `${error.message}` : ''))
            }

        }
        deployGreetingContract();
    }

    const handleGreetingChange = (event) => {
        event.preventDefault();
        setGreetingInput(event.target.value);
    }

    const handleGreetingSubmit = (event) => {
        event.preventDefault();

        if(!greetingContract) {
            window.alert('Undefined greeting Contract');
            return;
        }

        if(!greetingInput) {
            window.alert('Greeting Input cannot be empty');
            return;
        }

        async function submitGreeting(greetingContract) {
            try {
                const setGreetingTxn = await greetingContract.setGreeting(greetingInput);
                //setGreetingTxn 트랜잭션이 이루어질 때까지 await
                await setGreetingTxn.wait();
                
                const newGreeting = await greetingContract.greet();
                window.alert(`Success: ${newGreeting}`);

                if (newGreeting !== greeting) {
                    setGreeting(newGreeting);
                }
            } catch (error) {
                window.alert('Error: ' + (error && error.message ? `${error.message}` : ''));
            }
        }

        submitGreeting(greetingContract);
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
            <StyledGreetingDiv>
                <StyledLabel>Set new Greeting</StyledLabel>
                <StyledInput id="greetingInput" type="text" placeholder={greeting ? '' : 'Contract not yet deployed'}
                onChange={handleGreetingChange} />
                <StyledButton disabled={!active || !greetingContract ? true : false} onClick={handleGreetingSubmit}>Submit</StyledButton>
            </StyledGreetingDiv>
        </>
    )
}