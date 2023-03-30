//여러 컴포넌트에서 사용하는 유틸리티 hooks

import { useWeb3React } from "@web3-react/core";
import { useEffect, useState, useCallback } from "react";
import { injected } from "./connectors";

export function useWeb3Connect() {
    //activate: 함수, active: Web3React hook안에 있는 변수
    const { activate, active } = useWeb3React();
    //web3 connect를 통해서 시도를 했는지 확인하기 위한 변수저장
    const [tried, setTried ]  = useState(false);

    const tryActivate = useCallback(() => {
        async function _tryActivate() {
            //injected connector를 이용해서 연결이 됐는지 확인
            const isAuthorized = await injected.isAuthorized();

            if(isAuthorized) {
                try {
                    await activate(injected, undefined, true) 
                } catch (error) {
                    window.alert(("Error: ") + (error && error.message));
                }
            }
            //시도했으니까 true로 state 업데이트
            setTried(true);
        }
        _tryActivate()
    }, [activate])

    //tryActivate가 있을 경우 tryActivate하는 구문
    useEffect(() => {
        tryActivate();
    }, [tryActivate]);
    //connection이후에 tried 여부 확인을 위한 구문
    useEffect(() => {
        if (!tried && active) {
            setTried(true)
        }
    }, [tried, active]);

    return tried;
}

//이더리움 자체에 대한 라이브러리를 가져오고, 이더리움 상태에 따라서 체인이 바뀌거나 account가 바뀌는 이벤트 등을 감지해서 Web3리엑트 훅을 이용해서 자동적으로 연결
export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3React();

    useEffect(() => {
        //브라우저에 있는 이더리움 감지
        const { ethereum } = window;

        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => { 
                console.log('handle connect');
                //이벤트 핸들러가 이벤트를 감지하면 activate함수 연결
                activate(injected);
            }
            const handleChainChanged = (chainId) => {
                console.log('handleChainChanged', chainId);
                activate(injected);
            }
            const handleAccountsChanged = (accounts) => {
                console.log('handleAccountsChanged', accounts);
                if(accounts.length > 0) {
                    activate(injected);
                }
            }
            
            ethereum.on('conncet', handleConnect);
            //체인 변경 이벤트 감지
            ethereum.on('chainChanged', handleChainChanged);
            //account 변경 이벤트 감지
            ethereum.on('accountsChanged', handleAccountsChanged);
            
            //cleaner function
            return () => {
                if (ethereum.removeListner) {
                    ethereum.removeListner('connect', handleConnect);
                    ethereum.removeListner('chainChanged', handleChainChanged);
                    ethereum.removeListner('accountsChanged', handleAccountsChanged);
                }
            }
        }
    }, [active, error, suppress, activate])
}