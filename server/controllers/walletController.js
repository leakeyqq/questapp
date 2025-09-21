import mongoose from "mongoose"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

import Wallet from "./../models/wallets/wallet.js"

export const saveWithdrawalTx = async(req, res) => {
    try{
        console.log('doing withdrawal')
        const {network, txHash, toAddress, amount, tokenSymbol, occurredAt} = req.body
        const userAddress =   req.userWalletAddress  
        // Validate required fields
        if (!network || !txHash || !amount || !tokenSymbol || !toAddress || !occurredAt) {
            return res.status(200).json({
                success: false,
                error: "Missing required fields!"
            })
        }

        // Using findOneAndUpdate with upsert (recommended approach)
        const wallet = await Wallet.findOneAndUpdate(
        { userAddress },
        {
            $push: {
            onchainWithdrawals: {
                network: network.toUpperCase(),
                txHash,
                toAddress,
                amount: amount,
                tokenSymbol: tokenSymbol,
                occurredAt: new Date(occurredAt)
            }
            }
        },
        {
            upsert: true,    // Create if doesn't exist
            new: true,       // Return the updated document
        }
        );

        return res.status(200).json({success: true, wallet})

    }catch(e){
        console.log('error: ', e)
        res.status(200).json({success: false, error: e})
    }
}

export const confirmMpesaName = async(req, res) => {
   
const mpesaNumber = req.body.mpesaNumber

try {
      const PRETIUM_BASE_URI = process.env.PRETIUM_BASE_URI;
  const PRETIUM_API_KEY = process.env.PRETIUM_API_KEY;
  
  const testData = {
    mobile_network: "Safaricom",
    shortcode: mpesaNumber,
    type: "MOBILE",
  };

  console.log('Testing Pretium API with data:', JSON.stringify(testData, null, 2));

  
    const response = await axios.post(`${PRETIUM_BASE_URI}/v1/validation`, testData, {
      headers: {
        "Content-Type": "application/json",
        'x-api-key': PRETIUM_API_KEY
      }
    });
    const data = response.data

    let mpesaName
    if(data.data.status== "COMPLETE"){
        mpesaName = data.data.public_name
    }else{
        mpesaName="NOT FOUND"
    }
    
    console.log(data)
    return res.status(200).json({success: true, mpesaName})
} catch (error) {
    console.log(error)
    return res.status(200).json({success: false, message: error})
}




}

export const submitOfframpRequest = async(req, res) => {
    try {
        const {transactionHash, mpesaNumber, amountUSD} = req.body

        const PRETIUM_BASE_URI = process.env.PRETIUM_BASE_URI;
        const PRETIUM_API_KEY = process.env.PRETIUM_API_KEY;

          const testData = {
            transaction_hash: transactionHash,
            mobile_network: "Safaricom",
            shortcode: mpesaNumber,
            amount: amountUSD * 133,
            // fee: "0",
            type: "MOBILE",
            chain: "CELO",
            callback_url: "https://webhook.site/#!/view/542b6f54-750a-4e4d-bd41-42a3c3cbe615"
        };

            const response = await axios.post(`${PRETIUM_BASE_URI}/v1/pay`, testData, {
              headers: {
                "Content-Type": "application/json",
                'x-api-key': PRETIUM_API_KEY
              }
            });

            const data = response.data

            console.log(data)

    
            return res.status(200).json({success:true, status:data.data.status})

  

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}