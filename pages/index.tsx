import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useMoralisQuery } from 'react-moralis'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  // How do we show the recently listed NFTs?

  // const value = await useApiContract.getListing(asdfasdf)
  // we will read from a database that has all the mapping in an easier to read data structure

  const {data: listedNfts, isFetching: fetchingListedNfts, error: qError} = useMoralisQuery(
    // TableName
    // Function for the query
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  )
  console.log(fetchingListedNfts);
  console.log(qError);
  console.log(listedNfts);

  return (
    <div className={styles.container}>
      
    </div>
  )
}

export default Home
