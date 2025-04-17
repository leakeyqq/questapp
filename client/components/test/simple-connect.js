"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

let hasConnectedMiniPay = false; // Prevent multiple initializations

export default function ConnectWalletButton() {
  const [hideButton, setHideButton] = useState(false);
  const [noProvider, setNoProvider] = useState(false);
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();



    // Check for MiniPay and auto-connect
    useEffect(() => {
      if (typeof window !== "undefined") {
        if (window.ethereum?.isMiniPay && !hasConnectedMiniPay) {
          hasConnectedMiniPay = true; // Mark as connected once
          setHideButton(true);
          connect({ connector: injected({ target: "metaMask" }) });
          console.log("MiniPay detected. Auto-connecting...");
        } 
        // else if (!window.ethereum) {
        //   setNoProvider(true); // No wallet like MetaMask, MiniPay, etc.
        // }
      }
    }, [connect]);
  

  
  // Handle backend login when connected
  useEffect(() => {
    if (isConnected && address) {
      const login = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
            credentials: "include",
          });

          const data = await res.json();
          if (data.success) {
            console.log("Login successful:", data);
          } else {
            console.log("Login failed:", data);
          }
        } catch (err) {
          console.error("Login error:", err);
        }
      };

      login();
    }
  }, [isConnected, address]);


  if (hideButton) return null;

  if (noProvider) {
    return (
      <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
        {/* <div>No wallet provider detected.<br />
        Please use MiniPay, MetaMask, or connect via WalletConnect.
        </div> */}
        <div className="mt-2">
          <ConnectButton
            // accountStatus="avatar"
            showBalance={{ smallScreen: false, largeScreen: false }}
      
          />
        </div>
      </div>
    );
  }
  
  return (
    // <button
    //   onClick={handleConnect}
    //   className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
    // >
    //   Connect Wallet
    // </button>

                      <ConnectButton
                        showBalance={{
                          smallScreen: false,
                          largeScreen: false,
                        }}
                      />
  );
}

export {ConnectWalletButton};