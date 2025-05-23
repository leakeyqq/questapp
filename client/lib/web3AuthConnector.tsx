// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, WALLET_ADAPTERS } from "@web3auth/base";
import { Chain } from "wagmi/chains";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

export  function getWeb3AuthConnector(chains: Chain[]) {
  // Create Web3Auth Instance
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

  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  const web3AuthInstance = new Web3Auth({
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

  const walletServicesPlugin = new WalletServicesPlugin({
    walletInitOptions: {
      whiteLabel: {
        showWidgetButton: false,
      }
    }
  });
  web3AuthInstance.addPlugin(walletServicesPlugin);


const modalConfig = {
  [WALLET_ADAPTERS.AUTH]: {
    label: "openlogin",
    loginMethods: {
      google: {
        name: "Google",
        showOnModal: true,
      },
      facebook: {
        name: "Facebook",
        showOnModal: false,
      },
      discord: {
        name: "Discord",
        showOnModal: false,
      },
      reddit: {
        name: "Reddit",
        showOnModal: false,
      },
      twitch: {
        name: "Twitch",
        showOnModal: false,
      },
      apple: {
        name: "Apple",
        showOnModal: false,
      },
      line: {
        name: "Line",
        showOnModal: false,
      },
      github: {
        name: "Github",
        showOnModal: false,
      },
      kakao: {
        name: "Kakao",
        showOnModal: false,
      },
      linkedin: {
        name: "Linkedin",
        showOnModal: false,
      },
      twitter: {
        name: "Twitter",
        showOnModal: false,
      },
      weibo: {
        name: "Weibo",
        showOnModal: false,
      },
      wechat: {
        name: "Wechat",
        showOnModal: false,
      },
      farcaster: {
        name: "Farcaster",
        showOnModal: false,
      },
      
    },
    showOnModal: true,
  },
};

  

  return Web3AuthConnector({
      web3AuthInstance,
      modalConfig,
  });
}