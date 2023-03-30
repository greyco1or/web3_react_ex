import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { injected } from "../utils/connectors";
import { useInactiveListener, useWeb3Connect } from "../utils/hooks";
import styled from 'styled-components';
import { NoEthereumProviderError, UserRejectedRequestError } from "@web3-react/injected-connector";

const StyledActivatedButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: green;
    curosr: pointer;
`;

const StyledDeactivateButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: red;
    cursor: pointer;
`;


    //useWeb3React 라이브러리를 가져와서 메타마스크와 연동
    const Activate = () => {
        //useWeb3React를 사용하면 context를 통해서 어느 컴포넌트나 손쉽게 관련된 정보를 가져올 수 있다.
        const context = useWeb3React();
         
        const { activate, active } = context;
        const [activating, setActivating] = useState(false);

        //react handler
        const handleActivate = (event) => {
            //아래 버튼의 click 이벤트 기본동작 실행방지
            event.preventDefault();

            async function _activate() {
                setActivating(true);
                await activate(injected);
                setActivating(false);
            }
            _activate();
        }

        //브라우저 안에서 이더리움 라이브러리(메타마스크 등)가 탐지되면 자동으로 실행되도록 useInactiveListener 컴포넌트 이용
        const eagerConnectionSuccessful = useWeb3Connect();
        //false면 자동으로 연동됨
        useInactiveListener(!eagerConnectionSuccessful);

        //active 상태에 따라 버튼 활성화
        return (
            <StyledActivatedButton disabled={active} 
                style={{
                    borderColor: activating ? 'orange' : active ? 'unset' : 'green'
                }}
            onClick={handleActivate}>Connect</StyledActivatedButton>
        )
    }
    //메타마스크와 연동해제 컴포넌트
    const Deactivate = () => {
            const context = useWeb3React();
            const { deactivate, active } = context
            const handleDeactivate = (event) => {
                event.preventDefault();

                deactivate();
            }
            return (
                <StyledDeactivateButton disabled={!active}
                    style={{
                        borderColor: active ? 'red' : 'unset'
                    }}
                onClick={handleDeactivate}>Disconnect</StyledDeactivateButton>
            )
    }

    function getErrorMessage(error) {
        let errorMessage;

        switch (error.constructor) {
            case NoEthereumProviderError:
                errorMessage = 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
                break;
            case UnsupportedChainIdError:
                errorMessage = "You're connected to an unsupported network."
                break;
            case UserRejectedRequestError:
                errorMessage = 'Please authorize this website to access your Ethereum account.'
                break;
            default:
                errorMessage = error.message;
        }

        return errorMessage;
    }

    export function Connect() {
        const { error } = useWeb3React();

        if(error) {
            window.alert(getErrorMessage(error))
        }

        return (
            <>
                <Activate/>
                <Deactivate/>
            </>
        )
    }