import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useMoralisQuery } from "react-moralis";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  // How do we show the recently listed NFTs?

  // const value = await useApiContract.getListing(asdfasdf)
  // we will read from a database that has all the mapping in an easier to read data structure

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

  // createdAt: Thu Aug 25 2022 15:40:03 GMT+0900 (한국 표준시) {}
  // marketplaceAddress: "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  // nftAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
  // price: "100000000000000000"
  // seller: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  // tokenId: "0"
  // updatedAt: Thu Aug 25 2022 15:40:03 GMT+0900 (한국 표준시)

  return (
    <div className={styles.container}>
      {fetchingListedNfts
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
                <p>createdAt: {createdAt.toString()}.</p>
                <p>marketplaceAddress: {marketplaceAddress}.</p>
                <p>nftAddress: {nftAddress}.</p>
                <p>Price: {price}.</p>
                <p>Seller: {seller}.</p>
                <p>tokenId: {tokenId}.</p>
                <p>updatedAt: {updatedAt.toString()}</p>
              </div>
            );
          })}
    </div>
  );
};

export default Home;
