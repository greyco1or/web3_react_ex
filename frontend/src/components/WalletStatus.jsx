import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ethers } from 'ethers'

const StyleWalletStatusDiv = styled.div`
    display: flex;
    gap: 20px;
`


function ChainId() {
    const { chainId } = useWeb3React();
    return (
        <>
        <span>Chain Id : </span>
        <span>{chainId}</span>
        </>
    )
}

//library를 통해서 해당되는 블록넘버나 함수를 가져올 수 있기에 library를 참조한다.
function BlockNumber() {
    const { chainId, library } = useWeb3React();

    const [BlockNumber, setBlockNumber] = useState();

    useEffect(() => {
        //라이브러리 없으면 리턴
        if (!library) return;
        
        let state = false;
        async function getBlockNumber() {
            try {
                const blockNumber = await library.getBlockNumber();
                if (!state) {
                    setBlockNumber(blockNumber);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getBlockNumber();

        //블록 이벤트를 받으면 setBlockNumber 호출
        library.on('block', setBlockNumber)

        //클리어하는 로직
        return () => {
            state = true;
            library.removeListener('block', setBlockNumber);
            setBlockNumber(undefined);
        }
    }, [library, chainId])

    return (
        <>
            <span>Block Number : </span>
            <span>{BlockNumber}</span>
        </>
    )
}

function Account() {
    const { account } = useWeb3React();

    return (
        <>
            <span>Account: </span>
            <span>{account ? `${account.substring(0, 6)}...${account.substring(account.length-4)}` : ''}</span>
        </>
    )
}

function Balance() {
    const { account, library, chainId } = useWeb3React();
    const [balance, setBalance] = useState();

    useEffect(() => {
        let stale = false;
        if(typeof account === 'undefined' || account === null || !library){
            return;
        }
        async function getBalance() {
            try {
                const balance = await library.getBalance(account);
                if(!stale) {
                    setBalance(balance);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getBalance();

        library.on('block', getBalance);

        return () => {
            stale = true;
            library.removeListener('block', getBalance);
            setBalance(undefined);
        }
    }, [account,library, chainId])

    return (
        <>
            <span>Balance :</span>
            <span>{balance ? `${ethers.utils.formatEther(balance)} ETH` : ''}</span>
        </>
    )
}    

function NextNonce() {
    const { account, library, chainId } = useWeb3React();
    const [nextNonce, setNextNonce] = useState();
    
    useEffect(() => {
        if(typeof account === 'undefined' || account === null || !library){
            return;
        }
        let stale = false;
        async function getNextNounce() {
            try {
                const nextNonce = await library.getTransactionCount(account);
                if(!stale) {
                    setNextNonce(nextNonce);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getNextNounce();

        library.on('block', getNextNounce)

        return () => {
            stale = true;
            //setNextNonce(undefined);
        }
    })

    return (
        <>
            <span>NextNonce : </span>
            <span>{nextNonce ? nextNonce : 'none'}</span>
        </>
    )
}


export function WalletStatus() {
    return (
        <StyleWalletStatusDiv>
            <ChainId />
            <BlockNumber />
            <Account />
            <Balance />
            <NextNonce />
        </StyleWalletStatusDiv>
    )
}