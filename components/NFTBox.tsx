import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { NftListedProps } from "../common/types";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import BasicNftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card } from "web3uikit";
import { ethers, BigNumberish } from "ethers";

export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  seller,
}: NftListedProps) {
  const [imageURI, setImageURI] = useState<string | undefined>();
  const [tokenName, setTokenName] = useState<string | undefined>();
  const [tokenDesc, setTokenDesc] = useState<string | undefined>();
  const [tokenAttr, setTokenAttr] = useState<object | undefined>();
  const { isWeb3Enabled } = useMoralis();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: BasicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

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

  return (
    <Card>
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
          <div className="italic text-sm">판매자:{seller}</div>
          <div className="font-bold">
            {ethers.utils.formatUnits(price as BigNumberish, "ether")} ETH
          </div>
        </div>
      ) : (
        <div>이미지 로딩중 ...</div>
      )}
    </Card>
  );
}
