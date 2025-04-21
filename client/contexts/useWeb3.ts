import { useState } from "react";
import StableTokenABI from "./cusd-abi.json";
import MinipayNFTABI from "./minipay-nft.json";
import {
    createPublicClient,
    createWalletClient,
    custom,
    getContract,
    http,
    parseEther,
    stringToHex
} from "viem";
import { celoAlfajores, celo } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});

const cUSDTokenAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
const MINIPAY_NFT_CONTRACT = "0xE8F4699baba6C86DA9729b1B0a1DA1Bd4136eFeF";

export const useWeb3 = () => {
    const [address, setAddress] = useState<string | null>(null);
    const { data: walletClient } = useWalletClient();
    const { address: wagmiAddress } = useAccount();

    const getUserAddress = async () => {
        if (wagmiAddress) {
            setAddress(wagmiAddress);
            return wagmiAddress;
        }
        
        if (typeof window !== "undefined" && window.ethereum) {
            const client = createWalletClient({
                transport: custom(window.ethereum),
                chain: celoAlfajores,
            });
            const [addr] = await client.getAddresses();
            setAddress(addr);
            return addr;
        }
        return null;
    };

    const _sendCUSD = async (to: string, amount: string) => {
        try {
            if (!walletClient) throw new Error("Wallet not connected");
            
            const amountInWei = parseEther(amount);
            const tx = await walletClient.writeContract({
                address: cUSDTokenAddress,
                abi: StableTokenABI.abi,
                functionName: "transfer",
                account: walletClient.account.address,
                args: [to, amountInWei],
            });
    
            let receipt = await publicClient.waitForTransactionReceipt({
                hash: tx,
            });
    
            return receipt;
        } catch(e) {
            console.log(e);
            throw e;
        }
    };

    const sendCUSD = async (to: string, amount: string) => {
        try {
            if (!walletClient) throw new Error("Wallet not connected");
    
            console.log('🟡 Preparing to send CUSD:', amount, 'to', to);
            const amountInWei = parseEther(amount);
    
            const tx = await walletClient.writeContract({
                address: cUSDTokenAddress,
                abi: StableTokenABI.abi,
                functionName: "transfer",
                account: walletClient.account.address,
                args: [to, amountInWei],
            });
    
            console.log('🟢 Transaction sent:', tx);
            alert('Transaction sent! Waiting for confirmation...');
    
            let receipt = await publicClient.waitForTransactionReceipt({
                hash: tx,
            });
    
            console.log('✅ Transaction confirmed!', receipt);
            alert('Transaction successful!');
            return receipt;
        } catch (e: any) {
            console.error('❌ Error sending CUSD:', e);
            alert(`Error sending CUSD: ${e?.message || e}`);
            throw e;
        }
    };
    
    const mintMinipayNFT = async () => {
        if (!walletClient) throw new Error("Wallet not connected");

        const tx = await walletClient.writeContract({
            address: MINIPAY_NFT_CONTRACT,
            abi: MinipayNFTABI.abi,
            functionName: "safeMint",
            account: walletClient.account.address,
            args: [
                walletClient.account.address,
                "https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/sections/2023/hero-top/products/minipay/minipay__desktop@2x.a17626ddb042.webp",
            ],
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    };

    const getNFTs = async () => {
        if (!walletClient) throw new Error("Wallet not connected");

        const minipayNFTContract = getContract({
            abi: MinipayNFTABI.abi,
            address: MINIPAY_NFT_CONTRACT,
            client: publicClient,
        });

        const nfts: any = await minipayNFTContract.read.getNFTsByAddress([
            walletClient.account.address,
        ]);

        let tokenURIs: string[] = [];

        for (let i = 0; i < nfts.length; i++) {
            const tokenURI: string = (await minipayNFTContract.read.tokenURI([
                nfts[i],
            ])) as string;
            tokenURIs.push(tokenURI);
        }
        return tokenURIs;
    };

    const signTransaction = async () => {
        if (!walletClient) throw new Error("Wallet not connected");

        const res = await walletClient.signMessage({
            account: walletClient.account.address,
            message: stringToHex("Hello from Celo Composer MiniPay Template!"),
        });

        return res;
    };

    return {
        address: walletClient?.account.address || address,
        getUserAddress,
        sendCUSD,
        mintMinipayNFT,
        getNFTs,
        signTransaction,
    };
};