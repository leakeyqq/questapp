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
    stringToHex,
} from "viem";
import { celoAlfajores, celo } from "viem/chains";

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});

// const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Testnet
const cUSDTokenAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a"
const MINIPAY_NFT_CONTRACT = "0xE8F4699baba6C86DA9729b1B0a1DA1Bd4136eFeF"; // Testnet

export const useWeb3 = () => {
    const [address, setAddress] = useState<string | null>(null);

    const getUserAddress = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            let walletClient = createWalletClient({
                transport: custom(window.ethereum),
                chain: celoAlfajores,
            });

            let [address] = await walletClient.getAddresses();
            setAddress(address);
        }
    };

    const _sendCUSD = async (to: string, amount: string) => {
        try{
            console.log('I want to call send CUSD')
            let walletClient = createWalletClient({
                transport: custom(window.ethereum),
                chain: celoAlfajores,
            });
    
            let [address] = await walletClient.getAddresses();
    
            const amountInWei = parseEther(amount);
    
            const tx = await walletClient.writeContract({
                address: cUSDTokenAddress,
                abi: StableTokenABI.abi,
                functionName: "transfer",
                account: address,
                args: [to, amountInWei],
            });
    
            let receipt = await publicClient.waitForTransactionReceipt({
                hash: tx,
            });
    
            return receipt;
        }catch(e){
            console.log(e)
            throw e
        }

    };

    const sendCUSD = async (to: string, amount: string) => {
        try {
            console.log('🟡 Preparing to send CUSD:', amount, 'to', to);
    
            let walletClient = createWalletClient({
                transport: custom(window.ethereum),
                chain: celo,
            });
    
            let [address] = await walletClient.getAddresses();
    
            const amountInWei = parseEther(amount);
    
            const tx = await walletClient.writeContract({
                address: cUSDTokenAddress,
                abi: StableTokenABI.abi,
                functionName: "transfer",
                account: address,
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
        console.log('I want to call mint nft')

        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
            address: MINIPAY_NFT_CONTRACT,
            abi: MinipayNFTABI.abi,
            functionName: "safeMint",
            account: address,
            args: [
                address,
                "https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/sections/2023/hero-top/products/minipay/minipay__desktop@2x.a17626ddb042.webp",
            ],
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return receipt;
    };

    const getNFTs = async () => {
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const minipayNFTContract = getContract({
            abi: MinipayNFTABI.abi,
            address: MINIPAY_NFT_CONTRACT,
            client: publicClient,
        });

        const [address] = await walletClient.getAddresses();
        const nfts: any = await minipayNFTContract.read.getNFTsByAddress([
            address,
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
        let walletClient = createWalletClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        let [address] = await walletClient.getAddresses();

        const res = await walletClient.signMessage({
            account: address,
            message: stringToHex("Hello from Celo Composer MiniPay Template!"),
        });

        return res;
    };

    return {
        address,
        getUserAddress,
        sendCUSD,
        mintMinipayNFT,
        getNFTs,
        signTransaction,
    };
};
