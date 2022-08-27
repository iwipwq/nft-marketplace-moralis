// eip-1193
interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
  }

declare function EthRequest(args:RequestArguments):unknown

export interface EthereumProvider {
    isMetaMask?: boolean;
    request: typeof EthRequest;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

// Props
export interface NftListedProps {
    price?: string;
    nftAddress?: string;
    tokenId?: string;
    marketplaceAddress?: string;
    seller?: string;
    createdAt?: object;
    updatedAt?: object;
}