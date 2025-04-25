"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

let hasConnectedMiniPay = false;

export default function ConnectWalletButton() {
  // const [hideButton, setHideButton] = useState(false);
  const [mounted, setMounted] = useState(false); // 👈 Track client mount

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  // 🧠 Find Web3Auth connector
  const web3authConnector = connectors.find((c) => c.id === "web3auth");

  useEffect(() => {
    setMounted(true); // ✅ Now it's safe to render client-only logic
  }, []);


  // 🚀 Auto-connect MiniPay if detected
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      if (window.ethereum?.isMiniPay && !hasConnectedMiniPay) {
        hasConnectedMiniPay = true;
        // setHideButton(true);
        connect({ connector: injected({ target: "metaMask" }) });
        console.log("MiniPay detected. Auto-connecting...");
      }
    }
  }, [connect]);

  // 🔐 Backend auth after connecting
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
        } catch (err) {
          console.error("Login error:", err);
        }
      };

      login();
    }
  }, [isConnected, address]);

  // if (!mounted || hideButton) {
  //   return (
  //     <div className="flex justify-center items-center h-12">
  //       <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  // // 🙈 Hide if MiniPay auto-connected
  // if (hideButton) return null;

  if (!mounted || (typeof window !== "undefined" && window.ethereum?.isMiniPay)) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ✅ Web3Auth Connect Button */}
      {web3authConnector && !isConnected && (
        <button
          onClick={() => connect({ connector: web3authConnector })}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Connect with Web3Auth
        </button>
      )}

      {/* 🔌 Disconnect Button */}
      {isConnected && (
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Disconnect
        </button>
      )}
    </div>
  );
}

export { ConnectWalletButton };
