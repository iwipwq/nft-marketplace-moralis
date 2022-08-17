import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useApiContract } from 'react-moralis'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  // How do we show the recently listed NFTs?

  // const value = await useApiContract.getListing(asdfasdf)
  // we will read from a database that has all the mapping in an easier to read data structure

  return (
    <div className={styles.container}>
      
    </div>
  )
}

export default Home
