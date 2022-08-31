import { useState } from "react";
import { Modal, Input, ModalProps, useNotification } from "web3uikit";
import { NftListedProps } from "./NFTBox";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { ethers, ContractTransaction } from "ethers";

export interface UpdatedListingModalProps extends NftListedProps, ModalProps {
  onCloseButtonPressed: () => void
}

export default function UpdateListingModal({
  nftAddress,
  tokenId,
  isVisible,
  onCloseButtonPressed:onClose,
  marketplaceAddress,
}: UpdatedListingModalProps) {
  const dispatch = useNotification();

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

  function isContractTransaction (sus:any): sus is ContractTransaction {
    return (
      typeof sus === "object" && sus !== null && "wait" in sus
    )
  }

  const handleUpdateListingSuccess = async<T,>(tx?:T) => {
    console.log("모달창의 인풋값(수정된 가격)",priceToUpdatedListingWith);
    if(isContractTransaction(tx)) {
      const receipt = await tx.wait(1);
      console.log(receipt);
    }
    dispatch({
      type:"success",
      title:"트랜잭션 성공",
      message:"판매 NFT 정보를 수정했습니다.",
      icon:"update",
      position:"topR",
    })
    onClose && onClose();
    setPriceToUpdateListingWith("0");
  }

  console.log("수정 후 모달창의 인풋값",priceToUpdatedListingWith);
  return (
    <Modal
      isVisible={isVisible}
      onCloseButtonPressed={onClose}
      onCancel={onClose}
      onOk={async () =>
        await updateListing({
          onError(error) {console.log(error)},
          onSuccess: handleUpdateListingSuccess
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
