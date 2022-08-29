import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID!;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       NotificationProvider: {children: Element[]}
//       foo: {}
//     }
//   }
// }

// type NotificationProvider = React.ReactNode


function MyApp({ Component, pageProps }: AppProps, DUMMY:any) {
  return (
    <>
      <Head>
        <title>NFT 마켓</title>
        <meta name="description" content="NFT를 거래할 수 있는 장터입니다." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <div></div>
        {/* <foo></foo> */}
        <NotificationProvider {...DUMMY}>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </>
  );
}

export default MyApp;
