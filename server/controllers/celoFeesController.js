import {ethers} from 'ethers'
import dotenv from 'dotenv'
dotenv.config()


export const fundFeesOnWallet = async(req, res)=>{
  console.log('I am here now trying to fund your wallet')
    try {
        const beneficiary_address = req.userWalletAddress
        console.log('waiting for tx')
        const txHash = await sendCelo(beneficiary_address)
        console.log('got tx')
        return res.status(200).json({txHash})
    } catch (error) {
      console.log('error is ', error)
        return res.status(500).json({'error': error.message})
    }

}


async function sendCelo(toAddress) {
    try {
      const provider = new ethers.JsonRpcProvider("https://forno.celo.org");
  
      // Create wallet
      const wallet = new ethers.Wallet(process.env.CELO_FEES_KEY, provider);
      
      console.log(`🟡 Sending 0.001 CELO from ${wallet.address} to ${toAddress}`);
  
      // Send transaction (0.01 CELO)
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther("0.001")
      });
  
      console.log("🟢 Transaction sent:", tx.hash);
      console.log(`🔗 Explorer: https://celoscan.io/tx/${tx.hash}`);
  
      return tx.hash;
    } catch (error) {
      console.error("❌ Error:", error.message);
    //   process.exit(1);
    }
  }