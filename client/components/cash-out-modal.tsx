"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Wallet, Smartphone, Building2, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import React from 'react'
import { useWeb3 } from "@/contexts/useWeb3"
import { pretiumAPI, SUPPORTED_COUNTRIES, MOBILE_NETWORKS, type Bank } from "@/lib/pretium-api"

interface CashOutModalProps {
  isOpen: boolean
  onClose: () => void
  onCashOutComplete: () => void
  availableBalance: string
  walletAddress: string
}

type PayoutMethod = "mobile" | "bank" | null
type CountryCode = "KES" | "UGX" | "GHS" | "NGN"

interface FormData {
  country: CountryCode | ""
  amount: string
  // Mobile money fields
  phoneNumber: string
  mobileNetwork: string
  // Bank transfer fields (Nigeria)
  accountNumber: string
  bankCode: string
  bankName: string
  accountName: string
}

export function CashOutModal({ isOpen, onClose, onCashOutComplete, availableBalance, walletAddress }: CashOutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cashOutCompleted, setCashOutCompleted] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [validationResult, setValidationResult] = useState<string>("")
  const [validatedRecipient, setValidatedRecipient] = useState<any>(null)
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [fiatEquivalent, setFiatEquivalent] = useState<number>(0)
  const [supportedBanks, setSupportedBanks] = useState<Bank[]>([])
  const [transactionCode, setTransactionCode] = useState<string>("")
  const [currentWalletBalance, setCurrentWalletBalance] = useState<string>("0")
  
  const { sendCUSD, checkCUSDBalance } = useWeb3()

  const [formData, setFormData] = useState<FormData>({
    country: "",
    amount: "",
    phoneNumber: "",
    mobileNetwork: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
    accountName: ""
  })

  // Load supported banks for Nigeria
  useEffect(() => {
    if (formData.country === "NGN") {
      loadSupportedBanks()
    }
  }, [formData.country])

  // Calculate fiat equivalent when amount or country changes
  useEffect(() => {
    if (formData.amount && formData.country && parseFloat(formData.amount) > 0) {
      calculateFiatEquivalent()
    } else {
      setFiatEquivalent(0)
    }
  }, [formData.amount, formData.country])

  // Check wallet balance when modal opens
  useEffect(() => {
    if (isOpen) {
      checkWalletBalance()
    }
  }, [isOpen])

  const loadSupportedBanks = async () => {
    setIsLoadingBanks(true)
    try {
      const banks = await pretiumAPI.getSupportedBanks()
      setSupportedBanks(banks)
    } catch (error) {
      console.error("Failed to load banks:", error)
      toast({
        title: "Error",
        description: "Failed to load supported banks",
        variant: "destructive",
      })
    } finally {
      setIsLoadingBanks(false)
    }
  }

  const calculateFiatEquivalent = async () => {
    try {
      if (!formData.country || !formData.amount) return
      
      const rate = await pretiumAPI.getExchangeRate(formData.country)
      setExchangeRate(rate.rate)
      setFiatEquivalent(parseFloat(formData.amount) * rate.rate)
    } catch (error) {
      console.error("Failed to get exchange rate:", error)
    }
  }

  const checkWalletBalance = async () => {
    try {
      const balanceCheck = await checkCUSDBalance('1')
      setCurrentWalletBalance(balanceCheck.balance)
    } catch (error) {
      console.error("Failed to check wallet balance:", error)
      setCurrentWalletBalance("0")
    }
  }

  const validateRecipient = async () => {
    if (!formData.country) return

    setIsValidating(true)
    setValidationResult("")

    try {
      let validationData
      
      if (selectedMethod === "mobile") {
        validationData = {
          type: "MOBILE" as const,
          shortcode: formData.phoneNumber,
          mobile_network: formData.mobileNetwork
        }
      } else if (selectedMethod === "bank" && formData.country === "NGN") {
        validationData = {
          type: "MOBILE" as const, // Nigeria uses different validation
          shortcode: formData.accountNumber,
          mobile_network: formData.mobileNetwork
        }
      }

      if (validationData) {
        const currency = formData.country === "KES" ? undefined : formData.country
        const result = await pretiumAPI.validateRecipient(validationData, currency)
        
        if (result.success && result.data.data.status === "COMPLETE") {
          const recipientData = result.data.data;
          setValidationResult(recipientData.public_name || recipientData.business_name || "Valid recipient")
          setValidatedRecipient(recipientData)
          toast({
            title: "Validation successful",
            description: `Recipient confirmed: ${recipientData.public_name || recipientData.business_name}`,
          })
        } else {
          throw new Error("Recipient validation failed")
        }
      }
    } catch (error) {
      console.error("Validation failed:", error)
      toast({
        title: "Validation failed",
        description: "Please check your recipient details and try again",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleCashOut = async () => {
    if (!formData.amount || !formData.country) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const withdrawalAmount = parseFloat(formData.amount)
    const availableBalanceNum = parseFloat(availableBalance)

    // Check available balance first
    if (withdrawalAmount > availableBalanceNum) {
      toast({
        title: "Insufficient balance",
        description: `You can only withdraw up to ${availableBalance} cUSD from your available earnings.`,
        variant: "destructive",
      })
      return
    }

    // Additional check: verify minimum withdrawal amount
    if (withdrawalAmount < 1) {
      toast({
        title: "Minimum withdrawal amount",
        description: "Minimum withdrawal amount is 1 cUSD",
        variant: "destructive",
      })
      return
    }

    // Check wallet balance before proceeding
    try {
      const walletBalanceCheck = await checkCUSDBalance('1')
      const currentWalletBalance = parseFloat(walletBalanceCheck.balance)
      
      if (currentWalletBalance < withdrawalAmount) {
        toast({
          title: "Insufficient wallet balance",
          description: `Your wallet balance (${currentWalletBalance.toFixed(2)} cUSD) is less than the withdrawal amount. Please ensure you have enough tokens in your wallet.`,
          variant: "destructive",
        })
        return
      }
    } catch (error) {
      console.error("Failed to check wallet balance:", error)
      toast({
        title: "Balance check failed",
        description: "Could not verify wallet balance. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // First, send CUSD to Pretium settlement wallet
      const settlementWallet = pretiumAPI.getSettlementWallet()
      const txResult = await sendCUSD(formData.amount, settlementWallet)
      
      if (!txResult.transactionHash) {
        throw new Error("Failed to send CUSD to settlement wallet")
      }

      // Prepare payment data for Pretium
      let paymentData
      
      if (selectedMethod === "mobile") {
        paymentData = {
          transaction_hash: txResult.transactionHash,
          amount: formData.amount,
          shortcode: formData.phoneNumber,
          type: "MOBILE" as const,
          mobile_network: formData.mobileNetwork,
          chain: "CELO" as const,
        }
      } else if (selectedMethod === "bank" && formData.country === "NGN") {
        paymentData = {
          transaction_hash: txResult.transactionHash,
          amount: formData.amount,
          account_number: formData.accountNumber,
          account_name: formData.accountName,
          bank_name: formData.bankName,
          bank_code: formData.bankCode,
          chain: "CELO" as const,
        }
      }

      if (paymentData) {
        const currency = formData.country === "KES" ? undefined : formData.country
        const paymentResult = await pretiumAPI.initiatePayment(paymentData, currency)
        
        if (paymentResult.success) {
          setTransactionCode(paymentResult.transaction_code)
          setCashOutCompleted(true)
          
          toast({
            title: "Cash out initiated!",
            description: `Your withdrawal of ${fiatEquivalent.toFixed(2)} ${formData.country} is being processed.`,
          })
        } else {
          throw new Error(paymentResult.message || "Payment initiation failed")
        }
      }
    } catch (error) {
      console.error("Cash out failed:", error)
      toast({
        title: "Cash out failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleComplete = () => {
    onCashOutComplete()
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setSelectedMethod(null)
    setFormData({
      country: "",
      amount: "",
      phoneNumber: "",
      mobileNetwork: "",
      accountNumber: "",
      bankCode: "",
      bankName: "",
      accountName: ""
    })
    setValidationResult("")
    setValidatedRecipient(null)
    setExchangeRate(0)
    setFiatEquivalent(0)
    setCashOutCompleted(false)
    setTransactionCode("")
  }

  const resetSelection = () => {
    setSelectedMethod(null)
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedCountry = formData.country ? SUPPORTED_COUNTRIES[formData.country] : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brand-dark">Cash Out Earnings</DialogTitle>
          <DialogDescription className="space-y-1">
            <div>Withdraw your earnings to mobile money or bank account.</div>
            <div className="flex justify-between text-sm">
              <span>Available to withdraw: <strong>{availableBalance} cUSD</strong></span>
              <span>Wallet balance: <strong>{parseFloat(currentWalletBalance).toFixed(2)} cUSD</strong></span>
            </div>
          </DialogDescription>
        </DialogHeader>

        {cashOutCompleted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-dark mb-2">Cash Out Initiated!</h3>
            <p className="text-gray-600 mb-4">
              Your withdrawal of {fiatEquivalent.toFixed(2)} {formData.country} is being processed.
            </p>
            {transactionCode && (
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Transaction Code:</p>
                <p className="font-mono text-sm">{transactionCode}</p>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">
              You'll receive the funds within 1-5 minutes depending on your payment method.
            </p>
            <Button onClick={handleComplete} className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              Done
            </Button>
          </div>
        ) : !selectedMethod ? (
          // Payment method selection
          <div className="space-y-6">
            <div>
              <Label htmlFor="country" className="text-base font-medium text-brand-dark">
                Select Country
              </Label>
              <Select value={formData.country} onValueChange={(value: CountryCode) => updateFormData("country", value)}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Choose your country" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_COUNTRIES).map(([code, country]) => (
                    <SelectItem key={code} value={code}>
                      {country.name} ({code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.country && (
              <>
                <div>
                  <Label htmlFor="amount" className="text-base font-medium text-brand-dark">
                    Amount to Withdraw (cUSD)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => updateFormData("amount", e.target.value)}
                    max={availableBalance}
                    className="mt-2"
                  />
                  {fiatEquivalent > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      ≈ {fiatEquivalent.toFixed(2)} {formData.country}
                      {exchangeRate > 0 && (
                        <span className="ml-2 text-xs">
                          (Rate: 1 USD = {exchangeRate} {formData.country})
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.country !== "NGN" && (
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-brand-purple"
                      onClick={() => setSelectedMethod("mobile")}
                    >
                      <CardHeader className="text-center pb-2">
                        <Smartphone className="h-8 w-8 text-brand-purple mx-auto mb-2" />
                        <CardTitle className="text-lg text-brand-dark">Mobile Money</CardTitle>
                        <CardDescription>
                          {selectedCountry?.networks.join(", ")}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}

                  {formData.country === "NGN" && (
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-brand-purple"
                      onClick={() => setSelectedMethod("bank")}
                    >
                      <CardHeader className="text-center pb-2">
                        <Building2 className="h-8 w-8 text-brand-purple mx-auto mb-2" />
                        <CardTitle className="text-lg text-brand-dark">Bank Transfer</CardTitle>
                        <CardDescription>
                          Direct to your bank account
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          // Selected method form
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={resetSelection} className="text-brand-purple hover:text-brand-purple/80">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to options
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedMethod === "mobile" ? <Smartphone className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                  {selectedMethod === "mobile" ? "Mobile Money Details" : "Bank Account Details"}
                </CardTitle>
                <CardDescription>
                  Withdrawing {formData.amount} cUSD ≈ {fiatEquivalent.toFixed(2)} {formData.country}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMethod === "mobile" && (
                  <>
                    <div>
                      <Label htmlFor="mobileNetwork">Mobile Network</Label>
                      <Select value={formData.mobileNetwork} onValueChange={(value) => updateFormData("mobileNetwork", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCountry?.networks.map((network) => (
                            <SelectItem key={network} value={network}>
                              {network}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="e.g., 0799770833"
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                {selectedMethod === "bank" && formData.country === "NGN" && (
                  <>
                    <div>
                      <Label htmlFor="bankName">Bank</Label>
                      <Select 
                        value={formData.bankCode} 
                        onValueChange={(value) => {
                          const selectedBank = supportedBanks.find(bank => bank.bank_code === value)
                          updateFormData("bankCode", value)
                          updateFormData("bankName", selectedBank?.bank_name || "")
                        }}
                        disabled={isLoadingBanks}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={isLoadingBanks ? "Loading banks..." : "Select bank"} />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedBanks.map((bank) => (
                            <SelectItem key={bank.bank_code} value={bank.bank_code}>
                              {bank.bank_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter account number"
                        value={formData.accountNumber}
                        onChange={(e) => updateFormData("accountNumber", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        placeholder="Enter account holder name"
                        value={formData.accountName}
                        onChange={(e) => updateFormData("accountName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                {validatedRecipient && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 mb-2">Recipient Verified ✓</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700">Name:</span>
                            <span className="font-medium text-green-800">
                              {validatedRecipient.public_name || validatedRecipient.business_name || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">
                              {selectedMethod === "mobile" ? "Phone Number:" : "Account:"}
                            </span>
                            <span className="font-medium text-green-800">
                              {validatedRecipient.shortcode}
                            </span>
                          </div>
                          {validatedRecipient.mobile_network && (
                            <div className="flex justify-between">
                              <span className="text-green-700">Network:</span>
                              <span className="font-medium text-green-800">
                                {validatedRecipient.mobile_network}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-green-700">Status:</span>
                            <span className="font-medium text-green-800">
                              {validatedRecipient.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700">
                          💡 Please confirm these details are correct before proceeding with the cash-out.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={validateRecipient}
                    disabled={isValidating || (selectedMethod === "mobile" && (!formData.phoneNumber || !formData.mobileNetwork)) || (selectedMethod === "bank" && (!formData.accountNumber || !formData.bankCode))}
                    className="flex-1"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      "Validate Recipient"
                    )}
                  </Button>

                  <Button
                    onClick={handleCashOut}
                    disabled={isProcessing || !validatedRecipient}
                    className="flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Cash Out"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 