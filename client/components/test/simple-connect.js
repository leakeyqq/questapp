"use client";
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useSearchParams } from 'next/navigation';
import { sdk } from '@farcaster/frame-sdk';

let hasConnectedMiniPay = false;
let hasConnectedFarcaster = false;

export default function ConnectWalletButton() {
  const [mounted, setMounted] = useState(false);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [isMiniApp, setIsMiniApp] = useState(null);
  const [isValora, setIsValora] = useState(false);
  const [refreshPage, setRefreshpage] = useState(false);
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Find Web3Auth connector
  const web3authConnector = connectors.find((c) => c.id === "web3auth");
  const valoraConnector = connectors.find(c => c.id === 'walletConnect');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect Valora
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const valoraParam = searchParams.get('valora');
      const isValoraUrl = valoraParam === 'true';
      const wasValoraDetected = sessionStorage.getItem('valoraDetected') === 'true';

      if (isValoraUrl || wasValoraDetected) {
        setIsValora(true);
        sessionStorage.setItem('valoraDetected', 'true');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('valora');
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    }
  }, [mounted, searchParams]);

  // Auto-connect MiniPay if detected
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      if (window.ethereum?.isMiniPay && !hasConnectedMiniPay) {
        hasConnectedMiniPay = true;
        connect({ connector: injected({ target: "metaMask" }) });
        console.log("MiniPay detected. Auto-connecting...");
      }
    }
  }, [connect, mounted]);

  // Detect Farcaster Mini App environment
  useEffect(() => {
    if (mounted && !hasConnectedFarcaster) {
      const checkMiniApp = async () => {
        try {
          const miniAppStatus = await sdk.isInMiniApp();
          setIsMiniApp(miniAppStatus);
          
          if (miniAppStatus) {
            hasConnectedFarcaster = true;
            console.log("Running in Farcaster Mini App");
            connect({ connector: farcasterFrame() });
          }
        } catch (error) {
          console.error("Error checking Mini App status:", error);
        }
      };
      
      checkMiniApp();
    }
  }, [mounted, connect]);

  // Log Web3Auth user info after connection
  useEffect(() => {
    if (isConnected && web3authConnector && address) {
      const fetchWeb3AuthUserInfo = async () => {
        try {
          setIsSigningIn(true);
          const provider = await web3authConnector.getProvider();
          if (provider && 'getUserInfo' in provider) {
            const userInfo = await provider.getUserInfo();
            console.log('🌟 Full Web3Auth Response:', userInfo);
          } else {
            console.error('❌ Web3Auth provider does not support getUserInfo');
          }
        } catch (error) {
          console.error('❌ Error fetching Web3Auth user info:', error);
        } finally {
          setIsSigningIn(false);
        }
      };

      fetchWeb3AuthUserInfo();
    }
  }, [isConnected, address, web3authConnector]);

  // Backend auth after connecting
  useEffect(() => {
    if (isConnected && address) {
      const login = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ address }),
              credentials: "include",
            }
          );
          const data = await res.json();
          if (data.success) {
            console.log("Login successful:", data);
          } else {
            console.log("Login failed:", data);
          }

          if (refreshPage) {
            setRefreshpage(false);
            window.location.reload();
          }
        } catch (err) {
          console.error("Login error:", err);
        }
      };

      login();
    }
  }, [isConnected, address, refreshPage]);

  if (!mounted || isMiniApp === null) {
    return null;
  }

  if (!mounted || isMiniApp || (typeof window !== "undefined" && window.ethereum?.isMiniPay)) {
    return null;
  }

  // Split the return into two blocks based on isValora
  if (isValora) {
    return (
      <div className="flex flex-col items-center gap-4">
        {/* Valora-specific UI */}
        {!isConnected && (
          <button 
            onClick={() => { connect({ connector: valoraConnector }); setRefreshpage(true); }} 
            className="px-4 py-2 rounded-lg bg-brand-purple text-white hover:bg-opacity-90 hover:bg-brand-purple transition"
          >
            Connect Wallet
          </button>
        )}

        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 rounded-lg text-red font-medium hover:text-light hover:bg-red-700 transition"
          >
            Disconnect
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Web3Auth Connect Button */}
      {web3authConnector && !isConnected && (
        <button
          onClick={() => connect({ connector: web3authConnector })}
          className="px-4 py-2 rounded-lg bg-brand-purple text-white hover:bg-opacity-90 hover:bg-brand-purple transition"
          disabled={isSigningIn}
        >
          Sign in
        </button>
      )}

      {/* Disconnect Button */}
      {isConnected && (
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-lg text-red font-medium hover:text-light hover:bg-red-700 transition"
        >
          Log Out
        </button>
      )}
    </div>
  );
}
export { ConnectWalletButton };