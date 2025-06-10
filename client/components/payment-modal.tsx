"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Wallet, Smartphone, Building2, CheckCircle, Copy, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import React from 'react';
import QRCodeComponent from '@/components/QRCodeComponent';
import { CopyButton } from "@/components/copyButton"
import { useWeb3 } from "@/contexts/useWeb3"
import { RefreshCw } from 'lucide-react'
import {useAlert} from "@/components/custom-popup"



interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: () => void
  prizePool: string,
  paymentAddress:  `0x${string}` | null;
}

type PaymentMethod = "cUSD" | "USDT" | "USDC" | "mpesa" | "mtn" | "bank" | null

export function PaymentModal({ isOpen, onClose, onPaymentComplete, prizePool, paymentAddress }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [bankDetails, setBankDetails] = useState({ accountNumber: "", bankName: "" })
  const { checkTokenBalances, checkBalanceOfSingleAsset } = useWeb3();
  const [walletBalance, setWalletBalance] = useState('0.00')
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, AlertComponent } = useAlert()
  


  // Mock wallet address for crypto payments
  // const walletAddress = "0x69974Cc73815f378218B56FD0ce03A8158b9e120"
  const walletAddress = paymentAddress

  const paymentOptions = [
    // {
    //   id: "mpesa",
    //   name: "M-Pesa",
    //   description: "Mobile Money",
    //   icon: "/crypto/mpesa2.png",
    //   color: "bg-light",
    //   type: "cash",
    // },
    {
      id: "cUSD",
      name: "cUSD",
      description: "Virtual dollars",
      icon: "/crypto/cusd.png",
      color: "bg-light",
      type: "crypto",
    },
    {
      id: "USDT",
      name: "USDT",
      description: "Virtual dollars",
      icon: "/crypto/usdt.png",
      color: "bg-light",
      type: "crypto",
    },
    {
      id: "USDC",
      name: "USDC",
      description: "Virtual dollars",
      icon: "/crypto/usdc.png",
      color: "bg-light",
      type: "crypto",
    }
    // {
    //   id: "mtn",
    //   name: "MTN MoMo",
    //   description: "Mobile Money",
    //   icon: Smartphone,
    //   color: "bg-yellow-500",
    //   type: "cash",
    // },
    // {
    //   id: "bank",
    //   name: "Bank Transfer",
    //   description: "Direct Transfer",
    //   icon: Building2,
    //   color: "bg-brand-pink",
    //   type: "cash",
    // },
  ]

  const handlePayment = async () => {
    if (!selectedMethod) return

    // Validation for cash payments
    if (selectedMethod === "mpesa" || selectedMethod === "mtn") {
      if (!phoneNumber) {
        toast({
          title: "Phone number required",
          description: `Please enter your ${selectedMethod === "mpesa" ? "M-Pesa" : "MTN"} phone number`,
          variant: "destructive",
        })
        return
      }
    }

    if (selectedMethod === "bank") {
      if (!bankDetails.accountNumber || !bankDetails.bankName) {
        toast({
          title: "Bank details required",
          description: "Please enter your bank account details",
          variant: "destructive",
        })
        return
      }
    }

    setIsProcessing(true)

      const {cUSDBalance, USDTBalance, USDCBalance} = await checkTokenBalances()

      let isBalanceSufficient;

      if(Number(cUSDBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(USDTBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else if(Number(USDCBalance) >= Number(prizePool)){
        isBalanceSufficient = true
      }else{
        isBalanceSufficient = false
      }

      if (!isBalanceSufficient) {
      setIsProcessing(false)
      await showAlert(`Your balance is insufficient to cover the ${prizePool} USD payment. Please deposit funds and try again`)
      return;
    }

    setIsProcessing(false)
    setPaymentCompleted(true)

    const isCrypto = ["cUSD", "USDT", "USDC"].includes(selectedMethod)
  }


  const handleComplete = () => {
    onPaymentComplete()
    onClose()
  }

  const resetSelection = () => {
    setSelectedMethod(null)
    setPhoneNumber("")
    setBankDetails({ accountNumber: "", bankName: "" })
  }

  const fetchBalance = async(tokenName: string)=>{
  try{
    const bal = await checkBalanceOfSingleAsset(tokenName)
    setWalletBalance(Number(bal.balance).toFixed(2))
  }catch(e){
    console.error(e)
    throw e
  }
}

  const handleRefresh = async (tokenName: string) => {
    setIsLoading(true);
    try {
      await fetchBalance(tokenName);
    } finally {
      setIsLoading(false);
    }
  };
  const selectedOption = paymentOptions.find((option) => option.id === selectedMethod)

  useEffect(() => {
  if (selectedOption?.type === "crypto" && selectedOption?.name) {
    fetchBalance(selectedOption.name)
  }
}, [selectedOption])


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brand-dark">Complete Payment</DialogTitle>
          <DialogDescription>Deposit {prizePool} USD to create your quest. Please select your preferred payment option.</DialogDescription>
        </DialogHeader>

        {paymentCompleted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-dark mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
            <Button onClick={handleComplete} className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              Complete Quest Creation
            </Button>
          </div>
        ) : selectedMethod ? (
          // Selected payment method details
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={resetSelection} className="text-brand-purple hover:text-brand-purple/80">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to options
              </Button>
            </div>

            <Card className="border border-brand-purple/10 p-2 pt-0 md:p-1">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-brand-dark text-sm md:text-base">
                  <div className={`p-1 rounded ${selectedOption?.color} text-white`}>
                    <img src={selectedOption?.icon} alt={selectedOption?.name} className="w-5 h-5" />
                  </div>
                  Pay with {selectedOption?.name}
                </CardTitle>
              </CardHeader>

            <CardContent className="space-y-1 text-md">
              {["cUSD", "USDT", "USDC"].includes(selectedMethod) && (
                <div className="space-y-3">
                  <div className="bg-brand-light p-2 rounded border border-gray-200">
                    <Label className="flex items-center gap-2 text-xs font-medium text-brand-dark">
                      Send to wallet address on Celo
                      <img src="/crypto/celo.png" alt={selectedOption?.name} className="w-5 h-5" />
                    </Label>

                    <div className="flex items-center gap-2 mt-2">
                      <code className="bg-white px-2 py-1 rounded border text-xs flex-1 break-all">
                        {walletAddress}
                      </code>
                      <CopyButton text={walletAddress || ''} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-white rounded border text-xs">
                    <span className="text-brand-dark font-medium">Amount to send:</span>
                    <Badge variant="secondary" className="text-sm">
                      {prizePool} {selectedMethod}
                    </Badge>
                  </div>

                      {/* Wallet Balance with Refresh */}
                  <div className="flex items-center justify-between text-xs bg-white rounded px-2 py-1">
                    <span className="text-brand-dark">My balance:</span>
                    <div className="flex items-center gap-1">
                     <span className="font-semibold">{walletBalance} {selectedMethod}</span>
                      <button onClick={() => handleRefresh(selectedMethod)} className="flex items-center gap-2 text-brand-purple hover:opacity-75">Refresh
                        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}/>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-xs mb-1">Or scan to Pay</p>
                    <QRCodeComponent text={`ethereum:${walletAddress}`} />
                  </div>

                  {/* <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
                    <strong>Important:</strong> Send the exact amount shown to the wallet address above.
                  </div> */}
                </div>
              )}

              {(selectedMethod === "mpesa" || selectedMethod === "mtn") && (
                <div className="space-y-2 text-sm">
                  <div>
                    <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder={selectedMethod === "mpesa" ? "+254712345678" : "+256712345678"}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-white border-gray-300 text-sm"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                    You will receive a payment prompt on your phone.
                  </div>
                </div>
              )}

              {selectedMethod === "bank" && (
                <div className="space-y-2 text-sm">
                  <div>
                    <Label htmlFor="bank-name" className="text-xs">Bank Name</Label>
                    <Input
                      id="bank-name"
                      placeholder="e.g., KCB Bank"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails((prev) => ({ ...prev, bankName: e.target.value }))}
                      className="bg-white border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account-number" className="text-xs">Account Number</Label>
                    <Input
                      id="account-number"
                      placeholder="Enter account number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails((prev) => ({ ...prev, accountNumber: e.target.value }))}
                      className="bg-white border-gray-300 text-sm"
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800">
                    Bank transfers take 1–3 business days. Activation follows payment confirmation.
                  </div>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white text-sm py-2"
              >
                {/* {isProcessing ? "Processing..." : `Pay $${prizePool} with ${selectedOption?.name}`} */}
                {isProcessing ? "Processing..." : `Confirm I have paid!`}

              </Button>
            </CardContent>
          </Card>

          </div>
        ) : (
          // Payment options grid
          <div className="space-y-6">

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {paymentOptions.map((option) => {
                // const IconComponent = option.icon
                return (


              <Card
                key={option.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-brand-purple/50 group"
                onClick={() => setSelectedMethod(option.id as PaymentMethod)}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative">
                    {/* Recommended Badge */}
                    {option.id === "mpesa" && (
                      <span className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full z-10 -translate-y-1/2">
                        Recommended
                      </span>
                    )}

                    <div
                      className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <img src={option.icon} alt={option.name} className="w- h-8 rounded" />
                    </div>
                  </div>

                  <h4 className="font-semibold text-brand-dark mb-1">{option.name}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>

                )
              })}
            </div>

            {/* <div className="bg-brand-light p-4 rounded-lg border border-dashed border-brand-purple/30">
              <div className="flex items-center justify-center gap-2 text-brand-dark">
                <div className="w-2 h-2 bg-brand-purple rounded-full"></div>
                <span className="text-sm font-medium">Deposits are not withdrawable. You can only use the funds to pay creators.</span>
                <div className="w-2 h-2 bg-brand-purple rounded-full"></div>
              </div>
            </div> */}
          </div>
        )}
      <AlertComponent/>

      </DialogContent>
    </Dialog>
    
  )
}
