'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { ethers } from 'ethers';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;
console.log("Web3Auth Client ID:", clientId);

interface Web3AuthContextType {
  address: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const Web3AuthContext = createContext<Web3AuthContextType>({
  address: null,
  login: async () => {},
  logout: async () => {},
});

export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0xAA36A7', // Sepolia testnet
          rpcTarget: 'https://sepolia.infura.io/v3/079b2fa17f1448aeb8d81e1228e14bc4',
          displayName: 'Sepolia Testnet',
          blockExplorerUrl: 'https://sepolia.etherscan.io',
          ticker: 'ETH',
          tickerName: 'Ethereum',
          logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3authInstance = new Web3Auth({
          clientId,
          chainConfig,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        await web3authInstance.initModal();

        setWeb3auth(web3authInstance);

        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
          const ethersProvider = new ethers.providers.Web3Provider(web3authInstance.provider as any);
          const signer = ethersProvider.getSigner();
          const userAddress = await signer.getAddress();
          setAddress(userAddress);

          console.log("User address set:", userAddress);

          
        }
      } catch (err) {
        console.error('Web3Auth init error:', err);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    const ethersProvider = new ethers.providers.Web3Provider(web3authProvider as any);
    const signer = ethersProvider.getSigner();
    const userAddress = await signer.getAddress()
    setAddress(userAddress);

    console.log("Web3Auth Provider:", web3authProvider);
    console.log("Address:", await signer.getAddress());

    const userInfo = await web3auth.getUserInfo();
    console.log("User Info:", userInfo);

  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setAddress(null);
  };

  return (
    <Web3AuthContext.Provider value={{ address, login, logout }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => useContext(Web3AuthContext);
