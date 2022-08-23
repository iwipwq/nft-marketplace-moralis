import Moralis from "moralis-v1/node.js";
import "dotenv/config";
import contractAddresses from "./constants/networkMapping.json";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.masterKey;

type ChainId = string | number;

let chainId: ChainId = process.env.chainId || 31337;
let moralisChainId = chainId == "31337" ? "1337" : chainId;

interface NftMarketplace {
  nftMarketplace: Array<string>;
}

interface ContractAddress {
  [prop: ChainId]: NftMarketplace;
}

const I_contractAddresses: ContractAddress = contractAddresses;

const contractAddress = I_contractAddresses[chainId]["nftMarketplace"][0];

console.log(chainId); // 31337
console.log(typeof chainId); // string
console.log(contractAddress);

async function main() {
  console.log("안녕하세요");
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log(`다음 계약에서 작업중입니다. Address: ${contractAddress}`);
  let itemListedOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "ItemListed(address, address, uint256, uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
    tableName: "ItemListed",
  };
  let itemBoughtOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "ItemBought(address, address, uint256, uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
    tableName: "ItemBought",
  };
  let itemCanceledOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "ItemCanceled(address,address,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCanceled",
      type: "event",
    },
    tableName: "ItemCanceled",
  };

  const listedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemListedOptions,
    {
      useMasterKey: true,
    }
  );
  const boughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemBoughtOptions,
    {
      useMasterKey: true,
    }
  );
  const canceledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemCanceledOptions,
    {
      useMasterKey: true,
    }
  );

  if (
    listedResponse.success &&
    boughtResponse.success &&
    canceledResponse.success
  ) {
    console.log("성공! 데이터베이스가 이벤트를 감지하여 업데이트 되었습니다.");
  } else {
    console.log(listedResponse);
    console.log(boughtResponse);
    console.log(canceledResponse);
    console.log("실패... 무언가 잘못되었습니다...");
  }
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
