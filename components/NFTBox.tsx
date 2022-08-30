import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import BasicNftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers, BigNumberish } from "ethers";
import { truncateStr } from "../common/utils";
import UpdateListingModal from "./UpdateListingModal";

export interface NftListedProps {
  price?: string;
  nftAddress?: string;
  tokenId?: string;
  marketplaceAddress?: string;
  seller?: string;
  createdAt?: object;
  updatedAt?: object;
}

export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  seller,
}: NftListedProps) {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState<string | undefined>();
  const [tokenName, setTokenName] = useState<string | undefined>();
  const [tokenDesc, setTokenDesc] = useState<string | undefined>();
  const [tokenAttr, setTokenAttr] = useState<object | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const dispatch = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: BasicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: NftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    }
  })

  async function updateUI() {
    const tokenURI = await getTokenURI();
    console.log(tokenURI);

    if (tokenURI) {
      // IPFS Gateway : A server that will return IPFS files from a "normal" URL
      const requestURL = (tokenURI as string).replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      );
      console.log(requestURL);
      const tokenURIResponse = await (await fetch(requestURL)).json();
      console.log(tokenURIResponse);
      const imageURI = tokenURIResponse.image;
      const name = tokenURIResponse.name;
      const description = tokenURIResponse.description;
      const attributes = tokenURIResponse.attributes;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(name);
      setTokenDesc(description);
      setTokenAttr(attributes);
    }
    // get the tokenURI
    // using the image tag from the tokenURI, get the image
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? "나"
    : truncateStr(seller || "", 15);

  const handleCardClick = () => {
    isOwnedByUser ? setShowModal(true) : buyItem({
      onError: (error) => console.log(error),
      onSuccess: () => handleBuyItemSuccess()
    })
  };

  const handleBuyItemSuccess = async function () {
    dispatch({
      type:"success",
      position:"topR",
      title:"아이템 구매 성공",
      icon:"bell",
      message:"NFT 구매에 성공했습니다."
    })
  }

  const onClose = () => {
    isOwnedByUser
      ? (console.log("triggerd"), setShowModal(false))
      : console.log("NFT소유자가 아니여서 명령을 수행할 수 없습니다.");
  };

  return (
    <>
      <UpdateListingModal
        children={<></>}
        isVisible={showModal}
        onCloseButtonPressed={onClose}
        nftAddress={nftAddress}
        tokenId={tokenId}
        marketplaceAddress={marketplaceAddress}
      />
      <Card onClick={handleCardClick}>
        {imageURI ? (
          <div className="mx-2 my-2">
            <Image
              className="object-cover"
              loader={() => imageURI}
              src={imageURI}
              width="200"
              height="200"
            />
            <h2 className="font-bold text-lg">
              # {tokenId} {tokenName}
            </h2>
            <div className="italic text-sm">
              소유자:{formattedSellerAddress}
            </div>
            <div className="font-bold">
              {ethers.utils.formatUnits(price as BigNumberish, "ether")} ETH
            </div>
          </div>
        ) : (
          <div>이미지 로딩중 ...</div>
        )}
      </Card>
    </>
  );
}
