// eip-1193
interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
  }

declare function EthRequest(args:RequestArguments):any

export interface EthereumProvider {
    isMetaMask?: boolean;
    request: typeof EthRequest;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}