import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ConnectButton: React.FC = () => {
  const { enableWeb3, isWeb3Enabled, account, deactivateWeb3 ,logout, Moralis, isWeb3EnableLoading } = useMoralis();
  
  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
        if (localStorage.getItem("connected")) {
            enableWeb3();
        }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`계정이 ${account} 로 변경되었습니다.`)
      if(account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("비어있는 계정(null account)이 감지되어 연결을 해제했습니다.")
      }
    })
  }, []);

  const onClickHandler = async () => {
    console.log("handler start")
    if(isWeb3Enabled) {
        console.log("isWeb3Enabled true");
        window.localStorage.removeItem("connected");
        console.log("delete localStorage Item");
        deactivateWeb3();
        return
    }
    console.log("await enalbeWeb3");
    await enableWeb3();
    if (typeof window !== "undefined") {
      localStorage.setItem("connected", "injected");
    }
  };
  
  console.log("isWeb3Enabled",isWeb3Enabled,"isWeb3Loading",isWeb3EnableLoading);
  return (
    <button onClick={onClickHandler} disabled={isWeb3EnableLoading}>
      {isWeb3Enabled ? `${account}에 연결되었습니다` : `연결하기`}
    </button>
  );
};

export default ConnectButton;
