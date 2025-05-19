import { useState, useEffect } from "react";
import StableTokenABI from "./cusd-abi.json";
// import MinipayNFTABI from "./minipay-nft.json";
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
    chain: celo,
    transport: http(),
});

const cUSDTokenAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
// const MINIPAY_NFT_CONTRACT = "0xE8F4699baba6C86DA9729b1B0a1DA1Bd4136eFeF";

export const useWeb3 = () => {
    const [address, setAddress] = useState<string | null>(null);
    const { data: walletClient } = useWalletClient();
    const { address: wagmiAddress } = useAccount();
    const [isWalletReady, setIsWalletReady] = useState(false);


    // Track wallet client readiness
    useEffect(() => {
        if (walletClient) {
            setIsWalletReady(true);
        } else {
            setIsWalletReady(false);
        }
    }, [walletClient]);

    const getUserAddress = async () => {
        if (wagmiAddress) {
            setAddress(wagmiAddress);
            return wagmiAddress;
        }
        
        if (typeof window !== "undefined" && window.ethereum) {
            const client = createWalletClient({
                transport: custom(window.ethereum),
                chain: celo,
            });
            const [addr] = await client.getAddresses();
            setAddress(addr);
            return addr;
        }
        return null;
    };

    const sendCUSD = async (to: string, amount: string) => {
        try {
            if (!walletClient) throw new Error("Wallet not connected");

            if(!(typeof window !== "undefined" && window.ethereum?.isMiniPay)){
                // 1. Request CELO funding from backend
                const fundingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fees/prepare-deposit`, {
                    method: 'GET',
                    credentials: "include"
                    // body: JSON.stringify({ address: walletClient.account.address }),
                });

                const { txHash } = await fundingResponse.json();

                // 2. Wait for CELO transaction confirmation
                await publicClient.waitForTransactionReceipt({ hash: txHash });
            }

            
 
    
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
            // alert('Transaction sent! Waiting for confirmation...');
    
            let receipt = await publicClient.waitForTransactionReceipt({
                hash: tx,
            });
    
            console.log('✅ Transaction confirmed!', receipt);
            // alert('Transaction successful!');
            return receipt;
        } catch (e: any) {
            console.error('❌ Error sending CUSD:', e);
            // alert(`Error sending CUSD: ${e?.message || e}`);
            throw e;
        }
    };
    

    const checkCUSDBalance = async (requiredAmount: string): Promise<{
        hasEnough: boolean;
        balance: string;
        required: string;
      }> => {
        try {
          if (!walletClient) throw new Error("Wallet not connected");
      
          // Get user address
          const userAddress = walletClient.account.address;
      
          // Create contract instance
          const cUSDContract = getContract({
            address: cUSDTokenAddress,
            abi: StableTokenABI.abi,
            client: publicClient,
          });
      
          // Get balance in wei (smallest unit)
          const balanceInWei = await cUSDContract.read.balanceOf([userAddress]);
          const balance = Number(balanceInWei) / 10**18; // Convert to cUSD (18 decimals)
          
          // Convert required amount to number
          const required = Number(requiredAmount);
      
          return {
            hasEnough: balance >= required,
            balance: balance.toFixed(2),
            required: required.toFixed(2),
          };
          
        } catch (e: any) {
          console.error('❌ Error checking cUSD balance:', e);
          throw new Error(`Failed to check balance: ${e?.message || e}`);
        }
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
        // mintMinipayNFT,
        // getNFTs,
        signTransaction,
        checkCUSDBalance,
        isWalletReady
    };
};