import { useState, useEffect } from "react";
import StableTokenABI from "./cusd-abi.json";
import QuestPandaABI from "./questpanda-abi.json"
// import MinipayNFTABI from "./minipay-nft.json";
import {
    createPublicClient,
    createWalletClient,
    custom,
    decodeEventLog,
    encodeFunctionData,
    getContract,
    http,
    parseEther,
    stringToHex
} from "viem";
import { celoAlfajores, celo } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { getDataSuffix, submitReferral } from '@divvi/referral-sdk'

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

const approveSpending = async (amount: string, tokenSymbol: string) => {


    try {
        if (!walletClient) throw new Error("Wallet not connected");

        const spenderAddress = process.env.NEXT_PUBLIC_QUESTPANDA_SMART_CONTRACT;

        if (!spenderAddress) {
        throw new Error("❌ Environment variable spenderAddress is not defined");
        }

        let decimals = checkDecimals(tokenSymbol)

        const amountInWei = (Number(amount) * (10**decimals));
        const tokenContractAddress = checkContractAddress(tokenSymbol)

        const txHash = await walletClient.writeContract({
            address: tokenContractAddress,
            abi: StableTokenABI.abi,
            functionName: "approve",
            account: walletClient.account.address,
            args: [spenderAddress, amountInWei],
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        return receipt;
    } catch (error) {
        throw error
    }

};
const createQuest = async (prizePool: string, tokenSymbol: string) => {
    try {
        if (!walletClient) throw new Error("Wallet not connected");

        const createQuestContractAddress = process.env.NEXT_PUBLIC_QUESTPANDA_SMART_CONTRACT as `0x${string}`;;

        if (!createQuestContractAddress) {
        throw new Error("❌ Environment variable createQuestContractAddress is not defined");
        }

        let decimals = checkDecimals(tokenSymbol)
        const tokenContractAddress = checkContractAddress(tokenSymbol)
        const amountInWei = (Number(prizePool) * (10**decimals));

        const nonce = await publicClient.getTransactionCount({ address: walletClient.account.address });
          const txHash = await walletClient.writeContract({
            address: createQuestContractAddress,
            abi: QuestPandaABI,
            functionName: "createQuestAsBrand",
            account: walletClient.account.address,
            args: [amountInWei, tokenContractAddress],
            nonce: nonce
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        console.log('receipt')
        // get the matching log
        const questCreatedLog = receipt.logs.find((log) => {
        try {
            const decoded = decodeEventLog({
            abi: QuestPandaABI,
            data: log.data,
            topics: log.topics,
            });
            return decoded.eventName === 'QuestCreatedByBrand';
        } catch {
            return false;
        }
        });

        if (!questCreatedLog) {
        throw new Error("❌ QuestCreated event not found in logs");
        }

        // Decode with assertion
        const decoded = decodeEventLog({
            abi: QuestPandaABI,
            data: questCreatedLog.data,
            topics: questCreatedLog.topics,
        }) as unknown as {
        eventName: 'QuestCreatedByBrand';
        args: {
            questId: bigint;
            brand: `0x${string}`;
            token: `0x${string}`;
            prizePool: bigint;
        };
        };

        const questId = decoded.args.questId.toString();

    // console.log("✅ Quest created!", receipt);
    return questId;

    } catch (error) {
        throw error
    }

};
const rewardCreator = async(quest_id: string, amount: string, creatorAddress: string, tokenSymbol: string) => {
    try {
        if (!walletClient) throw new Error("Wallet not connected");
        const QuestPandaContract = process.env.NEXT_PUBLIC_QUESTPANDA_SMART_CONTRACT as `0x${string}`;;

        if (!tokenSymbol) {
            throw new Error("Token symbol is undefined!");
        }
        if (!QuestPandaContract) {
        throw new Error("❌ Environment variable QuestPandaContract is not defined");
        }

        let decimals = checkDecimals(tokenSymbol)
        const amountInWei = (Number(amount) * (10**decimals));

        const nonce = await publicClient.getTransactionCount({ address: walletClient.account.address });

        const txHash = await walletClient.writeContract({
            address: QuestPandaContract,
            abi: QuestPandaABI,
            functionName: "rewardCreatorAsBrand",
            account: walletClient.account.address,
            args: [quest_id, amountInWei, creatorAddress],
            nonce: nonce 
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        return;

    } catch (error) {
        throw error
    }
}
const checkDecimals = (tokenSymbol: string) => {
    if(tokenSymbol.toLowerCase() == 'cusd'){
        return 18
    }else if(tokenSymbol.toLowerCase() == 'usdt' || tokenSymbol.toLowerCase() == 'usdc'){
        return 6
    }else{
        throw new Error('Token not supported!!')
    }
}
const checkContractAddress = (tokenSymbol: string) => {
    if(tokenSymbol.toLowerCase() == 'cusd'){
        let address = '0x765DE816845861e75A25fCA122bb6898B8B1282a'
        return address as `0x${string}`;
    }else if(tokenSymbol.toLowerCase() == 'usdt'){
        let address = '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e'
        return address as `0x${string}`;
    }else if(tokenSymbol.toLowerCase() == 'usdc'){
        let address = '0xcebA9300f2b948710d2653dD7B07f33A8B32118C'
        return address as `0x${string}`;
    }else{
        throw new Error('Token not supported!!')
    }
}
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
    
            // 2. Prepare Divvi data suffix
            const dataSuffix = getDataSuffix({
                consumer: '0x6CB95b7c84675dE923E179a40347898D4AcC5BeA', // Your Divvi identifier
                providers: ['0x5f0a55fad9424ac99429f635dfb9bf20c3360ab8'], // Your reward campaign addresses
            });

                    // 3. Encode the transfer function call manually
                const transferData = encodeFunctionData({
                    abi: StableTokenABI.abi,
                    functionName: "transfer",
                    args: [to, amountInWei],
                }) + dataSuffix;

                // Ensure both parts are hex strings and combine them properly
                const combinedData = (transferData + dataSuffix.replace('0x', '')) as `0x${string}`;

                // 4. Send transaction with Divvi suffix
                const txHash = await walletClient.sendTransaction({
                    account: walletClient.account.address,
                    to: cUSDTokenAddress,
                    data: combinedData,
                });

                const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        
                const chainId = await walletClient.getChainId();
                await submitReferral({ txHash, chainId });

            // const tx = await walletClient.writeContract({
            //     address: cUSDTokenAddress,
            //     abi: StableTokenABI.abi,
            //     functionName: "transfer",
            //     account: walletClient.account.address,
            //     args: [to, amountInWei],
            // });
    
            // console.log('🟢 Transaction sent:', tx);
            // // alert('Transaction sent! Waiting for confirmation...');
    
            // let receipt = await publicClient.waitForTransactionReceipt({
            //     hash: tx,
            // });
    
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
        approveSpending,
        createQuest,
        rewardCreator,
        isWalletReady
    };
};