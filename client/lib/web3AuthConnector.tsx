// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, WALLET_ADAPTERS } from "@web3auth/base";
import { Chain } from "wagmi/chains";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

// Singleton instances
let web3AuthInstance: Web3Auth | null = null;
let privateKeyProvider: EthereumPrivateKeyProvider | null = null;
let walletServicesPlugin: WalletServicesPlugin | null = null;


export  function getWeb3AuthConnector(chains: Chain[]) {
  
  // Create Web3Auth Instance
   if (!web3AuthInstance) {
  const name = "QuestPanda";
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorerUrl: chains[0].blockExplorers?.default.url[0] as string,
    logo: "https://cryptologos.cc/logos/celo-celo-logo.png",
  };

  privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  web3AuthInstance = new Web3Auth({
    clientId: "BAeQG5Y8daxvkdrBO-Uz7W33nKDF7stJK2XhHI9j7MVal5lEJRhxU7VHewIWyC1wBDr32Q6yLKq9l8IWC-v0AxU",
    chainConfig,
    privateKeyProvider,
    uiConfig: {
      appName: name,
      // loginMethodsOrder: ["github", "google"],
      loginMethodsOrder: ["google"],
      defaultLanguage: "en",
      modalZIndex: "2147483647",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      uxMode: "redirect",
      mode: "light",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    enableLogging: true,
  });

  walletServicesPlugin = new WalletServicesPlugin({
    walletInitOptions: {
      whiteLabel: {
        showWidgetButton: true,
      }
    }
  });
  web3AuthInstance.addPlugin(walletServicesPlugin);
}

  const modalConfig = {
    [WALLET_ADAPTERS.AUTH]: {
      label: "openlogin",
      loginMethods: {
        facebook: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "facebook login",
          showOnModal: false,
        },
      },
      // setting it to false will hide all social login methods from modal.
      showOnModal: true,
    },
  }

  return Web3AuthConnector({
      web3AuthInstance: web3AuthInstance!,
      modalConfig,
  });
}