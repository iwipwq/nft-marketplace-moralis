import { useMoralis, useWeb3Contract } from "react-moralis";
import basicNftAbi from "../constants/BasicNft.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
import { Information, useNotification } from "web3uikit";
import { useState } from "react";
import { BigNumberish } from "ethers";

interface NftMarketplace {
  nftMarketplace: string[];
}

interface NetworkMapping {
  [chainId: string]: NftMarketplace;
}

export default function Withdraw() {
  const [proceeds, setProceeds] = useState<string | undefined>();
  // function getProceeds(address seller) external view returns (uint256) {
  //     return s_proceeds[seller];
  // }
  const { chainId, account } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const dispatch = useNotification();

  const { runContractFunction: getProceeds } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: (networkMapping as NetworkMapping)[chainString][
      "nftMarketplace"
    ][0],
    functionName: "getProceeds",
    params: {
      seller: account,
    },
  });

  // function withdrawProceeds() external {
  //     uint256 proceeds = s_proceeds[msg.sender];
  //     if (proceeds <= 0) {
  //         revert NftMarketplace__NoProceeds();
  //     }
  //     s_proceeds[msg.sender] = 0;
  //     (bool success, ) = payable(msg.sender).call{value: proceeds}("");
  //     if (!success) {
  //         revert NftMarketplace__TransferFailed();
  //     }
  // }

  const { runContractFunction: withdrawProceeds } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: (networkMapping as NetworkMapping)[chainString][
      "nftMarketplace"
    ][0],
    functionName: "withdrawProceeds",
    params: {},
  });

  async function handleGetProceedsSuccess() {
    dispatch({
      position: "topR",
      type: "success",
      title: "잔액 조회",
      message: "잔액 조회에 성공했습니다.",
      icon: "bell",
    });
  }

  async function handleWithdrawProceedsSuccess() {
    dispatch({
      position: "topR",
      type: "success",
      title: "수익 인출 성공",
      message: "수익을 정상적으로 인출했습니다.",
      icon: "bell",
    });
  }

  async function OnClickGetProceeds() {
    const returnedProceeds = (
      (await getProceeds({
        onError: () => console.log(Error),
        onSuccess: () => handleGetProceedsSuccess(),
      })) as BigNumberish
    ).toString();
    setProceeds(returnedProceeds);
  }

  async function OnClickWithdrawProceeds() {
    await withdrawProceeds({
      onError: () => console.log(Error),
      onSuccess: () => handleWithdrawProceedsSuccess(),
    });
  }

  return (
    <div className="mt-4">
      <Information
        id="Proceed Info"
        topic="총 판매 수익"
        information={proceeds ? proceeds : "잔액조회하기를 눌러주세요."}
      />
      <button
        className="mt-2 py-2 px-2 block border bg-indigo-500 hover:bg-indigo-700 rounded-md text-white"
        onClick={OnClickGetProceeds}
      >
        잔액조회하기
      </button>
      <button
        className={
          proceeds
            ? "mt-2 py-2 px-2 block border bg-indigo-500 hover:bg-indigo-700 rounded-md text-white"
            : "mt-2 py-2 px-2 block border bg-indigo-300 text-white rounded-md"
        }
        disabled={proceeds ? false : true}
        onClick={OnClickWithdrawProceeds}
      >
        {proceeds ? "수익인출하기" : "수익 인출하기(먼저 잔액을 조회해주세요)"}
      </button>
    </div>
  );
}
