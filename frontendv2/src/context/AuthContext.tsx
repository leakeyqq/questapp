'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { AuthContextType } from "@/types/AuthContextType"; // adjust path if needed
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";


export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: '0xAA36A7', // Sepolia testnet
              rpcTarget: 'https://sepolia.infura.io/v3/079b2fa17f1448aeb8d81e1228e14bc4',
              displayName: 'Sepolia Testnet',
              blockExplorerUrl: 'https://sepolia.etherscan.io',
              ticker: 'ETH',
              tickerName: 'Ethereum',
              logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            },
          },
        });

    const web3authInstance = new Web3Auth({
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // or 'cyan' for Ethereum mainnet
      privateKeyProvider, // ✅ this is the missing piece
    });

        setWeb3auth(web3authInstance);
        await web3authInstance.initModal();

        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
          const info = await web3authInstance.getUserInfo();
          setUser(info);
        }
      } catch (err) {
        console.error("Web3Auth init error:", err);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    const newProvider = await web3auth.connect();
    setProvider(newProvider);
    const info = await web3auth.getUserInfo();
    setUser(info);
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setUser(null);
  };

  const getUserInfo = async () => {
    if (!web3auth) return;
    return await web3auth.getUserInfo();
  };

  const enableMFA = async () => {
    if (!web3auth) return;
    await web3auth.enableMFA();
  };

  const manageMFA = async () => {
    if (!web3auth) return;
    await web3auth.manageMFA();
  };

  const authenticateUser = async () => {
    if (!web3auth) return;
    return await web3auth.authenticateUser();
  };

  const addAndSwitchChain = async () => {
    if (!web3auth) return;
    await web3auth.addChain({
      chainId: "0xaa36a7",
      displayName: "Ethereum Sepolia",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      tickerName: "Sepolia",
      ticker: "ETH",
      decimals: 18,
      rpcTarget: "https://rpc.sepolia.org",
      blockExplorerUrl: "https://sepolia.etherscan.io",
      logo: "https://images.toruswallet.io/eth.svg",
      isTestnet: true,
    });

    await web3auth.switchChain({ chainId: "0xaa36a7" });
  };

  return (
    <AuthContext.Provider
      value={{
        provider,
        user,
        login,
        logout,
        getUserInfo,
        enableMFA,
        manageMFA,
        authenticateUser,
        addAndSwitchChain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
