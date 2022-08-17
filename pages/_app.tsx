import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NFT 마켓</title>
        <meta name="description" content="NFT를 거래할 수 있는 장터입니다." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <Header />
        <Component {...pageProps} />
      </MoralisProvider>
    </>
  );
}

export default MyApp;
