import ConnectButton from "./ConnectButton";
import Link from "next/link";
// import { ConnectButton } from "web3uikit";

const Header = () => {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl">NFT 마켓플레이스</h1>
      <div className="flex flex-row items-center">
        <Link href="/">
          <a className="mr-4 p-6">홈</a>
        </Link>
        <Link href="/sell-nft">
          <a className="mr-4 p-6">NFT 판매하기</a>
        </Link>
        <ConnectButton/>
      </div>
    </nav>
  );
};

export default Header;
