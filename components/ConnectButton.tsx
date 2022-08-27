import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
// import { EthereumProvider } from "../common/types";
const ConnectButton: React.FC = () => {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    deactivateWeb3,
    logout,
    Moralis,
    isWeb3EnableLoading,
  } = useMoralis();

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
      console.log(`계정이 ${account} 로 변경되었습니다.`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log(
          "비어있는 계정(null account)이 감지되어 연결을 해제했습니다."
        );
      }
    });
  }, []);

  const onClickHandler = async () => {
    console.log("handler start");
    if (isWeb3Enabled) {
      console.log("isWeb3Enabled true");
      window.localStorage.removeItem("connected");
      console.log("delete localStorage Item");
      deactivateWeb3();
      return;
    }
    console.log("await enalbeWeb3");
    await enableWeb3();
    if (typeof window !== "undefined") {
      localStorage.setItem("connected", "injected");
    }
  };

  const walletAddress = async () => {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
          method: "eth_requestAccounts",
          params: [
              {
                eth_accounts: {}
              }
            ]
        });
    }
  };

  const getPermissionsResponse = async () => {
    if(typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
            method: 'wallet_getPermissions'
        })
    }
}

// interface Promise<T> {
//     accounts(onfinally?: (() => void) | undefined | null): Promise<T>
// }

async function accounts(){
    if(typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{
                eth_accounts: {}
            }]
        })
        await window.ethereum!.request({
            method: 'eth_requestAccounts'
        })
    }

}

  const requestTest = async() => {
    const abc = await walletAddress();
    console.dir(abc);
  }

  const perTest = async() => {
    const account = await accounts();
    console.dir(account);
  }
  //   const walletAddress = async() => {
  //     if(typeof window.ethereum !== "undefined")
  //     await window.ethereum.request!({
  //     method: "eth_requestAccounts",
  //     params: [
  //       {
  //         eth_accounts: {}
  //       }
  //     ]
  //   })
  // }

  console.log(
    "isWeb3Enabled",
    isWeb3Enabled,
    "isWeb3Loading",
    isWeb3EnableLoading
  );
  return (
    <>
      <button onClick={onClickHandler} disabled={isWeb3EnableLoading}>
        {isWeb3Enabled ? `${account?.slice(0,4)}...${account?.slice(-4)} 에 연결되었습니다` : `연결하기`}
      </button>
      {/* <button onClick={requestTest}>eth_requestAccounts Request</button>
      <button onClick={getPermissionsResponse}>getPermissions</button>
      <button onClick={perTest}>perTest</button> */}
    </>
  );
};

export default ConnectButton;
