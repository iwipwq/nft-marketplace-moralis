import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Form, iconTypes, useNotification } from "web3uikit";
import { DataInput } from "web3uikit/dist/components/Form/types";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import basicNftAbi from "../constants/BasicNft.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json"
import { useMoralis, useWeb3Contract } from "react-moralis";
import Withdraw from "../components/Withdraw";

declare module "web3uikit" {
  interface FormProps {
    children?: React.ReactNode;
  }
}

interface NftMarketPlace {
  nftMarketplace: string[]
}

interface NetworkMapping {
  [key:string]: NftMarketPlace 
}

const Home: NextPage = (FormProps: any) => {
  const {chainId} = useMoralis();
  //0x234
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const marketplaceAddress = (networkMapping as NetworkMapping)[chainString].nftMarketplace[0];
  const dispatch = useNotification()

  //@ts-ignore
  const { runContractFunction } = useWeb3Contract();

  async function apporveAndList(data:any) {
    console.log("승인하는중...");
    const nftAddress = data.data[0].inputResult
    const tokenId = data.data[1].inputResult
    const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString(); 

    const approveOptions = {
      abi: basicNftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId
      }
    }

    await runContractFunction({
      params: approveOptions,
      onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
      onError: (error) => console.log(error),

    })
  }

  async function handleApproveSuccess(nftAddress:string, tokenId:string, price:string) {
    console.log("승인이 완료되었습니다. 이제 NFT를 리스트에 등록하는 작업을 시작합니다 ...")
    const listOption = {
      abi:nftMarketplaceAbi,
      contractAddress:marketplaceAddress,
      functionName:"listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price
      }
    }
    await runContractFunction({
      params: listOption,
      onSuccess: () => handleListSuccess(),
      onError: (error) => console.log(error)
    })
  }

  async function handleListSuccess() {
    console.log("NFT 리스팅에 성공했습니다.");
    dispatch({
      type: "success",
      position: "topR",
      title: "NFT 판매 등록 성공",
      message: "NFT를 판매 목록에 등록했습니다.",
      icon: "bell",
    })
  }

  return (
    <div className={styles.container}>
      <Form
        onSubmit={apporveAndList}
        title="NFT 판매하기"
        data={[
          {
            name: "NFT 주소",
            type: "text",
            value: "",
            inputWidth: "50%",
            key: "nftAddress",
          },
          { name: "Token ID", type: "number", value: "", key: "tokenId" },
          { name: "Price (in ETH)", type: "number", value: "", key: "price" },
        ]}
        id="Main Form"
        {...FormProps}
      ></Form>
      <Withdraw/>
    </div>
  );
};

export default Home;
