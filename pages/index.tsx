import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useMoralis, useMoralisQuery } from "react-moralis";
import styles from "../styles/Home.module.css";
import NFTBox from "../components/NFTBox";

const Home: NextPage = () => {
  const { isWeb3Enabled } = useMoralis();
  const {
    data: listedNfts,
    isFetching: fetchingListedNfts,
    error: reqError,
  } = useMoralisQuery(
    // TableName
    // Function for the query
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  );
  console.log(fetchingListedNfts);
  console.log(reqError);
  console.log(listedNfts);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">최근 등록됨</h1>
      <div className="flex flex-wrap gap-4">
        {isWeb3Enabled 
        ? fetchingListedNfts
          ? "로딩중 ... "
          : listedNfts.map((nft) => {
              console.log(nft.attributes);
              const {
                createdAt,
                marketplaceAddress,
                nftAddress,
                price,
                seller,
                tokenId,
                updatedAt,
              } = nft.attributes;
              return (
                <div className="mt-4">
                  <NFTBox
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                  />
                </div>
              );
            })
        : <div>web3 연결이 끊어졌습니다.</div>}   
      </div>
    </div>
  );
};

export default Home;
