import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID!;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NFT 마켓</title>
        <meta name="description" content="NFT를 거래할 수 있는 장터입니다." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <Header />
        <Component {...pageProps} />
      </MoralisProvider>
    </>
  );
}

export default MyApp;
