import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import axios from "axios"
import SwyptOnrampOrder from "./../models/swypt/swypt-onramps.js"

export const getSwyptExchangeRate = async(req, res)=>{
    try {
        const amountInUsd = Number(req.query.amountInUsd)
        const KesRate = Number(process.env.USD_TO_KES)
        // Estimate amount needed in Kshs
        let Kes_amount_estimate = amountInUsd * KesRate
        // Fetch exchange rate from Swypt
        let swypt_exchange_rate = await swyptUsdtRate(Kes_amount_estimate)

        // Accurate amount in Kshs
        let Kes_amount_accurate = Math.ceil(amountInUsd * swypt_exchange_rate)
        let roundedRate = parseFloat(swypt_exchange_rate.toFixed(2));

        return res.status(200).json({KES_RATE: roundedRate, amountInKes: Kes_amount_accurate})

    } catch (error) {
        // console.log('error is ', error)
        return res.status(500).json({error: error.msg})
    }
}
export const onRampUserWithMpesa = async(req, res)=>{
    console.log('begin stk push')
    try{
        const amountInUsd = Number(req.body.amountInUsd)
        const mpesaNumber = req.body.mpesaNumber
        console.log('req.body ', req.body)
        // Fetch rates
        const KesRate = Number(process.env.USD_TO_KES)

        // Estimate amount needed in Kshs
        let Kes_amount_estimate = amountInUsd * KesRate

        // Fetch exchange rate from Swypt
        let swypt_exchange_rate = await swyptUsdtRate(Kes_amount_estimate)

        // Accurate amount in Kshs
        let Kes_amount_accurate = Math.ceil(amountInUsd * swypt_exchange_rate)

        // Finished fetching rate
        // Now send STK Push
        let orderId = await initiateStkPush(Kes_amount_accurate, mpesaNumber, req.userWalletAddress )

        // Store the order id on the db
        const newSwyptOrder = new SwyptOnrampOrder({
            userAddress: req.userWalletAddress,
            orderId: orderId
        })
        await newSwyptOrder.save()

        
        return res.status(200).json({stkSent: true, orderId})

    }catch(e){
        console.log(e)
        return res.status(500).json({message: e})
    }
}
export const transferFundsAfterMpesaPayment = async(req, res)=>{

    try {
        // Make sure this is not a repeat request.
        let orderId = req.body.orderId

        // Fetch Order from db
        let existingOrder = await SwyptOnrampOrder.findOne({orderId}).exec()

        if(!existingOrder){
            throw new Error('Swypt order was not registered on our db')
        }else if(existingOrder.cryptoTransferred == true){
            return res.status(200).json({orderStatus: 'success', reason: 'Duplicate transaction'})
        }

        // Check order status from Swypt API
        const response = await axios.get(`https://pool.swypt.io/api/order-onramp-status/${orderId}`, {
            headers: {
                'x-api-key': process.env.SWYPT_API_KEY,
                'x-api-secret': process.env.SWYPT_SECRET_KEY
            }
            });

        const swypt_response = response.data

            // Check if it was successful
        if(swypt_response.status.toLowerCase() != "success"){
            return res.status(200).json({orderStatus: 'error', reason: 'An unexpected error occurred!'})
        }else if(swypt_response.data.status.toLowerCase() == "success"){
            // TODO Call disbursement
            let fundsDisbursed = await transferCrypto_afterOnramp(orderId, req.userWalletAddress)
            if(fundsDisbursed == true){
                return res.status(200).json({orderStatus: 'success'})
            }else{
                console.log('failed to disburse funds')
                return res.status(200).json({orderStatus: 'pending', reason: 'Trying again!'})
            }
        }else if(swypt_response.data.status.toLowerCase() == "pending"){
            return res.status(200).json({orderStatus: 'pending', reason: 'Transaction is still pending. Try again in a few seconds!'})
        }else if(swypt_response.data.status.toLowerCase() == "failed"){
            return res.status(200).json({orderStatus: 'failed', reason: 'Payment did not go through due to insufficient balance or a different reason'})
        }else if(swypt_response.data.status.toLowerCase() == "cancelled"){
            return res.status(200).json({orderStatus: 'cancelled', reason: 'Payment did not go through because the user cancelled!'})
        }else{
            return res.status(200).json({orderStatus: 'error', reason: 'An unexpected error occurred!'})
        }
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({orderStatus: 'error', reason: 'An unexpected error occurred!'})
    }


}

async function swyptUsdtRate(amountKes){
    const response = await axios.post('https://pool.swypt.io/api/swypt-quotes', {
        type: "onramp",
        amount: amountKes,
        fiatCurrency: "KES",
        cryptoCurrency: "USDT", //cKes, USDC
        network: "celo"
        }, {
        headers: {
            'x-api-key': process.env.SWYPT_API_KEY,
            'x-api-secret': process.env.SWYPT_SECRET_KEY
        }
    });

    const swyptResponse = response.data

    if(swyptResponse.statusCode != 200){
        throw new Error('Payment provider is malfunctioning')
    }

    let receivedRate = Number(swyptResponse.data.exchangeRate)

    // Increase rate by 0.005% increase of any errors
    receivedRate *= 1.005
    return receivedRate
}
async function initiateStkPush(Kes_amount, mpesaNumber, receiverAddress){
      const response = await axios.post('https://pool.swypt.io/api/swypt-onramp', {
        partyA: mpesaNumber,
        amount: Kes_amount,
        side: "onramp",
        userAddress: receiverAddress,
        tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" // USDT
        }, {
        headers: {
            'x-api-key': process.env.SWYPT_API_KEY,
            'x-api-secret': process.env.SWYPT_SECRET_KEY
        }
        });

    // console.log(JSON.stringify(response.data, null, 2))  
    const swyptResponse = response.data
    if(swyptResponse.status.toLowerCase() != "success"){
        throw new Error('Stk push failed to send!')
    }

    return swyptResponse.data.orderID
}
async function transferCrypto_afterOnramp(orderId, receiverAddress){
    console.log('before transferring crypto')

    try{
      const response = await axios.post('https://pool.swypt.io/api/swypt-deposit', {
      chain: "celo",
      address: receiverAddress,
      orderID: orderId,
      project: "onramp"
    }, {
      headers: {
        'x-api-key': process.env.SWYPT_API_KEY,
        'x-api-secret': process.env.SWYPT_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('after transferring crypto')
    // Update db

    console.log('before updating db')
    await SwyptOnrampOrder.findOneAndUpdate(
      { orderId },
      {
        orderStatus: 'success',
        cryptoTransferred: true,
        MpesaReceiptNumber: response.data.MpesaReceiptNumber,
        hash: response.data.hash,
        cryptoAmount: response.data.cryptoAmount
      }
    );
    console.log('after updating db')

    return true;
  } catch (error) {
    console.log('an error appears during crypto transfer')
    console.error('Error in transferCrypto_afterOnramp:', {
      orderId,
      receiverAddress,
      error: error.response?.data || error.message
    });
    return false;
  }

    // const response = await axios.post('https://pool.swypt.io/api/swypt-deposit', {
    //     chain: "celo",
    //     address: receiverAddress,
    //     orderID: orderId,
    //     project: "onramp"
    //     }, {
    //     headers: {
    //         'x-api-key': process.env.SWYPT_API_KEY,
    //         'x-api-secret': process.env.SWYPT_SECRET_KEY
    //     }
    //     });

    // const swypt_response = response.data

    // if(swypt_response.status != 200){
    //     return false
    // }
    // await SwyptOnrampOrder.findOneAndUpdate(
    //     {orderId},
    //     {
    //         orderStatus: 'success',
    //         cryptoTransferred: true,
    //         MpesaReceiptNumber: swypt_response.MpesaReceiptNumber,
    //         hash: swypt_response.hash,
    //         cryptoAmount: swypt_response.cryptoAmount

    //     }
    // )

    // return true
}