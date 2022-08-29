import { useState } from "react";
import { Modal, Input, ModalProps, useNotification } from "web3uikit";
import { NftListedProps } from "./NFTBox";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { ethers } from "ethers";

export interface UpdatedListingModalProps extends NftListedProps, ModalProps {}

export default function UpdateListingModal({
  nftAddress,
  tokenId,
  isVisible,
  onCloseButtonPressed,
  marketplaceAddress,
}: UpdatedListingModalProps) {
  const dispatch = useNotification()

  const [priceToUpdatedListingWith, setPriceToUpdateListingWith] = useState<
    string | undefined
  >("0");

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdatedListingWith || "0"),
    },
  });

  const handleUpdateListingSuccess = () => {

  }

  return (
    <Modal
      isVisible={isVisible}
      onCloseButtonPressed={onCloseButtonPressed}
      onCancel={onCloseButtonPressed}
      onOk={async () =>
        await updateListing({
          onError(error) {console.log(error)},
          onSuccess: () => handleUpdateListingSuccess()
        })
      }
    >
      <Input
        label="등록된 가격을 레이어1 화폐(ETH)단위로 업데이트 "
        name="new listing price"
        type="number"
        onChange={(event) => {
          setPriceToUpdateListingWith(event.target.value);
        }}
      />
    </Modal>
  );
}
