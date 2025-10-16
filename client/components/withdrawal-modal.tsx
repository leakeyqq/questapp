"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wallet, ArrowLeft, CheckCircle, DollarSign, Loader2, X } from "lucide-react"
import { useWeb3 } from "@/contexts/useWeb3"
import {useAlert} from "@/components/custom-popup"
import {useConfirm} from '@/components/custom-confirm'
import { celo } from "viem/chains"

interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  onWithdrawalComplete: () => void
}

type WithdrawalMethod = "mpesa" | "crypto" | null
type WithdrawalStep =
  | "method"
  | "mpesa-details"
  | "crypto-token"
  | "crypto-address"
  | "processing"
  | "success"
type CryptoToken = "USDT" | "USDC" | "cUSD"
type Network = "celo" | "scroll"

interface TokenBalance {
  token: CryptoToken
  balance: number
  usdValue: number
}

// Define available tokens for each network
const tokenNetworkOptions: { token: CryptoToken; network: Network; displayName: string }[] = [
  { token: "USDT", network: "scroll", displayName: "USDT on Scroll" },
  { token: "USDC", network: "scroll", displayName: "USDC on Scroll" },
  { token: "USDT", network: "celo", displayName: "USDT on Celo" },
  { token: "USDC", network: "celo", displayName: "USDC on Celo" },
  { token: "cUSD", network: "celo", displayName: "cUSD on Celo" },
]

const tokenIcons: Record<CryptoToken, string> = {
  USDT: "/USDT.png",
  USDC: "/USDC.png",
  cUSD: "/cUSD.png",
};

const networkIcons: Record<Network, string> = {
  celo: "/CELO.jpg",
  scroll: "/scroll.png",
};

export function WithdrawalModal({ isOpen, onClose, onWithdrawalComplete }: WithdrawalModalProps) {
  const [step, setStep] = useState<WithdrawalStep>("method")
  const [method, setMethod] = useState<WithdrawalMethod>(null)
  const [mpesaNumber, setMpesaNumber] = useState("")
  const [selectedToken, setSelectedToken] = useState<CryptoToken | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("celo")
  const [cryptoAddress, setCryptoAddress] = useState("")
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const { checkCombinedTokenBalances, withdrawFundsOnchain, confirmMpesaNames, withdrawFundsToMpesa } = useWeb3();
  const { showAlert, AlertComponent } = useAlert()
  const { showConfirm, ConfirmComponent } = useConfirm()
  
  useEffect(() => {
    let isMounted = true;

    const fetchBalances = async () => {
      if (isOpen && isMounted) {
        setIsLoadingBalances(true)
        try {
          const {
            celo: { cUSDBalance, USDTBalance: celoUSDTBalance, USDCBalance: celoUSDCBalance },
          } = await checkCombinedTokenBalances();
          
          if (isMounted) {
            const balances: TokenBalance[] = [
              { token: "USDT", balance: Number.parseFloat(celoUSDTBalance), usdValue: Number.parseFloat(celoUSDTBalance) },
              { token: "USDC", balance: Number.parseFloat(celoUSDCBalance), usdValue: Number.parseFloat(celoUSDCBalance) },
              { token: "cUSD", balance: Number.parseFloat(cUSDBalance), usdValue: Number.parseFloat(cUSDBalance) },
            ];
            
            setTokenBalances(balances);
          }
        } catch (error) {
          console.error("Failed to fetch token balances:", error);
          if (isMounted) {
            setTokenBalances([
              { token: "USDT", balance: 0, usdValue: 0 },
              { token: "USDC", balance: 0, usdValue: 0 },
              { token: "cUSD", balance: 0, usdValue: 0 },
            ]);
          }
        } finally {
          if (isMounted) {
            setIsLoadingBalances(false);
          }
        }
      }
    };

    fetchBalances();

    return () => {
      isMounted = false;
    };
  }, [isOpen, checkCombinedTokenBalances]);

  const resetModal = () => {
    setStep("method")
    setMethod(null)
    setMpesaNumber("")
    setSelectedToken(null)
    setSelectedNetwork("celo")
    setCryptoAddress("")
    setWithdrawalAmount("")
    setIsProcessing(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const handleMethodSelect = (selectedMethod: WithdrawalMethod) => {
    setMethod(selectedMethod)
    if (selectedMethod === "mpesa") {
      setStep("mpesa-details")
    } else {
      setStep("crypto-token")
    }
  }

  // Combined token and network selection
  const handleTokenNetworkSelect = (token: CryptoToken, network: Network) => {
    setSelectedToken(token)
    setSelectedNetwork(network)
    setStep("crypto-address")
  }

  const handleWithdraw = async () => {
    setIsProcessing(true);
    setStep("processing");

    try {
      if (method === "crypto") {
        if (!selectedToken || !cryptoAddress || !withdrawalAmount || !selectedNetwork) {
          throw new Error("Missing withdrawal parameters");
        }

        if (cryptoAddress.length <= 10) {
          throw new Error("Invalid recipient address");
        }

        const amount = Number.parseFloat(withdrawalAmount);
        if (amount <= 0) {
          throw new Error("Invalid withdrawal amount");
        }

        if (selectedToken === null) {
          throw new Error("No token selected");
        }

        const receipt = await withdrawFundsOnchain(
          cryptoAddress,
          selectedNetwork,
          selectedToken,
          withdrawalAmount
        );

        if (receipt && receipt.transactionHash) {
          setStep("success");
          console.log('✅ Withdrawal successful:', receipt.transactionHash);
          
          setTimeout(() => {
            onWithdrawalComplete();
            handleClose();
          }, 2000);
        } else {
          throw new Error("Withdrawal failed - no transaction receipt");
        }

      } else if (method === "mpesa") {
        if (mpesaNumber.length < 10 || !withdrawalAmount) {
          throw new Error("Invalid M-Pesa parameters");
        }

        const customerNames = await confirmMpesaNames(mpesaNumber)
        const confirmName = await showConfirm(`Please confirm your Mpesa name is  ${customerNames}`)
        if(!confirmName){
          setIsProcessing(false)
          setStep("mpesa-details");
          return
        }

        const receipt = await withdrawFundsToMpesa(mpesaNumber, 'celo', withdrawalAmount)
        await showAlert("Withdrawal was successful!")
        setStep("success");
        
        setTimeout(() => {
          onWithdrawalComplete();
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      if (method === "crypto") {
        setStep("crypto-address");
      } else if (method === "mpesa") {
        setStep("mpesa-details");
      }
      await showAlert(`Withdrawal failed: ${(error as Error).message}`)
    } finally {
      setIsProcessing(false);
    }
  };

  const getTokenBalance = (token: CryptoToken) => {
    return tokenBalances.find((t) => t.token === token)?.balance || 0
  }

  const canProceedMpesa = mpesaNumber.length >= 10 && withdrawalAmount && Number.parseFloat(withdrawalAmount) > 0
  const canProceedCrypto = cryptoAddress.length > 10 && withdrawalAmount && Number.parseFloat(withdrawalAmount) > 0

  const totalBalance = tokenBalances.reduce((sum, token) => sum + token.usdValue, 0)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm w-[95vw] p-0 gap-0 bg-white border-0 shadow-2xl">
        <DialogHeader className="p-4 pb-2 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
          <div className="flex items-center gap-3">
            {step !== "method" && step !== "success" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (step === "mpesa-details") setStep("method")
                  else if (step === "crypto-token") setStep("method")
                  else if (step === "crypto-address") setStep("crypto-token")
                }}
                className="p-1 h-8 w-8 hover:bg-purple-100"
              >
                <ArrowLeft className="h-4 w-4 text-gray-500" />
              </Button>
            )}
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold text-gray-700">
                {step === "method" && "Withdraw"}
                {step === "mpesa-details" && "M-Pesa Withdrawal"}
                {step === "crypto-token" && "Select Token & Network"}
                {step === "crypto-address" && "Enter Address"}
                {step === "processing" && "Processing..."}
                {step === "success" && "Success!"}
              </DialogTitle>
              {step === "method" && (
                <p className="text-sm text-gray-500 mt-1">
                  Available: <span className="font-semibold text-purple-500">${totalBalance.toFixed(2)}</span>
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-4">
          {/* Method Selection */}
          {step === "method" && (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleMethodSelect("mpesa")}
                className="w-full h-16 justify-start gap-4 border-2 border-green-100 hover:border-green-200 hover:bg-green-50 transition-all"
              >
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <img src="/mpesa.png" alt="M-Pesa" className="h-6 w-6 object-contain" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-600">M-Pesa</div>
                  <div className="text-sm text-gray-500">Withdraw to mobile money</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleMethodSelect("crypto")}
                className="w-full h-16 justify-start gap-4 border-2 border-purple-100 hover:border-purple-200 hover:bg-purple-50 transition-all"
              >
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <img src="/USDC.png" alt="Crypto" className="h-6 w-6 object-contain" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-600">Crypto Wallet</div>
                  <div className="text-sm text-gray-500">Withdraw to external wallet</div>
                </div>
              </Button>
            </div>
          )}

          {/* M-Pesa Details */}
          {step === "mpesa-details" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">M-Pesa Withdrawal</span>
                </div>
                <p className="text-xs text-green-600">Funds will be sent directly to your M-Pesa account</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-600">
                    Amount (USD)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="mt-1 h-10 border-gray-200 focus:border-green-300 focus:ring-green-300"
                    max={totalBalance}
                    step="0.01"
                  />
                  <p className="text-xs text-gray-400 mt-1">Max: ${totalBalance.toFixed(2)}</p>
                </div>

                <div>
                  <Label htmlFor="mpesa" className="text-sm font-medium text-gray-600">
                    M-Pesa Number
                  </Label>
                  <Input
                    id="mpesa"
                    type="tel"
                    placeholder="0712345678"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    className="mt-1 h-10 border-gray-200 focus:border-green-300 focus:ring-green-300"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter your M-Pesa registered number</p>
                </div>
              </div>

              <AlertComponent/>

              <Button
                onClick={handleWithdraw}
                disabled={!canProceedMpesa}
                className="w-full h-10 bg-green-500 hover:bg-green-600 text-white font-medium"
              >
                Withdraw ${withdrawalAmount || "0.00"} to M-Pesa
              </Button>
            </div>
          )}

{/* Combined Token & Network Selection */}
{step === "crypto-token" && (
  <div className="space-y-3">
    <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-700">Select Token & Network</span>
      </div>
      <p className="text-xs text-purple-600">Choose your preferred token and network</p>
    </div>

    {tokenNetworkOptions.map((option) => {
      const tokenBalance = getTokenBalance(option.token);
      const usdValue = tokenBalances.find((t) => t.token === option.token)?.usdValue || 0;
      
      return (
        <Button
          key={`${option.token}-${option.network}`}
          variant="outline"
          onClick={() => handleTokenNetworkSelect(option.token, option.network)}
          className="w-full h-16 justify-between border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all"
        >
          <div className="flex items-center gap-3">
            {/* Network Logo (Big Circle) with Token Logo (Small Circle) on top */}
            <div className="relative">
              {/* Big Network Logo in Circle */}
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={networkIcons[option.network]} 
                  alt={option.network} 
                  className="w-8 h-8 object-cover rounded-full" 
                />
              </div>
              {/* Small Token Logo in Circle positioned on top-right */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={tokenIcons[option.token]} 
                  alt={option.token} 
                  className="w-5 h-5 object-cover rounded-full" 
                />
              </div>
            </div>
            
            <div className="text-left">
              <div className="font-semibold text-gray-600">
                {option.token}

                                <span> on </span>
                <span className="font-medium text-blue-600">
                  {option.network.charAt(0).toUpperCase() + option.network.slice(1)}
                </span>


              </div>
              {/* <div className="text-sm text-gray-500 flex items-center gap-1">
                <span>on</span>
                <span className="font-medium text-blue-600">
                  {option.network.charAt(0).toUpperCase() + option.network.slice(1)}
                </span>
              </div> */}
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-purple-500">${usdValue.toFixed(2)}</div>
            {/* <div className="text-sm text-gray-500">{tokenBalance.toFixed(2)} {option.token}</div> */}
          </div>
        </Button>
      );
    })}
  </div>
)}
          {/* Address Input */}
          {step === "crypto-address" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  {/* Token Icon */}
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <img src={tokenIcons[selectedToken!]} alt={selectedToken!} className="h-5 w-5 object-contain" />
                  </div>
                  <span className="text-sm font-medium text-blue-700">
                    {selectedToken} on {selectedNetwork.toUpperCase()}
                  </span>
                  {/* Network Icon */}
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <img src={networkIcons[selectedNetwork]} alt={selectedNetwork} className="h-6 w-6 object-contain" />
                  </div>
                </div>
                <p className="text-xs text-blue-600">
                  Available: {getTokenBalance(selectedToken!).toFixed(2)} {selectedToken} (${tokenBalances.find((t) => t.token === selectedToken)?.usdValue.toFixed(2)})
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="crypto-amount" className="text-sm font-medium text-gray-600">
                    Amount ({selectedToken})
                  </Label>
                  <Input
                    id="crypto-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="mt-1 h-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    max={getTokenBalance(selectedToken!)}
                    step="0.01"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Max: {getTokenBalance(selectedToken!).toFixed(2)} {selectedToken}
                  </p>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-600">
                    Recipient Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    className="mt-1 h-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter {selectedNetwork} wallet address</p>
                </div>
              </div>

              <AlertComponent/>

              <Button
                onClick={handleWithdraw}
                disabled={!canProceedCrypto}
                className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-medium"
              >
                Withdraw {withdrawalAmount || "0.00"} {selectedToken}
              </Button>
            </div>
          )}

          {/* Processing */}
          {step === "processing" && (
            <div className="text-center py-8">
              <AlertComponent/>
              <ConfirmComponent/>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Processing Withdrawal</h3>
              <p className="text-sm text-gray-500 mb-4">
                {method === "mpesa"
                  ? `Sending $${withdrawalAmount} to ${mpesaNumber}...`
                  : `Sending $${withdrawalAmount} ${selectedToken} to your wallet...`}
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">This may take a few moments. Please don't close this window.</p>
              </div>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Withdrawal Successful!</h3>
              <p className="text-sm text-gray-500 mb-4">
                {method === "mpesa"
                  ? `$${withdrawalAmount} has been sent to ${mpesaNumber}`
                  : `$${withdrawalAmount} ${selectedToken} has been sent to your wallet`}
              </p>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-xs text-green-600">
                  {method === "mpesa"
                    ? "You should receive an M-Pesa confirmation SMS shortly."
                    : "Transaction will be confirmed on the blockchain shortly."}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}